import { useNavigation } from '@react-navigation/native'
import { Trash2 } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import { FC, useEffect, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native-gesture-handler'
import { Text, XStack, YStack } from 'tamagui'
import * as ContextMenu from 'zeego/context-menu'

import i18n from '@/i18n'
import { getAssistantById } from '@/services/AssistantService'
import { useAppDispatch } from '@/store'
import { setCurrentTopicId } from '@/store/topic'
import { Assistant, Topic } from '@/types/assistant'
import { DrawerNavigationProps } from '@/types/naviagate'
import { storage } from '@/utils'
import { haptic } from '@/utils/haptic'
import EmojiAvatar from '../assistant/EmojiAvator'

type TimeFormat = 'time' | 'date'

interface TopicItemProps {
  topic: Topic
  timeFormat?: TimeFormat
  onDelete?: (topicId: string) => Promise<void>
  handleNavigateChatScreen?: (topicId: string) => void
}

const TopicItem: FC<TopicItemProps> = ({ topic, timeFormat = 'time', onDelete, handleNavigateChatScreen }) => {
  const { t } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language)
  const dispatch = useAppDispatch()
  const navigation = useNavigation<DrawerNavigationProps>()
  const [assistant, setAssistant] = useState<Assistant>()

  const openTopic = () => {
    if (handleNavigateChatScreen) {
      handleNavigateChatScreen(topic.id)
    } else {
      haptic(ImpactFeedbackStyle.Medium)
      dispatch(setCurrentTopicId(topic.id))
      console.log('openTopic', topic.id)
      navigation.navigate('Home', { screen: 'ChatScreen', params: { topicId: topic.id } })
    }
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
    const fetchCurrentLanguage = () => {
      const storedLanguage = storage.getString('language')

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
    <ContextMenu.Root >
      <ContextMenu.Trigger>
        <XStack
          onPress={openTopic}
          borderRadius={16}
          paddingVertical={5}
          paddingHorizontal={5}
          gap={14}
          justifyContent="center"
          alignItems="center"
          pressStyle={{ backgroundColor: '$gray20' }}>
          <EmojiAvatar emoji={assistant?.emoji} size={40} borderRadius={16} />
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
