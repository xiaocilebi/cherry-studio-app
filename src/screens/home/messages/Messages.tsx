import { FC, useRef } from 'react'
import React from 'react'
import { FlatList } from 'react-native'
import { View, YStack } from 'tamagui'

import { useMessages } from '@/hooks/useMessages'
import { Assistant, Topic } from '@/types/assistant'
import { GroupedMessage } from '@/types/message'
import { getGroupedMessages } from '@/utils/messageUtils/filters'

import MessageGroup from './MessageGroup'

interface MessagesProps {
  assistant: Assistant
  topic: Topic
}

const Messages: FC<MessagesProps> = ({ assistant, topic }) => {
  const { messages } = useMessages(topic.id)
  const groupedMessages = Object.entries(getGroupedMessages(messages)).reverse()
  const flashListRef = useRef<FlatList<[string, GroupedMessage[]]>>(null)

  const renderMessageGroup = ({ item }: { item: [string, GroupedMessage[]] }) => {
    return <MessageGroup assistant={assistant} item={item} />
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flashListRef}
        showsVerticalScrollIndicator={false}
        data={groupedMessages}
        renderItem={renderMessageGroup}
        keyExtractor={([key, group]) => `${key}-${group[0]?.id}`}
        ItemSeparatorComponent={() => <YStack height={20} />}
        inverted
        scrollsToTop={false}
        keyboardShouldPersistTaps={false}
        initialNumToRender={2}
        maxToRenderPerBatch={10}
      />
    </View>
  )
}

export default Messages
