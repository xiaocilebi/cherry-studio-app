import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { SafeAreaContainer } from '@/componentsV2'
import { useAssistant } from '@/hooks/useAssistant'
import { useTopic } from '@/hooks/useTopic'

import Messages from './messages/Messages'

interface ChatContentProps {
  topicId: string
}

const ChatContent = ({ topicId }: ChatContentProps) => {
  const [shouldLoadTopic, setShouldLoadTopic] = useState(false)
  const previousTopicId = useRef<string>('')

  // 监听 topicId 变化，每次变化时重置并重新触发延迟逻辑
  // 延迟 300ms 避免在 drawer 动画期间查询数据库
  useEffect(() => {
    if (previousTopicId.current !== topicId) {
      // topicId 变化，重置为 false，避免立即查询
      setShouldLoadTopic(false)
      previousTopicId.current = topicId

      // 延迟 300ms 后再允许加载数据
      const timer = setTimeout(() => {
        setShouldLoadTopic(true)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [topicId])

  // 条件调用 useTopic，只有在延迟后才真正查询数据
  const { topic, isLoading: topicLoading } = useTopic(shouldLoadTopic ? topicId : '')
  const { assistant, isLoading: assistantLoading } = useAssistant(topic?.assistantId || '')

  if (topicLoading || !topic || assistantLoading || !assistant) {
    return (
      <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  return (
    <View style={styles.container}>
      <Messages assistant={assistant} topic={topic} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%'
  }
})

export default ChatContent
