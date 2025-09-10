import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { YStack } from 'tamagui'

import { ToolTabContent } from '@/components/assistant/ToolTabContent'
import { AssistantDetailTabParamList } from '@/navigators/AssistantDetailTabNavigator'

type ToolTabRouteProp = RouteProp<AssistantDetailTabParamList, 'ToolTab'>

export default function ToolTabScreen() {
  const route = useRoute<ToolTabRouteProp>()
  const { assistant, updateAssistant } = route.params

  return (
    <YStack flex={1} paddingTop={10} backgroundColor="$backgroundPrimary">
      <ToolTabContent assistant={assistant} updateAssistant={updateAssistant} />
    </YStack>
  )
}
