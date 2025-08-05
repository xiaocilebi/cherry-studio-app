import { FC } from 'react'
import React from 'react'
import { View } from 'tamagui'

import { Assistant } from '@/types/assistant'
import { GroupedMessage } from '@/types/message'

import MessageItem from './Message'
import MessageFooter from './MessageFooter'
import MessageHeader from './MessageHeader'
import MultiModalTab from './MultiModalTab'

interface MessageGroupProps {
  assistant: Assistant
  item: [string, GroupedMessage[]]
  onMessageAction: (item: GroupedMessage) => void
}

const MessageGroup: FC<MessageGroupProps> = ({ assistant, item, onMessageAction }) => {
  const [key, messagesInGroup] = item

  const renderUserMessage = () => {
    return <MessageItem message={messagesInGroup[0]} />
  }

  const renderAssistantMessages = () => {
    if (messagesInGroup.length === 1) {
      return (
        <View gap={10}>
          <MessageHeader assistant={assistant} message={messagesInGroup[0]} />
          <MessageItem message={messagesInGroup[0]} />
          <MessageFooter
            assistant={assistant}
            message={messagesInGroup[0]}
            onMessageAction={message => {
              onMessageAction({ ...message, index: 0 })
            }}
          />
        </View>
      )
    }

    return (
      <View gap={10}>
        <MessageHeader assistant={assistant} message={messagesInGroup[0]} />
        <MultiModalTab
          assistant={assistant}
          messages={messagesInGroup}
          onMessageAction={message => {
            onMessageAction({ ...message, index: 0 })
          }}
        />
      </View>
    )
  }

  return (
    <View>
      {key.includes('user') && renderUserMessage()}
      {key.includes('assistant') && renderAssistantMessages()}
    </View>
  )
}

export default MessageGroup
