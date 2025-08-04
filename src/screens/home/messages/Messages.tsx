
import BottomSheet from '@gorhom/bottom-sheet'
import { FlashList } from '@shopify/flash-list'
import { FC } from 'react'
import React from 'react'
import { View, YStack } from 'tamagui'

import { useMessages } from '@/hooks/useMessages'
import { Assistant, Topic } from '@/types/assistant'
import { GroupedMessage } from '@/types/message'
import { getGroupedMessages } from '@/utils/messageUtils/filters'

import MessageGroup from './MessageGroup'

interface MessagesProps {
  assistant: Assistant
  topic: Topic
  bottomSheetRef: React.RefObject<BottomSheet | null>
  setSelectedMessage: React.Dispatch<React.SetStateAction<Message | null>>
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Messages: FC<MessagesProps> = ({
  assistant,
  topic,
  bottomSheetRef,
  setIsBottomSheetOpen,
  setSelectedMessage
}) => {
  const { messages } = useMessages(topic.id)
  const groupedMessages = Object.entries(getGroupedMessages(messages))

  const renderMessageGroup = ({ item }: { item: [string, GroupedMessage[]] }) => {
    return (
      <MessageGroup
        assistant={assistant}
        item={item}
        bottomSheetRef={bottomSheetRef}
        setIsBottomSheetOpen={setIsBottomSheetOpen}
        setSelectedMessage={setSelectedMessage}
      />
    )
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
