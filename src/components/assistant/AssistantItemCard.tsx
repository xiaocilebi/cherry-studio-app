import React from 'react'
import { Dimensions } from 'react-native'
import { Button, Text, XStack, YStack } from 'tamagui'

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

  // 计算卡片宽度和高度
  const screenWidth = Dimensions.get('window').width
  const horizontalPadding = 20 // 左右各10px的padding
  const columnGap = 8 // 列间距
  const cardWidth = (screenWidth - horizontalPadding * 2 - columnGap) / 2
  const cardHeight = cardWidth / 0.78 // 宽高比为0.78

  const handlePress = () => {
    haptic()
    onAssistantPress(assistant)
  }

  return (
    <Button
      onPress={handlePress}
      width={cardWidth}
      height={cardHeight}
      padding={0}
      backgroundColor="$uiCardBackground"
      borderRadius={16}
      pressStyle={{
        backgroundColor: '$gray20'
      }}
      unstyled>
      <YStack padding={14} width="100%" height="100%" borderRadius={16}>
        <YStack gap={8} alignItems="center" height="100%">
          <EmojiAvatar
            emoji={assistant.emoji}
            size={cardWidth / 2}
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
      </YStack>
    </Button>
  )
}

export default AssistantItemCard
