import { Copy } from '@tamagui/lucide-icons'
import * as Clipboard from 'expo-clipboard'
import React, { ReactNode } from 'react'
import { StyleSheet, TextStyle, ViewStyle } from 'react-native'
import CodeHighlighter from 'react-native-code-highlighter'
import type { RendererInterface, Tokens } from 'react-native-marked'
import { MarkedTokenizer, Renderer } from 'react-native-marked'
import MathJax from 'react-native-mathjax-svg'
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Button, Image, Text, View, XStack } from 'tamagui'

import { loggerService } from '@/services/LoggerService'
import { getCodeLanguageIcon } from '@/utils/icons/codeLanguage'

import { markdownColors } from './MarkdownStyles'

const logger = loggerService.withContext('useMarkedRenderer')

class CustomTokenizer extends MarkedTokenizer {
  codespan(src: string): Tokens.Codespan | undefined {
    const match = src.match(/^\$+([^\$\n]+?)\$+/)

    if (match?.[1]) {
      return {
        type: 'codespan',
        raw: match[0],
        text: match[0]
      }
    }

    return super.codespan(src)
  }
}

class CustomRenderer extends Renderer implements RendererInterface {
  private isDark: boolean
  private equationColor: string

  constructor(isDark: boolean) {
    super()
    this.isDark = isDark
    this.equationColor = isDark ? markdownColors.dark.text : markdownColors.light.text
  }

  private async onCopy(content: string) {
    await Clipboard.setStringAsync(content)
  }

  private renderInlineMath(content: string) {
    return (
      <MathJax key={this.getKey()} fontSize={16} color={this.equationColor}>
        {content}
      </MathJax>
    )
  }

  // Override code block rendering
  code(text: string, language?: string, containerStyle?: ViewStyle, textStyle?: TextStyle): ReactNode {
    logger.info('render code')
    const lang = language || 'text'

    return (
      <View
        key={this.getKey()}
        style={{
          gap: 10,
          padding: 5,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: this.isDark ? '#8de59e26' : '#8de59e26',
          backgroundColor: this.isDark ? '#121213ff' : '#f7f7f7ff',
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
            <Image source={getCodeLanguageIcon(lang)} width={18} height={18} />
            <Text fontSize={13} lineHeight={16}>
              {lang.toUpperCase()}
            </Text>
          </XStack>
          <Button size={18} chromeless circular icon={<Copy size={16} />} onPress={() => this.onCopy(text)} />
        </XStack>
        <CodeHighlighter
          customStyle={{ backgroundColor: 'transparent' }}
          scrollViewProps={{
            contentContainerStyle: {
              backgroundColor: this.isDark ? '#161b22' : '#f6f8fa'
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
    logger.info('render codespan', text)
    const match = text.match(/^\$+([^\$\n]+?)\$+/)

    if (match?.[1]) {
      return this.renderInlineMath(match[1])
    }

    return (
      <Text key={this.getKey()} color="$green100" fontFamily="monospace">
        {text}
      </Text>
    )
  }

  // Override heading rendering
  // heading(text: string | ReactNode[], styles?: TextStyle, depth?: number): ReactNode {
  //   logger.info('render heading')
  //   const currentColors = this.isDark ? markdownColors.dark : markdownColors.light

  //   const headingStyles = {
  //     1: { fontSize: 30, marginTop: 48, marginBottom: 24 },
  //     2: { fontSize: 24, marginTop: 24, marginBottom: 24 },
  //     3: { fontSize: 20, marginTop: 24, marginBottom: 16 },
  //     4: { fontSize: 16, marginTop: 16, marginBottom: 8 },
  //     5: { fontSize: 16, marginTop: 16, marginBottom: 8 },
  //     6: { fontSize: 16, marginTop: 16, marginBottom: 8 }
  //   }

  //   const level = depth || 1
  //   const levelStyle = headingStyles[level as keyof typeof headingStyles] || headingStyles[6]

  //   return (
  //     <Text
  //       key={this.getKey()}
  //       style={{
  //         fontWeight: 'bold',
  //         color: currentColors.text,
  //         ...levelStyle,
  //         ...styles
  //       }}>
  //       {text}
  //     </Text>
  //   )
  // }

  // Override paragraph rendering
  paragraph(children: ReactNode[], styles?: ViewStyle): ReactNode {
    logger.info('render paragraph')
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
}

/**
 * A hook that provides the configuration for react-native-marked,
 * including custom tokenizers and renderers for math equations and enhanced code blocks.
 * @param isDark - Whether the theme is dark, used for styling.
 */
export const useMarkedRenderer = (isDark: boolean) => {
  const renderer = new CustomRenderer(isDark)
  const tokenizer = new CustomTokenizer()

  return { renderer, tokenizer }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontFamily: 'JetbrainMono'
  }
})
