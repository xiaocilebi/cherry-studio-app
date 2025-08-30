import { useNavigation } from '@react-navigation/native'
import { Trash2 } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import { isEmpty } from 'lodash'
import { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native-gesture-handler'
import { Text, XStack, YStack } from 'tamagui'
import * as ContextMenu from 'zeego/context-menu'

import { getCurrentTopicId } from '@/hooks/useTopic'
import { deleteAssistantById } from '@/services/AssistantService'
import { loggerService } from '@/services/LoggerService'
import { isTopicOwnedByAssistant } from '@/services/TopicService'
import { Assistant } from '@/types/assistant'
import { HomeNavigationProps } from '@/types/naviagate'
import { formateEmoji } from '@/utils/formats'
import { haptic } from '@/utils/haptic'

const logger = loggerService.withContext('Assistant Item')

interface AssistantItemProps {
  assistant: Assistant
  onAssistantPress: (assistant: Assistant) => void
}

const AssistantItem: FC<AssistantItemProps> = ({ assistant, onAssistantPress }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<HomeNavigationProps>()

  const handlePress = () => {
    haptic(ImpactFeedbackStyle.Medium)
    onAssistantPress(assistant)
  }

  const handleDelete = async () => {
    try {
      // 如果当前删除的assistant包含current topic 就navigate到home screen获取default topic
      if (await isTopicOwnedByAssistant(assistant.id, getCurrentTopicId())) {
        navigation.navigate('ChatScreen', { topicId: 'new' })
      }

      await deleteAssistantById(assistant.id)
      // 删除Assistant不需要删除对应的topic
      // await deleteTopicsByAssistantId(assistant.id)
    } catch (error) {
      logger.error('Delete Assistant error', error)
    }
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Pressable delayLongPress={200} onPress={handlePress} onLongPress={() => {}}>
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
                {!isEmpty(assistant.prompt) && (
                  <Text ellipsizeMode="tail" numberOfLines={1} fontSize={12} lineHeight={18} color="$textSecondary">
                    {assistant.prompt}
                  </Text>
                )}
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
