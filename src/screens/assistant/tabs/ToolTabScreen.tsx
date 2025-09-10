import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { YStack } from 'tamagui'

import { ToolTabContent } from '@/components/assistant/ToolTabContent'
import { useAssistant } from '@/hooks/useAssistant'
import { AssistantDetailTabParamList } from '@/navigators/AssistantDetailTabNavigator'

type ToolTabRouteProp = RouteProp<AssistantDetailTabParamList, 'ToolTab'>

export default function ToolTabScreen() {
  const route = useRoute<ToolTabRouteProp>()
  const { assistant: _assistant } = route.params
  const { assistant, updateAssistant } = useAssistant(_assistant.id)

  if (!assistant) return null

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bottomOffset={10}>
      <YStack flex={1} paddingTop={10} backgroundColor="$backgroundPrimary">
        <ToolTabContent assistant={assistant} updateAssistant={updateAssistant} />
      </YStack>
    </KeyboardAwareScrollView>
  )
}
