import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { YStack } from 'tamagui'

import { PromptTabContent } from '@/components/assistant/PromptTabContent'
import { useAssistant } from '@/hooks/useAssistant'
import { AssistantDetailTabParamList } from '@/navigators/AssistantDetailTabNavigator'

type PromptTabRouteProp = RouteProp<AssistantDetailTabParamList, 'PromptTab'>

export default function PromptTabScreen() {
  const route = useRoute<PromptTabRouteProp>()
  const { assistant: _assistant } = route.params
  const { assistant, updateAssistant } = useAssistant(_assistant.id)

  if (!assistant) return null

  return (
    <YStack flex={1} paddingTop={10} backgroundColor="$backgroundPrimary">
      <PromptTabContent assistant={assistant} updateAssistant={updateAssistant} />
    </YStack>
  )
}
