import React from 'react'
import { Text, XStack, YStack } from 'tamagui'

import { Assistant } from '@/types/assistant'
import { useIsDark } from '@/utils'
import { formateEmoji } from '@/utils/formats'

import GroupTag from './market/GroupTag'

interface AssistantItemCardProps {
  assistant: Assistant
  onAssistantPress: (assistant: Assistant) => void
}

const AssistantItemCard = ({ assistant, onAssistantPress }: AssistantItemCardProps) => {
  const isDark = useIsDark()

  const handlePress = () => {
    onAssistantPress(assistant)
  }

  return (
    <YStack
      backgroundColor={isDark ? '$uiCardDark' : '$uiCardLight'}
      paddingHorizontal={14}
      paddingTop={30}
      paddingBottom={10}
      height={216}
      width={148}
      borderRadius={16}
      onPress={handlePress}>
      <YStack gap={7} alignItems="center" justifyContent="center" height="100%">
        <Text fontSize={30}>{formateEmoji(assistant.emoji)}</Text>
        <Text textAlign="center" numberOfLines={2} ellipsizeMode="tail">
          {assistant.name}
        </Text>
        <Text color="$gray9" fontSize={10} numberOfLines={4} ellipsizeMode="tail">
          {assistant.description}
        </Text>
        <XStack gap={10}>
          {assistant.group &&
            assistant.group.map((group, index) => (
              <GroupTag
                key={index}
                group={group}
                fontSize={8}
                backgroundColor="$green10"
                color="$green100"
                borderWidth={0.5}
                borderColor="$green20"
              />
            ))}
        </XStack>
      </YStack>
    </YStack>
  )
}

export default AssistantItemCard
