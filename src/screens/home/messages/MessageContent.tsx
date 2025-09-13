import React from 'react'
import { StyleSheet } from 'react-native'
import { Stack, View } from 'tamagui'

import { useMessageBlocks } from '@/hooks/useMessageBlocks'
import { Assistant } from '@/types/assistant'
import { Message, MessageBlockType } from '@/types/message'

import MessageBlockRenderer from './blocks'
import MessageContextMenu from './MessageContextMenu'

interface Props {
  message: Message
  assistant?: Assistant
  isMultiModel?: boolean
}

const MessageContent: React.FC<Props> = ({ message, assistant, isMultiModel = false }) => {
  const isUser = message.role === 'user'
  const { processedBlocks } = useMessageBlocks(message.id)

  const mediaBlocks = processedBlocks.filter(
    block => block.type === MessageBlockType.IMAGE || block.type === MessageBlockType.FILE
  )
  const contentBlocks = processedBlocks.filter(
    block => block.type !== MessageBlockType.IMAGE && block.type !== MessageBlockType.FILE
  )

  if (isUser)
    return (
      <View style={[styles.userContainer, styles.container]} paddingHorizontal={14} borderRadius={16}>
        {mediaBlocks.length > 0 && <MessageBlockRenderer blocks={mediaBlocks} message={message} />}
        {mediaBlocks.length > 0 && <View style={{ height: 8 }} />}
        <MessageContextMenu message={message} assistant={assistant}>
          {contentBlocks.length > 0 && (
            <Stack
              style={[styles.contentWrapper, styles.userMessageContent]}
              borderRadius={16}
              backgroundColor={'$green10'}
              borderColor={'$green20'}
              borderWidth={1}>
              <MessageBlockRenderer blocks={contentBlocks} message={message} />
            </Stack>
          )}
        </MessageContextMenu>
      </View>
    )

  return (
    <MessageContextMenu message={message} assistant={assistant} isMultiModel={isMultiModel}>
      <View style={[styles.container]} paddingHorizontal={14} paddingBottom={8} borderRadius={16}>
        {mediaBlocks.length > 0 && <MessageBlockRenderer blocks={mediaBlocks} message={message} />}
        {contentBlocks.length > 0 && (
          <Stack
            style={[styles.assistantMessageContent, mediaBlocks.length > 0 && { marginTop: 8 }]}
            borderRadius={16}
            backgroundColor={'$green10'}>
            <MessageBlockRenderer blocks={contentBlocks} message={message} />
          </Stack>
        )}
      </View>
    </MessageContextMenu>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: '100%'
  },
  userContainer: {
    // alignSelf: 'flex-end',
    alignItems: 'flex-end'
  },

  contentWrapper: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  userMessageContent: {
    paddingHorizontal: 20
  },
  assistantMessageContent: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    maxWidth: '100%',
    width: '100%'
  }
})

export default React.memo(MessageContent)
