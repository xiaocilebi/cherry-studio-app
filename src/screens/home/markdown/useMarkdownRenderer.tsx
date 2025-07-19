import markdownIt from 'markdown-it'
import markdownItMath from 'markdown-it-math/no-default-renderer'
import React from 'react'
import { ASTNode } from 'react-native-markdown-display'
import MathJax from 'react-native-mathjax-svg'
import { Text, View } from 'tamagui'
import temml from 'temml'

import { loggerService } from '@/services/LoggerService'

import { markdownColors } from './MarkdownStyles'
const logger = loggerService.withContext('useMarkdownRenderer')

const markdownItInstance = markdownIt().use(markdownItMath, {
  inlineAllowWhiteSpacePadding: true,
  inlineRenderer: str => temml.renderToString(str),
  blockRenderer: str => temml.renderToString(str, { displayMode: true })
})

/**
 * A hook that provides the configuration for react-native-markdown-display,
 * including the markdown-it instance and custom rendering rules for math equations.
 * @param isDark - Whether the theme is dark, used for coloring equations.
 */
export const useMarkdownRenderer = (isDark: boolean) => {
  const equationColor = isDark ? markdownColors.dark.text : markdownColors.light.text

  const renderEquation = (node: ASTNode, isBlock: boolean) => {
    try {
      return (
        <View
          key={node.key}
          style={{
            paddingVertical: isBlock ? 10 : 0,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <MathJax color={equationColor}>{node.content}</MathJax>
        </View>
      )
    } catch (error) {
      logger.error('Error rendering equation:', error)
      return <Text key={node.key}>[Math Error]</Text>
    }
  }

  const rules = {
    math_inline: (node: ASTNode) => renderEquation(node, false),
    math_block: (node: ASTNode) => renderEquation(node, true),
    textgroup: (node: ASTNode, children: React.ReactNode) => {
      return <Text key={node.key}>{children}</Text>
    }
  }

  return { markdownItInstance, rules }
}
