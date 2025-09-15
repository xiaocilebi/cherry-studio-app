import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { MessageSquareDiff } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import { Text, YStack } from 'tamagui'

import { useExternalAssistants } from '@/hooks/useAssistant'
import { useTheme } from '@/hooks/useTheme'
import { useTopics } from '@/hooks/useTopic'
import { createNewTopic, getNewestTopic } from '@/services/TopicService'
import { useAppDispatch } from '@/store'
import { setCurrentTopicId } from '@/store/topic'
import { Assistant } from '@/types/assistant'
import { DrawerNavigationProps } from '@/types/naviagate'
import { getAssistantWithTopic } from '@/utils/assistants'
import { haptic } from '@/utils/haptic'

import EmojiAvatar from '../assistant/EmojiAvator'
import SelectionSheet from '../ui/SelectionSheet'

interface NewTopicButtonProps {
  assistant: Assistant
}

const NewTopicButton: React.FC<NewTopicButtonProps> = ({ assistant }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<DrawerNavigationProps>()
  const dispatch = useAppDispatch()
  const { topics } = useTopics()
  const { assistants, isLoading } = useExternalAssistants()
  const assistantWithTopics = getAssistantWithTopic(assistants, topics)
  const selectionSheetRef = useRef<BottomSheetModal | null>(null)
  const { isDark } = useTheme()

  const handleAddNewTopic = async (selectedAssistant?: Assistant) => {
    haptic(ImpactFeedbackStyle.Medium)
    const targetAssistant = selectedAssistant || assistant
    const newestTopic = await getNewestTopic()

    if (newestTopic && newestTopic.assistantId === targetAssistant.id && newestTopic.messages.length === 0) {
      newestTopic.assistantId = targetAssistant.id
      dispatch(setCurrentTopicId(newestTopic.id))
      navigation.navigate('Home', { screen: 'ChatScreen', params: { topicId: newestTopic.id } })
    } else {
      const newTopic = await createNewTopic(targetAssistant)
      dispatch(setCurrentTopicId(newTopic.id))
      navigation.navigate('Home', { screen: 'ChatScreen', params: { topicId: newTopic.id } })
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
    if (isLoading || !assistantWithTopics.length) {
      return []
    }

    return assistantWithTopics.map(assistantItem => ({
      key: assistantItem.id,
      label: (
        <YStack gap={3}>
          <Text fontSize={16} lineHeight={18} ellipsizeMode="tail" numberOfLines={1}>
            {assistantItem.name}
          </Text>
          {assistantItem.description && (
            <Text fontSize={12} ellipsizeMode="tail" numberOfLines={1} color="$textSecondary" opacity={0.7}>
              {assistantItem.description}
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
  }, [assistantWithTopics, isLoading])

  return (
    <>
      <Pressable
        onPress={() => handleAddNewTopic()}
        onLongPress={openAssistantSelection}
        delayLongPress={400}
        style={({ pressed }) => ({
          opacity: pressed ? 0.6 : 1,
          padding: 8,
          borderRadius: 8
        })}
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

export default NewTopicButton
