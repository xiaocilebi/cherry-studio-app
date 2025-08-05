import { FlashList } from '@shopify/flash-list'
import { FC } from 'react'
import React from 'react'
import { View, YStack } from 'tamagui'

import { useMessages } from '@/hooks/useMessages'
import { Assistant, Topic } from '@/types/assistant'
import { Message } from '@/types/message'
import { GroupedMessage } from '@/types/message'
import { getGroupedMessages } from '@/utils/messageUtils/filters'

import MessageGroup from './MessageGroup'

interface MessagesProps {
  assistant: Assistant
  topic: Topic
  onMessageAction: (message: Message) => void
}

const Messages: FC<MessagesProps> = ({ assistant, topic, onMessageAction }) => {
  const { messages } = useMessages(topic.id)
  const groupedMessages = Object.entries(getGroupedMessages(messages))

  const renderMessageGroup = ({ item }: { item: [string, GroupedMessage[]] }) => {
    return <MessageGroup assistant={assistant} item={item} onMessageAction={onMessageAction} />
  }

  return (
    <View style={{ flex: 1, minHeight: 200 }}>
      <FlashList
        showsVerticalScrollIndicator={false}
        data={groupedMessages}
        renderItem={renderMessageGroup}
        keyExtractor={([key, group]) => `${key}-${group[0]?.id}`}
        estimatedItemSize={100} // 估算值可能需要根据内容调整
        ItemSeparatorComponent={() => <YStack height={20} />}
      />
    </View>
  )
}

export default Messages
