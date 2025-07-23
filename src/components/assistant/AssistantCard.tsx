import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from '@tamagui/linear-gradient'
import { UserRoundPen } from '@tamagui/lucide-icons'
import { FC, ReactNode } from 'react'
import React from 'react'
import { Text, XStack, YStack } from 'tamagui'

import { useAssistant } from '@/hooks/useAssistant'
import { Topic } from '@/types/assistant'
import { NavigationProps } from '@/types/naviagate'
import { useIsDark } from '@/utils'
import { getGreenColor, getTextSecondaryColor } from '@/utils/color'

import { ModelChangeIcon } from '../icons/ModelChangeIcon'
import { UserChangeIcon } from '../icons/UserChangeIcon'
import { ModelIcon } from '../ui/ModelIcon'
import GroupTag from './market/GroupTag'

interface AssistantCardProps {
  topic: Topic
}

interface ActionTagProps {
  icon: ReactNode
  label: string
  onPress: () => void
}

const ActionTag: FC<ActionTagProps> = ({ icon, label, onPress }) => {
  const isDark = useIsDark()
  return (
    <XStack
      gap={5}
      paddingHorizontal={12}
      paddingVertical={5}
      backgroundColor="$gray20"
      borderWidth={0.5}
      borderRadius={99}
      borderColor="$gray60"
      onPress={onPress}>
      <LinearGradient
        height={18}
        width={18}
        borderRadius={99}
        justifyContent="center"
        alignItems="center"
        colors={['#C0E58D', '#3BB554']}
        start={[0, 0]}
        end={[1, 1]}>
        {icon}
      </LinearGradient>

      <Text color={getTextSecondaryColor(isDark)}>{label}</Text>
    </XStack>
  )
}

export const AssistantCard: FC<AssistantCardProps> = ({ topic }) => {
  const isDark = useIsDark()
  const navigation = useNavigation<NavigationProps>()
  const { assistant } = useAssistant(topic.assistantId)

  if (!assistant) {
    return null
  }

  const actionMenu = [
    {
      icon: <UserRoundPen size={13} />,
      label: 'edit',
      onPress: () => navigation.navigate('AssistantDetailScreen', { assistantId: assistant.id, tab: 'prompt' })
    },
    {
      icon: <UserChangeIcon />,
      label: 'change',
      onPress: () => navigation.navigate('AssistantScreen')
    },
    {
      icon: <ModelChangeIcon />,
      label: 'model',
      onPress: () => navigation.navigate('AssistantDetailScreen', { assistantId: assistant.id, tab: 'model' })
    }
  ]

  return (
    <YStack alignItems="center" gap={0}>
      {/* Assistant Icon */}
      <LinearGradient
        height={100}
        width={100}
        padding={2}
        borderRadius={99}
        justifyContent="center"
        alignItems="center"
        colors={['#C0E58D', '#3BB554']}
        start={[0, 0]}
        end={[1, 1]}
        zIndex={10}
        marginBottom={-50} // 负边距来实现重叠效果
      >
        <Text fontSize={60} textAlign="center">
          {assistant.emoji}
        </Text>
      </LinearGradient>
      {/* Assistant Card Detail */}
      <LinearGradient
        width="100%"
        maxWidth={392}
        padding={1}
        borderRadius={40}
        colors={isDark ? ['#acf3a633', '#acf3a6ff', '#acf3a633'] : ['#8de59e4d', '#81df94ff', '#8de59e4d']}
        start={[0, 0]}
        end={[1, 1]}>
        <YStack
          gap={16}
          borderRadius={40}
          alignItems="center"
          justifyContent="center"
          backgroundColor="$background"
          paddingTop={60}
          paddingBottom={30}
          paddingHorizontal={21}>
          <YStack gap={20}>
            <YStack gap={10} justifyContent="center" alignItems="center">
              <Text fontSize={24}>{assistant.name}</Text>
              {assistant.model && (
                <XStack gap={2} alignItems="center" justifyContent="center">
                  <ModelIcon model={assistant.model} size={14} />
                  <Text fontSize={12} numberOfLines={1} ellipsizeMode="tail">
                    {assistant.model.name}
                  </Text>
                </XStack>
              )}
              <XStack gap={5} alignItems="center" justifyContent="center">
                {assistant.group &&
                  assistant.group.map((group, index) => (
                    <GroupTag
                      key={index}
                      group={group}
                      paddingHorizontal={12}
                      paddingVertical={5}
                      backgroundColor={getGreenColor(isDark, 10)}
                      color={getGreenColor(isDark, 100)}
                      borderWidth={0.5}
                      borderColor={getGreenColor(isDark, 20)}
                    />
                  ))}
              </XStack>
            </YStack>
            {assistant.prompt.trim() && (
              <XStack>
                <Text numberOfLines={2} ellipsizeMode="tail">
                  {assistant.prompt}
                </Text>
              </XStack>
            )}
          </YStack>
          <XStack gap={5} alignItems="center" justifyContent="center">
            {actionMenu.map((item, index) => (
              <ActionTag key={index} label={item.label} icon={item.icon} onPress={item.onPress} />
            ))}
          </XStack>
        </YStack>
      </LinearGradient>
    </YStack>
  )
}
