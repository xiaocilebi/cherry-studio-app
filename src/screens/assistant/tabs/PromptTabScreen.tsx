import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import { YStack } from '@/componentsV2'
import { useAssistant } from '@/hooks/useAssistant'
import { useTheme } from '@/hooks/useTheme'
import { AssistantDetailTabParamList } from '@/navigators/AssistantDetailTabNavigator'
import { PromptTabContent } from '@/componentsV2/features/Assistant/PromptTabContent'

type PromptTabRouteProp = RouteProp<AssistantDetailTabParamList, 'PromptTab'>

export default function PromptTabScreen() {
  const route = useRoute<PromptTabRouteProp>()
  const { isDark } = useTheme()
  const { assistant: _assistant } = route.params
  const { assistant, updateAssistant } = useAssistant(_assistant.id)

  if (!assistant) return null

  return (
    <KeyboardAwareScrollView
      className={`flex-1 ${isDark ? 'bg-[#121213ff]' : 'bg-[#f7f7f7ff]'}`}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bottomOffset={10}>
      <YStack className="flex-1 pt-2.5 bg-transparent">
        <PromptTabContent assistant={assistant} updateAssistant={updateAssistant} />
      </YStack>
    </KeyboardAwareScrollView>
  )
}
