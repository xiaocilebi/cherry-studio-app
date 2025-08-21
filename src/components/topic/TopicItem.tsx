import AsyncStorage from '@react-native-async-storage/async-storage'
import { Trash2 } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import { FC, useEffect, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native-gesture-handler'
import { Text, XStack, YStack } from 'tamagui'
import * as ContextMenu from 'zeego/context-menu'

import { useCustomNavigation } from '@/hooks/useNavigation'
import i18n from '@/i18n'
import { getAssistantById } from '@/services/AssistantService'
import { Assistant, Topic } from '@/types/assistant'
import { haptic } from '@/utils/haptic'

type TimeFormat = 'time' | 'date'

interface TopicItemProps {
  topic: Topic
  timeFormat?: TimeFormat
  onDelete?: (topicId: string) => Promise<void>
}

const TopicItem: FC<TopicItemProps> = ({ topic, timeFormat = 'time', onDelete }) => {
  const { t } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language)
  const { navigateToChatScreen } = useCustomNavigation()
  const [assistant, setAssistant] = useState<Assistant>()

  const openTopic = () => {
    haptic(ImpactFeedbackStyle.Medium)
    navigateToChatScreen(topic.id)
  }

  const date = new Date(topic.updatedAt)
  const displayTime =
    timeFormat === 'date'
      ? date.toLocaleDateString(currentLanguage, {
          month: 'short',
          day: 'numeric'
        })
      : date.toLocaleTimeString(currentLanguage, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })

  useEffect(() => {
    const fetchCurrentLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('language')

      if (storedLanguage) {
        setCurrentLanguage(storedLanguage)
      }
    }

    const fetchAssistant = async () => {
      setAssistant(await getAssistantById(topic.assistantId))
    }

    fetchCurrentLanguage()
    fetchAssistant()
  }, [topic.assistantId])

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Pressable delayLongPress={100} onPress={openTopic} onLongPress={() => {}}>
          <XStack
            backgroundColor="$gray20"
            borderRadius={30}
            paddingVertical={5}
            paddingHorizontal={20}
            gap={14}
            justifyContent="center"
            alignItems="center">
            <Text fontSize={24}>{assistant?.emoji}</Text>
            <YStack flex={1}>
              <XStack justifyContent="space-between">
                <Text fontWeight="bold" color="$textPrimary">
                  {assistant?.name}
                </Text>
                <Text fontSize={12} color="$textSecondary">
                  {displayTime}
                </Text>
              </XStack>
              <Text fontSize={12} numberOfLines={1} ellipsizeMode="tail" fontWeight="400" color="$textPrimary">
                {topic.name}
              </Text>
            </YStack>
          </XStack>
        </Pressable>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item key="delete" onSelect={async () => await onDelete?.(topic.id)}>
          <ContextMenu.ItemTitle>{t('common.delete')}</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon ios={{ name: 'trash' }}>
            <Trash2 size={16} color="red" />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}

export default TopicItem
