import { BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { useRef } from 'react'
import { Button } from 'tamagui'

import { Assistant } from '@/types/assistant'

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
    const size = 24

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
    bottomSheetModalRef.current?.present()
  }

  return (
    <>
      <Button chromeless size={24} icon={getIcon()} onPress={handlePress} />

      <ReasoningSheet ref={bottomSheetModalRef} assistant={assistant} updateAssistant={updateAssistant} />
    </>
  )
}
