import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { YStack } from 'tamagui'

import { PromptTabContent } from '@/components/assistant/PromptTabContent'
import { useAssistant } from '@/hooks/useAssistant'
import { useTheme } from '@/hooks/useTheme'
import { AssistantDetailTabParamList } from '@/navigators/AssistantDetailTabNavigator'

type PromptTabRouteProp = RouteProp<AssistantDetailTabParamList, 'PromptTab'>

export default function PromptTabScreen() {
  const route = useRoute<PromptTabRouteProp>()
  const { isDark } = useTheme()
  const { assistant: _assistant } = route.params
  const { assistant, updateAssistant } = useAssistant(_assistant.id)

  if (!assistant) return null

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff' }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bottomOffset={10}>
      <YStack flex={1} paddingTop={10} backgroundColor="$backgroundPrimary">
        <PromptTabContent assistant={assistant} updateAssistant={updateAssistant} />
      </YStack>
    </KeyboardAwareScrollView>
  )
}
