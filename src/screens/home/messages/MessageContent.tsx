import React from 'react'
import { StyleSheet } from 'react-native'
import { Stack, View } from 'tamagui'

import { useMessageBlocks } from '@/hooks/useMessageBlocks'
import { Message, MessageBlockType } from '@/types/message'

import MessageBlockRenderer from './blocks'

interface Props {
  message: Message
}

const MessageContent: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user'
  const { processedBlocks } = useMessageBlocks(message.id)

  const mediaBlocks = processedBlocks.filter(
    block => block.type === MessageBlockType.IMAGE || block.type === MessageBlockType.FILE
  )
  const contentBlocks = processedBlocks.filter(
    block => block.type !== MessageBlockType.IMAGE && block.type !== MessageBlockType.FILE
  )

  return (
    <View style={[isUser ? styles.userContainer : undefined, styles.container]}>
      {mediaBlocks.length > 0 && <MessageBlockRenderer blocks={mediaBlocks} />}
      {contentBlocks.length > 0 && (
        <Stack
          style={[
            isUser ? styles.contentWrapper : undefined,
            isUser ? styles.userMessageContent : styles.assistantMessageContent,
            mediaBlocks.length > 0 && { marginTop: 8 }
          ]}
          backgroundColor={isUser ? '$green10' : '$colorTransparent'}
          borderColor={isUser ? '$green20' : '$colorTransparent'}
          borderWidth={1}>
          <MessageBlockRenderer blocks={contentBlocks} />
        </Stack>
      )}
    </View>
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
    flex: 1,
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
