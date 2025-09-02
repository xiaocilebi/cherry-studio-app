import React, { memo } from 'react'
import { View } from 'react-native'
import MathJax from 'react-native-mathjax-svg'

// Memoized MathJax component to prevent unnecessary re-renders
export const MemoizedMathJax = memo(
  ({ content, fontSize, color }: { content: string; fontSize: number; color: string }) => {
    return (
      <MathJax fontSize={fontSize} color={color} style={{ height: 20, alignItems: 'center', justifyContent: 'center' }}>
        {content}
      </MathJax>
    )
  }
)

MemoizedMathJax.displayName = 'MemoizedMathJax'

/**
 * Hook for math equation functionality
 * @param equationColor - Color for the math equations
 */
export const useMathEquation = (equationColor: string) => {
  /**
   * Check if text contains math equation pattern
   * @param text - Text to check
   * @returns Matched equation content or null
   */
  const extractMathEquation = (text: string): string | null => {
    // Match $...$ or $$...$$ patterns
    const dollarMatch = text.match(/\$+([^\$\n]+?)\$+/)

    if (dollarMatch?.[1]) {
      return dollarMatch[1]
    }

    // Match \(...\) pattern
    const parenMatch = text.match(/\\\((.+?)\\\)/)

    if (parenMatch?.[1]) {
      return parenMatch[1]
    }

    return null
  }

  /**
   * Render inline math equation
   * @param content - Math equation content
   * @param key - React key for the component
   */
  const renderInlineMath = (content: string, key?: string | number) => {
    return (
      <View key={key} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <MemoizedMathJax content={content} fontSize={16} color={equationColor} />
      </View>
    )
  }

  return {
    extractMathEquation,
    renderInlineMath
  }
}
