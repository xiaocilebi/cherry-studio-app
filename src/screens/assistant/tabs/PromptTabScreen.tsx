import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { YStack } from 'tamagui'

import { PromptTabContent } from '@/components/assistant/PromptTabContent'
import { AssistantDetailTabParamList } from '@/navigators/AssistantDetailTabNavigator'

type PromptTabRouteProp = RouteProp<AssistantDetailTabParamList, 'PromptTab'>

export default function PromptTabScreen() {
  const route = useRoute<PromptTabRouteProp>()
  const { assistant, updateAssistant } = route.params

  return (
    <YStack flex={1} paddingTop={10} backgroundColor="$backgroundPrimary">
      <PromptTabContent assistant={assistant} updateAssistant={updateAssistant} />
    </YStack>
  )
}
