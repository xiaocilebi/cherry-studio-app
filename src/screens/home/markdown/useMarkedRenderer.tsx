import { Copy } from '@tamagui/lucide-icons'
import * as Clipboard from 'expo-clipboard'
import React, { ReactNode, useMemo } from 'react'
import { StyleSheet, TextStyle, ViewStyle } from 'react-native'
import CodeHighlighter from 'react-native-code-highlighter'
import type { RendererInterface } from 'react-native-marked'
import { MarkedTokenizer, Renderer } from 'react-native-marked'
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Button, Image, Text, View, XStack } from 'tamagui'

import { getCodeLanguageIcon } from '@/utils/icons/codeLanguage'

import { markdownColors } from './MarkdownStyles'
import { useMathEquation } from './useMathEquation'

// const logger = loggerService.withContext('useMarkedRenderer')

class CustomTokenizer extends MarkedTokenizer {}

class CustomRenderer extends Renderer implements RendererInterface {
  private isDark: boolean
  private equationColor: string
  private extractMathEquation: (text: string) => string | null
  private renderInlineMath: (content: string, key?: string | number) => React.JSX.Element

  constructor(
    isDark: boolean,
    extractMathEquation: (text: string) => string | null,
    renderInlineMath: (content: string, key?: string | number) => React.JSX.Element
  ) {
    super()
    this.isDark = isDark
    this.equationColor = isDark ? markdownColors.dark.text : markdownColors.light.text
    this.extractMathEquation = extractMathEquation
    this.renderInlineMath = renderInlineMath
  }

  private async onCopy(content: string) {
    await Clipboard.setStringAsync(content)
  }

  // Override code block rendering
  code(text: string, language?: string, containerStyle?: ViewStyle, textStyle?: TextStyle): ReactNode {
    const lang = language || 'text'
    const currentColors = this.isDark ? markdownColors.dark : markdownColors.light
    return (
      <View
        key={this.getKey()}
        style={{
          gap: 10,
          padding: 5,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: this.isDark ? '#8de59e26' : '#8de59e26',
          backgroundColor: currentColors.background,
          ...containerStyle
        }}>
        <XStack
          flex={1}
          paddingVertical={5}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderColor="$green10">
          <XStack gap={8} flex={1} alignItems="center">
            {getCodeLanguageIcon(lang) && <Image source={getCodeLanguageIcon(lang)} width={18} height={18} />}
            <Text fontSize={13} lineHeight={16} color={currentColors.text}>
              {lang.toUpperCase()}
            </Text>
          </XStack>
          <Button size={18} chromeless circular icon={<Copy size={16} />} onPress={() => this.onCopy(text)} />
        </XStack>
        <CodeHighlighter
          customStyle={{ backgroundColor: 'transparent' }}
          scrollViewProps={{
            contentContainerStyle: {
              backgroundColor: currentColors.background
            },
            showsHorizontalScrollIndicator: false
          }}
          textStyle={{
            ...styles.text,
            ...textStyle
          }}
          hljsStyle={this.isDark ? atomOneDark : atomOneLight}
          language={lang}
          wrapLines={true}
          wrapLongLines={true}
          lineProps={{ style: { flexWrap: 'wrap' } }}>
          {text}
        </CodeHighlighter>
      </View>
    )
  }

  // Override inline code rendering
  codespan(text: string): ReactNode {
    // support katex
    const equation = this.extractMathEquation(text)

    if (equation) {
      return this.renderInlineMath(equation, this.getKey())
    }

    return (
      <Text key={this.getKey()} color="$green100" fontFamily="monospace">
        {text}
      </Text>
    )
  }

  // Override heading rendering
  // heading(text: string | ReactNode[], styles?: TextStyle): ReactNode {
  //   const currentColors = this.isDark ? markdownColors.dark : markdownColors.light

  //   return super.heading(text, { ...styles, color: currentColors.text })
  // }

  // Override paragraph rendering
  paragraph(children: ReactNode[], styles?: ViewStyle): ReactNode {
    const currentColors = this.isDark ? markdownColors.dark : markdownColors.light

    return (
      <View
        key={this.getKey()}
        style={{
          marginTop: 6,
          marginBottom: 6,
          backgroundColor: 'transparent',
          ...styles
        }}>
        <Text style={{ backgroundColor: 'transparent', color: currentColors.text, fontSize: 16 }}>{children}</Text>
      </View>
    )
  }

  text(text: string | ReactNode[], styles?: TextStyle): ReactNode {
    const currentColors = this.isDark ? markdownColors.dark : markdownColors.light

    if (typeof text === 'string') {
      // support katex
      const equation = this.extractMathEquation(text)

      if (equation) {
        return this.renderInlineMath(equation, this.getKey())
      }
    }

    // return (
    //   <Text selectable key={this.getKey()} style={[styles, { color: currentColors.text }]}>
    //     {text}
    //   </Text>
    // )

    return super.text(text, {
      ...styles,
      color: currentColors.text,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    })
  }

  // em(children: string | ReactNode[], styles?: TextStyle): ReactNode {
  //   const currentColors = this.isDark ? markdownColors.dark : markdownColors.light

  //   return (
  //     <Text selectable key={this.getKey()} style={[styles, { color: currentColors.text }]}>
  //       {children}
  //     </Text>
  //   )
  // }

  // strong(children: string | ReactNode[], styles?: TextStyle): ReactNode {
  //   const currentColors = this.isDark ? markdownColors.dark : markdownColors.light

  //   return (
  //     <Text selectable key={this.getKey()} style={[styles, { color: currentColors.text }]}>
  //       {children}
  //     </Text>
  //   )
  // }

  // del(children: string | ReactNode[], styles?: TextStyle): ReactNode {
  //   const currentColors = this.isDark ? markdownColors.dark : markdownColors.light

  //   return (
  //     <Text selectable key={this.getKey()} style={[styles, { color: currentColors.text }]}>
  //       {children}
  //     </Text>
  //   )
  // }

  list(
    ordered: boolean,
    li: ReactNode[],
    listStyle?: ViewStyle,
    textStyle?: TextStyle,
    startIndex?: number
  ): ReactNode {
    const currentColors = this.isDark ? markdownColors.dark : markdownColors.light
    return super.list(
      ordered,
      li,
      { ...listStyle, ...currentColors, alignItems: 'center', justifyContent: 'center' },
      { ...textStyle, textAlign: 'center', alignSelf: 'center' },
      startIndex
    )
  }

  listItem(children: ReactNode[], styles?: ViewStyle): ReactNode {
    return super.listItem(children, { ...styles, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' })
  }
}

/**
 * A hook that provides the configuration for react-native-marked,
 * including custom tokenizers and renderers for math equations and enhanced code blocks.
 * @param isDark - Whether the theme is dark, used for styling.
 */
export const useMarkedRenderer = (isDark: boolean) => {
  const equationColor = isDark ? markdownColors.dark.text : markdownColors.light.text
  const { extractMathEquation, renderInlineMath } = useMathEquation(equationColor)

  const renderer = useMemo(
    () => new CustomRenderer(isDark, extractMathEquation, renderInlineMath),
    [isDark, extractMathEquation, renderInlineMath]
  )
  const tokenizer = useMemo(() => new CustomTokenizer(), [])

  return { renderer, tokenizer }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontFamily: 'JetbrainMono'
  }
})
