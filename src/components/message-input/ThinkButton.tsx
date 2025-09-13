import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { Keyboard } from 'react-native'
import { Button } from 'tamagui'

import { Assistant } from '@/types/assistant'
import { haptic } from '@/utils/haptic'

import {
  MdiLightbulbAutoOutline,
  MdiLightbulbOffOutline,
  MdiLightbulbOn10,
  MdiLightbulbOn50,
  MdiLightbulbOn90
} from '../icons/MdiLightbulbIcon'
import { ReasoningSheet } from '../sheets/ReasoningSheet'

interface ThinkButtonProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

export const ThinkButton: React.FC<ThinkButtonProps> = ({ assistant, updateAssistant }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const getIcon = () => {
    const size = 20

    switch (assistant.settings?.reasoning_effort) {
      case 'auto':
        return <MdiLightbulbAutoOutline size={size} />
      case 'high':
        return <MdiLightbulbOn90 size={size} />
      case 'medium':
        return <MdiLightbulbOn50 size={size} />
      case 'low':
        return <MdiLightbulbOn10 size={size} />
      case null:
      default:
        return <MdiLightbulbOffOutline size={size} />
    }
  }

  const handlePress = () => {
    Keyboard.dismiss()
    haptic(ImpactFeedbackStyle.Medium)
    bottomSheetModalRef.current?.present()
  }

  return (
    <>
      <Button chromeless circular size={20} icon={getIcon()} onPress={handlePress} />

      {assistant.model && (
        <ReasoningSheet
          ref={bottomSheetModalRef}
          model={assistant.model}
          assistant={assistant}
          updateAssistant={updateAssistant}
        />
      )}
    </>
  )
}
