import React from 'react'
import { Button, Text, XStack, YStack } from 'tamagui'

import { Assistant } from '@/types/assistant'

import { ArrowIcon } from '../icons/ArrowIcon'
import { ModelIcon } from '../ui/ModelIcon'

interface AssistantSelectionProps {
  assistant: Assistant
  showAssistantCard: boolean
  setShowAssistantCard: (value: boolean) => void
}

export const AssistantSelection: React.FC<AssistantSelectionProps> = ({
  assistant,
  showAssistantCard,
  setShowAssistantCard
}) => {
  return (
    <Button chromeless onPress={() => setShowAssistantCard(!showAssistantCard)}>
      <XStack gap={14} alignItems="center" justifyContent="center">
        <Text fontSize={30}>{assistant.emoji}</Text>
        <YStack gap={2} alignItems="center" justifyContent="center">
          <XStack gap={10} alignItems="center" justifyContent="center">
            <Text fontSize={20}>{assistant.name}</Text>
            <XStack rotate={showAssistantCard ? '0deg' : '180deg'}>
              <ArrowIcon size={12} />
            </XStack>
          </XStack>
          {assistant.model && (
            <XStack gap={2} alignItems="center" justifyContent="center">
              <ModelIcon model={assistant.model} size={14} />
              <Text fontSize={12} numberOfLines={1} ellipsizeMode="tail">
                {assistant.model.name}
              </Text>
            </XStack>
          )}
        </YStack>
      </XStack>
    </Button>
  )
}
