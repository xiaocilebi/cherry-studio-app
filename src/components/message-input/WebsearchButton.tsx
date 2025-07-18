import { Globe } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { Keyboard } from 'react-native'
import { Button } from 'tamagui'

import { Assistant } from '@/types/assistant'
import { useIsDark } from '@/utils'
import { getGreenColor } from '@/utils/color'
import { haptic } from '@/utils/haptic'

interface WebsearchButtonProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

export const WebsearchButton: React.FC<WebsearchButtonProps> = ({ assistant, updateAssistant }) => {
  const isDark = useIsDark()

  const handlePress = () => {
    Keyboard.dismiss()
    haptic(ImpactFeedbackStyle.Light)
    updateAssistant({
      ...assistant,
      enableWebSearch: !assistant.enableWebSearch
    })
  }

  return (
    <Button
      chromeless
      circular
      size={20}
      icon={<Globe size={20} />}
      onPress={handlePress}
      color={assistant.enableWebSearch ? getGreenColor(isDark, 100) : undefined}
    />
  )
}
