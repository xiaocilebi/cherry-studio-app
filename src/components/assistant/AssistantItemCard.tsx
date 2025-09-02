import React from 'react'
import { Text, View, XStack, YStack } from 'tamagui'

import { Assistant } from '@/types/assistant'

import EmojiAvatar from './EmojiAvator'
import GroupTag from './market/GroupTag'
import { useTheme } from '@/hooks/useTheme'

interface AssistantItemCardProps {
  assistant: Assistant
  onAssistantPress: (assistant: Assistant) => void
}

const AssistantItemCard = ({ assistant, onAssistantPress }: AssistantItemCardProps) => {
  const { isDark } = useTheme()
  const handlePress = () => {
    onAssistantPress(assistant)
  }

  return (
    <View backgroundColor="$uiCardBackground" padding={14} width={148} borderRadius={16} onPress={handlePress}>
      <YStack gap={8} alignItems="center" height="100%">
        <EmojiAvatar
          emoji={assistant.emoji}
          size={70}
          borderWidth={5}
          borderColor={isDark ? '#333333' : '$backgroundPrimary'}
        />
        <Text textAlign="center" numberOfLines={1} ellipsizeMode="tail">
          {assistant.name}
        </Text>
        <View height={40}>
          <Text color="$gray9" fontSize={10} lineHeight={12} numberOfLines={3} ellipsizeMode="tail">
            {assistant.description}
          </Text>
        </View>
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
    </View>
  )
}

export default AssistantItemCard
