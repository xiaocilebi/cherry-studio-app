import { useNavigation } from '@react-navigation/native'
import { isEmpty } from 'lodash'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Trash2 } from '@/componentsV2/icons/LucideIcon'
import { useTheme } from '@/hooks/useTheme'
import { useToast } from '@/hooks/useToast'
import { getCurrentTopicId } from '@/hooks/useTopic'
import { deleteAssistantById } from '@/services/AssistantService'
import { loggerService } from '@/services/LoggerService'
import { deleteTopicsByAssistantId, isTopicOwnedByAssistant } from '@/services/TopicService'
import { Assistant } from '@/types/assistant'
import { HomeNavigationProps } from '@/types/naviagate'
import { haptic } from '@/utils/haptic'
import EmojiAvatar from './EmojiAvatar'
import XStack from '@/componentsV2/layout/XStack'
import YStack from '@/componentsV2/layout/YStack'
import Text from '@/componentsV2/base/Text'
import { ContextMenu, ContextMenuListProps } from '@/componentsV2/base/ContextMenu'

const logger = loggerService.withContext('Assistant Item')

interface AssistantItemProps {
  assistant: Assistant
  onAssistantPress: (assistant: Assistant) => void
}

const AssistantItem: FC<AssistantItemProps> = ({ assistant, onAssistantPress }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<HomeNavigationProps>()
  const toast = useToast()
  const { isDark } = useTheme()

  const handlePress = () => {
    haptic()
    onAssistantPress(assistant)
  }

  const handleDelete = async () => {
    try {
      if (await isTopicOwnedByAssistant(assistant.id, getCurrentTopicId())) {
        navigation.navigate('ChatScreen', { topicId: 'new' })
      }

      await deleteAssistantById(assistant.id)
      await deleteTopicsByAssistantId(assistant.id)
      toast.show(t('message.assistant_deleted'))
    } catch (error) {
      logger.error('Delete Assistant error', error)
    }
  }

  const contextMenuItems: ContextMenuListProps[] = [
    {
      title: t('common.delete'),
      iOSIcon: 'trash',
      androidIcon: <Trash2 size={16} className="text-red-100" />,
      destructive: true,
      color: 'red',
      onSelect: handleDelete
    }
  ]

  return (
    <ContextMenu borderRadius={16} list={contextMenuItems} onPress={handlePress}>
      <View className="py-2.5 px-2.5 justify-between items-center rounded-2xl bg-ui-card-background dark:bg-ui-card-background-dark">
        <XStack className="gap-3.5 flex-1">
          <EmojiAvatar
            emoji={assistant.emoji}
            size={46}
            borderRadius={18}
            borderWidth={3}
            borderColor={isDark ? '#333333' : '#f7f7f7'}
          />
          <YStack className="gap-1 flex-1 justify-center">
            <Text className="text-sm font-bold" numberOfLines={1} ellipsizeMode="tail">
              {assistant.name}
            </Text>
            {!isEmpty(assistant.prompt) && (
              <Text ellipsizeMode="tail" numberOfLines={1} className="text-xs leading-[18px] text-text-secondary dark:text-text-secondary-dark">
                {assistant.prompt}
              </Text>
            )}
          </YStack>
        </XStack>
      </View>
    </ContextMenu>
  )
}

export default AssistantItem
