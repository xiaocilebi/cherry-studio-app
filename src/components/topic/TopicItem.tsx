import AsyncStorage from '@react-native-async-storage/async-storage'
import { Trash2 } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import { FC, useEffect, useState } from 'react'
import React from 'react'
import { Text, XStack, YStack } from 'tamagui'
import * as ContextMenu from 'zeego/context-menu'

import { useNavigation } from '@/hooks/useNavigation'
import { getCurrentTopicId } from '@/hooks/useTopic'
import i18n from '@/i18n'
import { getAssistantById, getDefaultAssistant } from '@/services/AssistantService'
import { loggerService } from '@/services/LoggerService'
import { deleteMessagesByTopicId } from '@/services/MessagesService'
import { createNewTopic, deleteTopicById, getNewestTopic } from '@/services/TopicService'
import { Assistant, Topic } from '@/types/assistant'
import { haptic } from '@/utils/haptic'
import { useTranslation } from 'react-i18next'
const logger = loggerService.withContext('Topic Item')

type TimeFormat = 'time' | 'date'

interface TopicItemProps {
  topic: Topic
  timeFormat?: TimeFormat
}

const TopicItem: FC<TopicItemProps> = ({ topic, timeFormat = 'time' }) => {
  const {t} = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language)
  const { navigateToChatScreen } = useNavigation()
  const [assistant, setAssistant] = useState<Assistant>()

  const openTopic = () => {
    haptic(ImpactFeedbackStyle.Medium)
    navigateToChatScreen(topic.id)
  }

  const handleDelete = async () => {
    try {
      const deletedTopicId = topic.id
      await deleteMessagesByTopicId(deletedTopicId)
      await deleteTopicById(deletedTopicId)

      if (deletedTopicId === getCurrentTopicId()) {
        const nextTopic = await getNewestTopic()

        if (nextTopic) {
          // 如果还有其他 topic，直接跳转到最新的那一个
          navigateToChatScreen(nextTopic.id)
          logger.info('navigateToChatScreen after delete', nextTopic)
        } else {
          const defaultAssistant = await getDefaultAssistant()
          const newTopic = await createNewTopic(defaultAssistant)
          navigateToChatScreen(newTopic.id)
          logger.info('navigateToChatScreen with new topic', newTopic)
        }
      }
    } catch (error) {
      logger.error('Delete Topic error', error)
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
        <XStack
          backgroundColor="$uiCardBackground"
          borderRadius={30}
          paddingVertical={5}
          paddingHorizontal={20}
          gap={14}
          justifyContent="center"
          alignItems="center"
          onPress={openTopic}>
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
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item key='delete' onSelect={handleDelete}>
          <ContextMenu.ItemTitle>{ t('common.delete')}</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon ios={{name:'trash'}}>
            <Trash2 size={16} color="red" />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}

export default TopicItem
