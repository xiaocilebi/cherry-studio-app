import { ChevronDown } from '@tamagui/lucide-icons'
import { MotiView } from 'moti'
import { FC, useRef, useState } from 'react'
import React from 'react'
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from 'react-native'
import { AnimatePresence, Button, View, YStack } from 'tamagui'

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
  const flastListRef = useRef<FlatList<[string, GroupedMessage[]]>>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const renderMessageGroup = ({ item }: { item: [string, GroupedMessage[]] }) => {
    return <MessageGroup assistant={assistant} item={item} />
  }

  const handleScrollToEnd = () => {
    if (flastListRef.current) {
      flastListRef.current.scrollToIndex({ index: 0, animated: true })
    }
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent
    const threshold = 100

    setShowScrollButton(contentOffset.y > threshold)
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flastListRef}
        showsVerticalScrollIndicator={false}
        data={groupedMessages}
        renderItem={renderMessageGroup}
        keyExtractor={([key, group]) => `${key}-${group[0]?.id}`}
        ItemSeparatorComponent={() => <YStack height={20} />}
        inverted
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end'
        }}
        scrollsToTop={false}
        initialNumToRender={2}
        maxToRenderPerBatch={10}
        keyboardShouldPersistTaps="never"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <AnimatePresence>
        {showScrollButton && (
          <MotiView
            key="scroll-to-bottom-button"
            style={styles.fab}
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'timing' }}>
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
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  )
}

const styles = StyleSheet.create({
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

export default Messages
