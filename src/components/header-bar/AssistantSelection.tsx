import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { ChevronRight } from '@tamagui/lucide-icons'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text, XStack, YStack } from 'tamagui'

import { Assistant } from '@/types/assistant'
import { DrawerNavigationProps } from '@/types/naviagate'

import AssistantItemSheet from '../assistant/market/AssistantItemSheet'

interface AssistantSelectionProps {
  assistant: Assistant
}

export const AssistantSelection: React.FC<AssistantSelectionProps> = ({ assistant }) => {
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
      <Button chromeless onPress={handlePress}>
        <XStack gap={14} alignItems="center" justifyContent="center">
          {/*<Text fontSize={30}>{formateEmoji(assistant.emoji)}</Text>*/}

          <YStack gap={2} alignItems="center" justifyContent="flex-start">
            <Text fontSize={20} ellipsizeMode="tail" numberOfLines={1}>
              {assistant.name}
            </Text>
            {/*{assistant.model && (
              <XStack gap={2} alignItems="center" justifyContent="center">
                <ModelIcon model={assistant.model} size={14} />
                <Text fontSize={12} numberOfLines={1} ellipsizeMode="tail">
                  {assistant.model.name}
                </Text>
              </XStack>
            )}*/}
          </YStack>
          <ChevronRight color="$textPrimary" size={18} />
        </XStack>
      </Button>
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
