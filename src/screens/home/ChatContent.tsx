import { ChevronDown } from '@tamagui/lucide-icons'
import { AnimatePresence, MotiView } from 'moti'
import React, { useState } from 'react'
import { ActivityIndicator, NativeScrollEvent, StyleSheet, View } from 'react-native'
import { Button } from 'tamagui'

import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useAssistant } from '@/hooks/useAssistant'
import { Topic } from '@/types/assistant'

import Messages from './messages/Messages'

interface ChatContentProps {
  topic: Topic
}

const ChatContent = ({ topic }: ChatContentProps) => {
  const { assistant, isLoading } = useAssistant(topic.assistantId)
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false)

  if (isLoading || !assistant) {
    return (
      <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  const handleScroll = (event: NativeScrollEvent) => {
    const { layoutMeasurement, contentOffset, contentSize } = event

    const paddingToBottom = 20

    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom

    setShowScrollToBottomButton(!isAtBottom)
  }

  return (
    <View style={styles.container}>
      <Messages
        key={topic.id}
        assistant={assistant}
        topic={topic}
        onScroll={handleScroll}
        onScrollToBottom={scrollToBottom => {
          const handleScrollToBottom = () => {
            scrollToBottom()
            setShowScrollToBottomButton(false)
          }

          return (
            <AnimatePresence>
              {showScrollToBottomButton && (
                <MotiView
                  key="scroll-to-bottom-button"
                  style={styles.fab}
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'timing' }}>
                  <Button
                    circular
                    borderWidth={2}
                    borderColor="$gray20"
                    icon={<ChevronDown size={24} color="$gray80" />}
                    onPress={handleScrollToBottom}
                  />
                </MotiView>
              )}
            </AnimatePresence>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ChatContent
