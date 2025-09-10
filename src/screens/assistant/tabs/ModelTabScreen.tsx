import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { YStack } from 'tamagui'

import { ModelTabContent } from '@/components/assistant/ModelTabContent'
import { useAssistant } from '@/hooks/useAssistant'
import { AssistantDetailTabParamList } from '@/navigators/AssistantDetailTabNavigator'

type ModelTabRouteProp = RouteProp<AssistantDetailTabParamList, 'ModelTab'>

export default function ModelTabScreen() {
  const route = useRoute<ModelTabRouteProp>()
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
        <ModelTabContent assistant={assistant} updateAssistant={updateAssistant} />
      </YStack>
    </KeyboardAwareScrollView>
  )
}
