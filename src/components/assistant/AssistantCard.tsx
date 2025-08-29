import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from '@tamagui/linear-gradient'
import { UserRoundPen } from '@tamagui/lucide-icons'
import { FC, ReactNode } from 'react'
import React from 'react'
import { Text, XStack, YStack } from 'tamagui'

import { useAssistant } from '@/hooks/useAssistant'
import { useTheme } from '@/hooks/useTheme'
import { HomeStackNavigationProp } from '@/navigators/HomeStackNavigator'
import { Topic } from '@/types/assistant'
import { formateEmoji } from '@/utils/formats'

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
  return (
    <XStack
      gap={5}
      paddingHorizontal={12}
      paddingVertical={5}
      backgroundColor="$green10"
      borderWidth={0.5}
      borderRadius={99}
      borderColor="$green20"
      onPress={onPress}>
      <XStack height={18} width={18} borderRadius={99} justifyContent="center" alignItems="center">
        {icon}
      </XStack>

      <Text color="$green100">{label}</Text>
    </XStack>
  )
}

export const AssistantCard: FC<AssistantCardProps> = ({ topic }) => {
  const { isDark } = useTheme()
  const homeNavigation = useNavigation<HomeStackNavigationProp>()
  const drawerNavigation = useNavigation<DrawerNavigationProp<any>>()
  const { assistant } = useAssistant(topic.assistantId)

  if (!assistant) {
    return null
  }

  const actionMenu = [
    {
      icon: <UserRoundPen size={13} color="$green100" />,
      label: 'edit',
      onPress: () => homeNavigation.navigate('AssistantDetailScreen', { assistantId: assistant.id, tab: 'prompt' })
    },
    {
      icon: <UserChangeIcon />,
      label: 'change',
      onPress: () => drawerNavigation.navigate('Assistant', { screen: 'AssistantScreen' })
    },
    {
      icon: <ModelChangeIcon />,
      label: 'model',
      onPress: () => homeNavigation.navigate('AssistantDetailScreen', { assistantId: assistant.id, tab: 'model' })
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
          {formateEmoji(assistant.emoji)}
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
          backgroundColor="$uiCardBackground"
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
                      backgroundColor="$green10"
                      color="$green100"
                      borderWidth={0.5}
                      borderColor="$green20"
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
