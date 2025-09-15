import React from 'react'
import { Button, Text, View, XStack, YStack } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'
import { Assistant } from '@/types/assistant'
import { haptic } from '@/utils/haptic'

import EmojiAvatar from './EmojiAvator'
import GroupTag from './market/GroupTag'
import { formateEmoji } from '@/utils/formats'
import { BlurView } from 'expo-blur'
import { Platform, ScrollView } from 'react-native'

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
    <View padding={6}>
      <View
        onPress={handlePress}
        height={230}
        backgroundColor="$uiCardBackground"
        borderRadius={16}
        overflow="hidden"
        pressStyle={{
          backgroundColor: '$gray20'
        }}>
        {/* 背景模糊emoji */}
        <View
          top="-50%"
          left={0}
          right={0}
          position="absolute"
          alignItems="center"
          justifyContent="center"
          scale={2}
          transformOrigin="center center">
          <Text fontSize={140} opacity={0.2}>
            {formateEmoji(assistant.emoji)}
          </Text>
        </View>
        {/* BlurView模糊层 */}
        <BlurView
          intensity={Platform.OS === 'android' ? 60 : 70}
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
          tint={isDark ? 'dark' : 'light'}
          style={{
            position: 'absolute',
            inset: 0
          }}
        />

        <YStack flex={1} gap={8} alignItems="center" borderRadius={16} paddingVertical={16} paddingHorizontal={14}>
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
            <XStack gap={10} flexWrap="wrap" height={18} justifyContent="center" overflow="hidden">
              {assistant.group &&
                assistant.group.map((group, index) => (
                  <GroupTag
                    key={index}
                    group={group}
                    fontSize={10}
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
    </View>
  )
}

export default AssistantItemCard
