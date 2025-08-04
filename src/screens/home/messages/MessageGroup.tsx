import BottomSheet from '@gorhom/bottom-sheet'
import { FC } from 'react'
import React from 'react'
import { View } from 'tamagui'

import { Assistant } from '@/types/assistant'
import { GroupedMessage } from '@/types/message'
import { Message } from '@/types/message'

import MessageItem from './Message'
import MessageFooter from './MessageFooter'
import MessageHeader from './MessageHeader'
import MultiModalTab from './MultiModalTab'

interface MessageGroupProps {
  assistant: Assistant
  item: [string, GroupedMessage[]]
  bottomSheetRef: React.RefObject<BottomSheet | null>
  setSelectedMessage: React.Dispatch<React.SetStateAction<Message | null>>
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MessageGroup: FC<MessageGroupProps> = ({
  assistant,
  item,
  bottomSheetRef,
  setIsBottomSheetOpen,
  setSelectedMessage
}) => {
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
          {bottomSheetRef && setIsBottomSheetOpen && (
            <MessageFooter
              assistant={assistant}
              message={messagesInGroup[0]}
              bottomSheetRef={bottomSheetRef}
              setIsBottomSheetOpen={setIsBottomSheetOpen}
              setSelectedMessage={setSelectedMessage}
            />
          )}
        </View>
      )
    }

    return (
      <View gap={10}>
        <MessageHeader assistant={assistant} message={messagesInGroup[0]} />
        <MultiModalTab assistant={assistant} messages={messagesInGroup} />
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
