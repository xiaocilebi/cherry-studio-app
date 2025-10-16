import { MotiView } from 'moti'
import React, { FC, useCallback, useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native'

import { YStack } from '@/componentsV2'

import { useMessages } from '@/hooks/useMessages'
import { useTopicBlocks } from '@/hooks/useMessageBlocks'
import { Assistant, Topic } from '@/types/assistant'
import { GroupedMessage } from '@/types/message'
import { getGroupedMessages } from '@/utils/messageUtils/filters'

import MessageGroup from './MessageGroup'
import { LegendList, LegendListRef } from '@legendapp/list'
import { Button } from 'heroui-native'
import { ChevronDown } from '@/componentsV2/icons'
import WelcomeContent from '../WelcomeContent'

interface MessagesProps {
  assistant: Assistant
  topic: Topic
}

const Messages: FC<MessagesProps> = ({ assistant, topic }) => {
  const { messages } = useMessages(topic.id)
  const { messageBlocks } = useTopicBlocks(topic.id)
  const groupedMessages = Object.entries(getGroupedMessages(messages))
  const legendListRef = useRef<LegendListRef>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const renderMessageGroup = ({ item }: { item: [string, GroupedMessage[]] }) => {
    return (
      <MotiView
        from={{
          opacity: 0,
          translateY: 10
        }}
        animate={{
          opacity: 1,
          translateY: 0
        }}
        transition={{
          type: 'timing',
          duration: 300,
          delay: 100
        }}>
        <MessageGroup assistant={assistant} item={item} messageBlocks={messageBlocks} />
      </MotiView>
    )
  }

  const scrollToBottom = useCallback(() => {
    if (legendListRef.current && groupedMessages.length > 0) {
      legendListRef.current.scrollToOffset({ offset: 9999999, animated: true })
    }
  }, [groupedMessages.length])

  const handleScrollToEnd = () => {
    scrollToBottom()
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
    const threshold = 100
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y
    setShowScrollButton(distanceFromBottom > threshold)
  }

  return (
    <View className="flex-1 py-4">
      <LegendList
        ref={legendListRef}
        showsVerticalScrollIndicator={false}
        data={groupedMessages}
        extraData={assistant}
        renderItem={renderMessageGroup}
        keyExtractor={([key, group]) => `${key}-${group[0]?.id}`}
        ItemSeparatorComponent={() => <YStack className="h-5" />}
        contentContainerStyle={{
          flexGrow: 1
        }}
        onScroll={handleScroll}
        recycleItems
        maintainScrollAtEnd
        maintainScrollAtEndThreshold={0.1}
        keyboardShouldPersistTaps="never"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={<WelcomeContent />}
      />

      {showScrollButton && (
        <MotiView
          key="scroll-to-bottom-button"
          style={styles.fab}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'timing' }}>
          <Button
            isIconOnly
            onPress={handleScrollToEnd}
            className="w-10 h-10 rounded-full border-2 border-green-20 dark:border-green-20 bg-green-10 dark:bg-green-dark-10 right-2 bottom-2">
            <Button.Label>
              <ChevronDown size={24} className="text-green-100 dark:text-green-100" />
            </Button.Label>
          </Button>
        </MotiView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Messages
