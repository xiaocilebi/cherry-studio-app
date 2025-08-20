import { Trash2 } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import { FC } from 'react'
import React from 'react'
import { Pressable } from 'react-native-gesture-handler'
import { Text, XStack, YStack } from 'tamagui'
import * as ContextMenu from 'zeego/context-menu'

import { useNavigation } from '@/hooks/useNavigation'
import { getCurrentTopicId } from '@/hooks/useTopic'
import i18n from '@/i18n'
import { deleteAssistantById } from '@/services/AssistantService'
import { loggerService } from '@/services/LoggerService'
import { deleteTopicsByAssistantId, isTopicOwnedByAssistant } from '@/services/TopicService'
import { Assistant } from '@/types/assistant'
import { formateEmoji } from '@/utils/formats'
import { haptic } from '@/utils/haptic'
import { useTranslation } from 'react-i18next'

const logger = loggerService.withContext('Assistant Item')

interface AssistantItemProps {
  assistant: Assistant
  onAssistantPress: (assistant: Assistant) => void
}

const AssistantItem: FC<AssistantItemProps> = ({ assistant, onAssistantPress }) => {
  const { t } = useTranslation()
  const { navigateToHomeScreen } = useNavigation()

  const handlePress = () => {
    haptic(ImpactFeedbackStyle.Medium)
    onAssistantPress(assistant)
  }

  const handleDelete = async () => {
    try {
      // 如果当前删除的assistant包含current topic 就navigate到home screen获取default topic
      if (await isTopicOwnedByAssistant(assistant.id, getCurrentTopicId())) {
        navigateToHomeScreen()
      }

      await deleteAssistantById(assistant.id)
      await deleteTopicsByAssistantId(assistant.id)
    } catch (error) {
      logger.error('Delete Assistant error', error)
    }
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Pressable delayLongPress={100} onPress={handlePress} onLongPress={() => {}}>
          <XStack
            borderRadius={16}
            backgroundColor="$uiCardBackground"
            justifyContent="space-between"
            alignItems="center"
            paddingVertical={12}
            paddingHorizontal={20}>
            <XStack gap={14} maxWidth="90%">
              <Text fontSize={35}>{formateEmoji(assistant.emoji)}</Text>
              <YStack gap={8} flex={1} justifyContent="center">
                <Text fontSize={14} numberOfLines={1} ellipsizeMode="tail" fontWeight="bold" color="$textPrimary">
                  {assistant.name}
                </Text>
                <Text ellipsizeMode="tail" numberOfLines={1} fontSize={12} lineHeight={18} color="$textSecondary">
                  {assistant.description}
                </Text>
              </YStack>
            </XStack>
          </XStack>
        </Pressable>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item key="delete" onSelect={handleDelete}>
          <ContextMenu.ItemTitle>{t('common.delete')}</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon ios={{ name: 'trash' }}>
            <Trash2 size={16} color="red" />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}

export default AssistantItem
