import { FC } from 'react'
import React from 'react'
import { Text, XStack, YStack } from 'tamagui'

import { Assistant } from '@/types/assistant'

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
      paddingHorizontal={20}
      justifyContent="space-between"
      alignItems="center"
      borderRadius={16}
      backgroundColor="$uiCardBackground"
      onPress={handlePress}>
      <XStack gap={14} flex={1} marginRight={10} maxWidth="75%">
        <Text fontSize={35}>{assistant.emoji?.replace(/\r\n/g, '')}</Text>
        <YStack gap={4} flex={1} maxWidth="100%">
          <Text numberOfLines={1} ellipsizeMode="tail">
            {assistant.name}
          </Text>
          <Text fontSize={12} numberOfLines={1} ellipsizeMode="tail">
            {assistant.description}
          </Text>
        </YStack>
      </XStack>
    </XStack>
  )
}

export default AssistantItemRow
