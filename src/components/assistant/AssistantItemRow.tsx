import { FC } from 'react'
import React from 'react'
import { Text, XStack, YStack } from 'tamagui'

import { Assistant } from '@/types/assistant'

import EmojiAvatar from './EmojiAvator'

interface AssistantItemRowProps {
  assistant: Assistant
  onAssistantPress: (assistant: Assistant) => void
}

const AssistantItemRow: FC<AssistantItemRowProps> = ({ assistant, onAssistantPress }) => {
  const handlePress = () => {
    onAssistantPress(assistant)
  }

  return (
    <XStack
      paddingVertical={10}
      paddingHorizontal={10}
      justifyContent="space-between"
      alignItems="center"
      borderRadius={16}
      backgroundColor="$uiCardBackground"
      gap={14}
      pressStyle={{ backgroundColor: '$gray20' }}
      onPress={handlePress}>
      <EmojiAvatar emoji={assistant.emoji} size={45} borderRadius={18} borderWidth={2} />
      <YStack gap={4} flex={1} justifyContent="center">
        <Text numberOfLines={1} ellipsizeMode="tail">
          {assistant.name}
        </Text>
        <Text fontSize={12} numberOfLines={1} ellipsizeMode="tail">
          {assistant.description}
        </Text>
      </YStack>
    </XStack>
  )
}

export default AssistantItemRow
