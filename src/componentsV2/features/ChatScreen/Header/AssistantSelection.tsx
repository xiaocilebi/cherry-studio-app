import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { Text, XStack, YStack } from '@/componentsV2'
import AssistantItemSheet from '@/componentsV2/features/Assistant/AssistantItemSheet'
import { Assistant, Topic } from '@/types/assistant'
import { DrawerNavigationProps } from '@/types/naviagate'

interface AssistantSelectionProps {
  assistant: Assistant
  topic: Topic
}

export const AssistantSelection: React.FC<AssistantSelectionProps> = ({ assistant, topic }) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const navigation = useNavigation<DrawerNavigationProps>()
  const { t } = useTranslation()

  const handlePress = () => {
    bottomSheetRef.current?.present()
  }

  const handleEditAssistant = (assistantId: string) => {
    navigation.navigate('Assistant', { screen: 'AssistantDetailScreen', params: { assistantId } })
  }

  const handlePressActionButton = () => {
    bottomSheetRef.current?.dismiss()
    navigation.navigate('Assistant', { screen: 'AssistantScreen' })
  }

  const actionButton = {
    text: t('assistants.title.change'),
    onPress: handlePressActionButton
  }

  return (
    <>
      <Pressable onPress={handlePress} className="active:opacity-60">
        <XStack className="gap-3.5 items-center justify-center">
          <YStack className="gap-0.5 items-center justify-start">
            <Text
              className="text-text-primary dark:text-text-primary-dark text-base"
              ellipsizeMode="tail"
              numberOfLines={1}>
              {assistant.name}
            </Text>
            <Text className="text-[11px] text-gray-60 dark:text-gray-60" ellipsizeMode="tail" numberOfLines={1}>
              {topic.name}
            </Text>
          </YStack>
        </XStack>
      </Pressable>
      <AssistantItemSheet
        ref={bottomSheetRef}
        assistant={assistant}
        source="external"
        onEdit={handleEditAssistant}
        actionButton={actionButton}
      />
    </>
  )
}
