import React, { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import MarqueeComponent from '@/components/ui/MarqueeComponent'
import { ThinkingMessageBlock } from '@/types/message'

import ReactNativeMarkdown from '../../markdown/ReactNativeMarkdown'

interface Props {
  block: ThinkingMessageBlock
}

const ThinkingBlock: React.FC<Props> = ({ block }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleExpanded}>
        <MarqueeComponent block={block} expanded={expanded} />
      </Pressable>
      {expanded && (
        <View style={styles.contentContainer}>
          <ReactNativeMarkdown block={block} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // TODO: 里面的文本不会自动撑开，当有文字时才会撑开，不知道为什么，这里目前先写死
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 185, 107, 0.15)',
    justifyContent: 'center'
  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingVertical: 5,
    borderRadius: 8
  }
})

export default ThinkingBlock
