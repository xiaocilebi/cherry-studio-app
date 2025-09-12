import { ChevronDown } from '@tamagui/lucide-icons'
import { debounce } from 'lodash'
import { MotiView } from 'moti'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import React from 'react'
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet } from 'react-native'
import { Easing } from 'react-native-reanimated'
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
  const groupedMessages = Object.entries(getGroupedMessages(messages))
  const flastListRef = useRef<FlatList<[string, GroupedMessage[]]>>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(false)

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
          delay: 250,
          easing: Easing.out(Easing.ease)
        }}>
        <MessageGroup assistant={assistant} item={item} />
      </MotiView>
    )
  }

  const scrollToBottom = useCallback(() => {
    if (flastListRef.current && groupedMessages.length > 0) {
      flastListRef.current.scrollToOffset({ offset: 9999999, animated: true })
    }
  }, [groupedMessages.length])

  const handleScrollToEnd = () => {
    scrollToBottom()
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
    const threshold = 200
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y

    setShowScrollButton(distanceFromBottom > threshold)
    setIsNearBottom(distanceFromBottom < threshold)
  }

  const debouncedScrollToBottom = useMemo(
    () =>
      debounce(() => {
        if (isNearBottom && groupedMessages.length > 0) {
          scrollToBottom()
        }
      }, 100),
    [isNearBottom, groupedMessages.length, scrollToBottom]
  )

  useEffect(() => {
    debouncedScrollToBottom()

    return () => {
      debouncedScrollToBottom.cancel()
    }
  }, [debouncedScrollToBottom])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flastListRef}
        showsVerticalScrollIndicator={false}
        data={groupedMessages}
        renderItem={renderMessageGroup}
        keyExtractor={([key, group]) => `${key}-${group[0]?.id}`}
        ItemSeparatorComponent={() => <YStack height={20} />}
        contentContainerStyle={{
          flexGrow: 1
        }}
        initialNumToRender={2}
        maxToRenderPerBatch={10}
        keyboardShouldPersistTaps="never"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={() => {
          if (isNearBottom) {
            scrollToBottom()
          }
        }}
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
            <Pressable onPress={handleScrollToEnd} hitSlop={8} style={{ position: 'absolute', bottom: 2, right: 12 }}>
              <Button
                onPress={handleScrollToEnd}
                size={40}
                circular
                borderWidth={2}
                borderColor="$green20"
                icon={<ChevronDown size={24} color="$green100" />}
              />
            </Pressable>
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
