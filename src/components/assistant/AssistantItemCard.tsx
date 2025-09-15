import React from 'react'
import { Button, Text, View, XStack, YStack } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'
import { Assistant } from '@/types/assistant'
import { haptic } from '@/utils/haptic'

import EmojiAvatar from './EmojiAvator'
import GroupTag from './market/GroupTag'

interface AssistantItemCardProps {
  assistant: Assistant
  onAssistantPress: (assistant: Assistant) => void
}

const AssistantItemCard = ({ assistant, onAssistantPress }: AssistantItemCardProps) => {
  const { isDark } = useTheme()

  const handlePress = () => {
    haptic()
    onAssistantPress(assistant)
  }

  return (
    <View padding={6} width="100%">
      <YStack
        onPress={handlePress}
        height={230}
        gap={8}
        alignItems="center"
        backgroundColor="$uiCardBackground"
        borderRadius={16}
        paddingVertical={16}
        paddingHorizontal={14}
        pressStyle={{
          backgroundColor: '$gray20'
        }}>
        <EmojiAvatar
          emoji={assistant.emoji}
          size={90}
          borderWidth={5}
          borderColor={isDark ? '#333333' : '$backgroundPrimary'}
        />
        <Text fontSize={16} textAlign="center" numberOfLines={1} ellipsizeMode="tail">
          {assistant.name}
        </Text>
        <YStack flex={1} justifyContent="space-between" alignItems="center">
          <Text color="$textSecondary" fontSize={12} lineHeight={14} numberOfLines={3} ellipsizeMode="tail">
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
    </View>
  )
}

export default AssistantItemCard
