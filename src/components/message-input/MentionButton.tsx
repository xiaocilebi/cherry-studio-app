import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { AtSign } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { Keyboard } from 'react-native'
import { Button } from 'tamagui'

import { Assistant, Model } from '@/types/assistant'
import { haptic } from '@/utils/haptic'

import ModelSheet from '../sheets/ModelSheet'

interface MentionButtonProps {
  mentions: Model[]
  setMentions: (mentions: Model[]) => void
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

export const MentionButton: React.FC<MentionButtonProps> = ({ mentions, setMentions, assistant, updateAssistant }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePress = () => {
    Keyboard.dismiss()
    haptic(ImpactFeedbackStyle.Medium)
    bottomSheetModalRef.current?.present()
  }

  const handleModelChange = async (models: Model[], isMultiSelectActive?: boolean) => {
    setMentions(models)
    if (isMultiSelectActive) return
    // @切换模型，助手没有设置默认模型的情况下永久切换
    const updatedAssistant: Assistant = {
      ...assistant,
      defaultModel: !assistant.defaultModel && mentions.length === 1 ? mentions[0] : assistant.defaultModel,
      model: models[0]
    }

    await updateAssistant(updatedAssistant)
  }

  return (
    <>
      <Button
        circular
        chromeless
        size={20}
        icon={<AtSign size={20} />}
        color={mentions.length > 0 ? '$green100' : undefined}
        onPress={handlePress}
      />

      <ModelSheet ref={bottomSheetModalRef} mentions={mentions} setMentions={handleModelChange} multiple={true} />
    </>
  )
}
