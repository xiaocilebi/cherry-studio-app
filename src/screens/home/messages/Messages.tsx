import { ChevronDown } from '@tamagui/lucide-icons'
import { FC, useRef, useState } from 'react'
import React from 'react'
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { Button, View, YStack } from 'tamagui'

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
  const groupedMessages = Object.entries(getGroupedMessages(messages))
  const flashListRef = useRef<FlatList<[string, GroupedMessage[]]>>(null)
  const [showScrollButton, setShowScrollButton] = useState(true)

  const renderMessageGroup = ({ item }: { item: [string, GroupedMessage[]] }) => {
    return <MessageGroup assistant={assistant} item={item} />
  }

  const handleScrollToEnd = () => {
    if (flashListRef.current) {
      flashListRef.current.scrollToEnd({ animated: true })
    }
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
    const threshold = 100
    const distanceFromBottom = contentSize.height - contentOffset.y - layoutMeasurement.height

    setShowScrollButton(distanceFromBottom > threshold)
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
        // inverted
        // contentContainerStyle={{
        //   flexGrow: 1,
        //   justifyContent: 'flex-end'
        // }}
        scrollsToTop={true}
        initialNumToRender={2}
        maxToRenderPerBatch={10}
        keyboardShouldPersistTaps="never"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {showScrollButton && (
        <Button
          onPress={handleScrollToEnd}
          position="absolute"
          bottom={2}
          right={2}
          size={40}
          circular
          borderWidth={2}
          borderColor="$green20"
          icon={<ChevronDown size={24} color="$green100" />}
        />
      )}
    </View>
  )
}

export default Messages
