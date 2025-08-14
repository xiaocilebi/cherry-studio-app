import { FlashList } from '@shopify/flash-list'
import { MotiView } from 'moti'
import { FC, useRef } from 'react'
import React from 'react'
import { NativeScrollEvent } from 'react-native'
import { View, YStack } from 'tamagui'

import { useMessages } from '@/hooks/useMessages'
import { Assistant, Topic } from '@/types/assistant'
import { GroupedMessage } from '@/types/message'
import { getGroupedMessages } from '@/utils/messageUtils/filters'

import MessageGroup from './MessageGroup'

interface MessagesProps {
  assistant: Assistant
  topic: Topic
  autoScroll: boolean
  setAutoScroll: (value: boolean) => void
  onScroll?: (event: NativeScrollEvent) => void
  onScrollToBottom?: (scrollToBottom: () => void) => React.ReactNode
}

const Messages: FC<MessagesProps> = ({ assistant, topic, autoScroll, setAutoScroll, onScroll, onScrollToBottom }) => {
  const { messages } = useMessages(topic.id)
  const groupedMessages = Object.entries(getGroupedMessages(messages)).reverse()
  const flashListRef = useRef<FlashList<[string, GroupedMessage[]]>>(null)

  const renderMessageGroup = ({ item }: { item: [string, GroupedMessage[]] }) => {
    return <MessageGroup assistant={assistant} item={item} />
  }

  const scrollToBottom = () => {
    if (flashListRef.current && groupedMessages.length > 0) {
      setTimeout(() => {
        flashListRef.current?.scrollToIndex({
          index: groupedMessages.length - 1,
          animated: true,
          viewPosition: 1
        })
      }, 0)
    }
  }

  return (
    <View style={{ flex: 1, minHeight: 200 }}>
      <MotiView
        style={{ flex: 1 }}
        from={{ opacity: 0, translateY: 10 }}
        animate={{
          translateY: 0,
          opacity: 1
        }}
        exit={{ opacity: 1, translateY: -10 }}
        transition={{
          type: 'timing'
        }}>
        <FlashList
          ref={flashListRef}
          showsVerticalScrollIndicator={false}
          data={groupedMessages}
          renderItem={renderMessageGroup}
          keyExtractor={([key, group]) => `${key}-${group[0]?.id}`}
          estimatedItemSize={100}
          ItemSeparatorComponent={() => <YStack height={20} />}
          onScroll={onScroll ? ({ nativeEvent }) => onScroll(nativeEvent) : undefined}
          scrollEventThrottle={16}
          inverted
          onContentSizeChange={() => {
            if (autoScroll) {
              scrollToBottom()
            }
          }}
          onScrollBeginDrag={() => setAutoScroll(false)}
        />
      </MotiView>
      {onScrollToBottom?.(scrollToBottom)}
    </View>
  )
}

export default Messages
