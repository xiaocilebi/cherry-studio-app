import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { Text, YStack, SelectionSheet } from '@/componentsV2'
import { MessageSquareDiff } from '@/componentsV2/icons/LucideIcon'
import EmojiAvatar from '@/componentsV2/features/Assistant/EmojiAvatar'
import { useExternalAssistants } from '@/hooks/useAssistant'
import { useTheme } from 'heroui-native'
import { createNewTopic, getNewestTopic } from '@/services/TopicService'
import { useAppDispatch } from '@/store'
import { setCurrentTopicId } from '@/store/topic'
import { Assistant } from '@/types/assistant'
import { DrawerNavigationProps } from '@/types/naviagate'
import { haptic } from '@/utils/haptic'
import { isEmpty } from 'lodash'
import { messageDatabase } from '@database'

interface NewTopicButtonProps {
  assistant: Assistant
}

export const NewTopicButton: React.FC<NewTopicButtonProps> = ({ assistant }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<DrawerNavigationProps>()
  const dispatch = useAppDispatch()
  const { assistants, isLoading } = useExternalAssistants()
  const selectionSheetRef = useRef<BottomSheetModal | null>(null)
  const { isDark } = useTheme()

  const handleAddNewTopic = async (selectedAssistant?: Assistant) => {
    haptic(ImpactFeedbackStyle.Medium)
    const targetAssistant = selectedAssistant || assistant
    const newestTopic = await getNewestTopic()
    const hasMessages = await messageDatabase.getHasMessagesWithTopicId(newestTopic?.id ?? '')
    if (hasMessages || !newestTopic) {
      const newTopic = await createNewTopic(targetAssistant)
      dispatch(setCurrentTopicId(newTopic.id))
      navigation.navigate('Home', { screen: 'ChatScreen', params: { topicId: newTopic.id } })
    } else {
      newestTopic.assistantId = targetAssistant.id
      dispatch(setCurrentTopicId(newestTopic.id))
      navigation.navigate('Home', { screen: 'ChatScreen', params: { topicId: newestTopic.id } })
    }
  }

  const openAssistantSelection = () => {
    haptic(ImpactFeedbackStyle.Medium)
    selectionSheetRef.current?.present()
  }

  const closeBottomSheet = () => {
    selectionSheetRef.current?.dismiss()
  }

  const handleSelectAssistant = (selectedAssistant: Assistant) => {
    closeBottomSheet()
    handleAddNewTopic(selectedAssistant)
  }

  const selectionItems = React.useMemo(() => {
    if (isLoading || !assistants.length) {
      return []
    }

    return assistants.map(assistantItem => ({
      key: assistantItem.id,
      label: (
        <YStack className="gap-1 flex-1 justify-center">
          <Text className="text-sm font-bold" numberOfLines={1} ellipsizeMode="tail">
            {assistant.name}
          </Text>
          {!isEmpty(assistant.prompt) && (
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              className="text-xs  text-text-secondary dark:text-text-secondary-dark">
              {assistant.prompt}
            </Text>
          )}
        </YStack>
      ),
      icon: (
        <EmojiAvatar
          emoji={assistantItem.emoji}
          size={42}
          borderRadius={16}
          borderWidth={3}
          borderColor={isDark ? '#444444' : '#eeeeee'}
        />
      ),
      onSelect: () => handleSelectAssistant(assistantItem)
    }))
  }, [isLoading, assistants, assistant.name, assistant.prompt, isDark, handleSelectAssistant])

  return (
    <>
      <Pressable
        onPress={() => handleAddNewTopic()}
        onLongPress={openAssistantSelection}
        unstable_pressDelay={50}
        delayLongPress={150}
        className="active:opacity-20"
        disabled={isLoading}>
        <MessageSquareDiff size={24} />
      </Pressable>

      <SelectionSheet
        items={selectionItems}
        snapPoints={['40%', '90%']}
        ref={selectionSheetRef}
        placeholder={t('topics.select_assistant')}
      />
    </>
  )
}
