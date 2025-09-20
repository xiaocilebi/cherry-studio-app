import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { AtSign } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableOpacity } from 'react-native'
import { Text, XStack } from 'tamagui'

import { Assistant, Model } from '@/types/assistant'
import { haptic } from '@/utils/haptic'
import { getBaseModelName } from '@/utils/naming'

import { ModelIcon } from '@/componentsV2/icons'
import ModelSheet from '@/componentsV2/features/Sheet/ModelSheet'

interface MentionButtonProps {
  mentions: Model[]
  setMentions: (mentions: Model[]) => void
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

const BUTTON_STYLES = {
  maxWidth: 150,
  container: {
    gap: 4,
    alignItems: 'center' as const,
    backgroundColor: '$green10',
    borderRadius: 48,
    borderColor: '$green20',
    borderWidth: 0.5,
    paddingVertical: 4,
    paddingHorizontal: 4
  },
  text: {
    color: '$green100'
  }
}

const DISPLAY_CONSTANTS = {
  ICON_SIZE: 20,
  MODEL_ICON_SIZE: 20,
  MAX_TEXT_WIDTH: 110,
  MAX_VISIBLE_MODELS: 3
} as const

export const MentionButton: React.FC<MentionButtonProps> = ({ mentions, setMentions, assistant, updateAssistant }) => {
  const { t } = useTranslation()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePress = () => {
    Keyboard.dismiss()
    haptic(ImpactFeedbackStyle.Medium)
    bottomSheetModalRef.current?.present()
  }

  const handleModelChange = async (models: Model[], isMultiSelectActive?: boolean) => {
    setMentions(models)

    if (isMultiSelectActive) return

    // 当助手没有默认模型且只选择了一个模型时，设置为默认模型
    const shouldSetDefaultModel = !assistant.defaultModel && models.length === 1

    const updatedAssistant: Assistant = {
      ...assistant,
      defaultModel: shouldSetDefaultModel ? models[0] : assistant.defaultModel,
      model: models[0]
    }

    await updateAssistant(updatedAssistant)
  }

  const renderEmptyState = () => <AtSign size={DISPLAY_CONSTANTS.ICON_SIZE} />

  const renderSingleModel = (model: Model) => (
    <XStack {...BUTTON_STYLES.container} justifyContent="center">
      <ModelIcon model={model} size={DISPLAY_CONSTANTS.MODEL_ICON_SIZE} />
      <Text
        maxWidth={DISPLAY_CONSTANTS.MAX_TEXT_WIDTH}
        numberOfLines={1}
        {...BUTTON_STYLES.text}
        ellipsizeMode="middle">
        {getBaseModelName(model.name)}
      </Text>
    </XStack>
  )

  const renderMultipleModels = () => (
    <XStack {...BUTTON_STYLES.container} justifyContent="center">
      {mentions.slice(0, DISPLAY_CONSTANTS.MAX_VISIBLE_MODELS).map((mention, index) => (
        <ModelIcon key={index} model={mention} size={DISPLAY_CONSTANTS.MODEL_ICON_SIZE} />
      ))}
      <Text {...BUTTON_STYLES.text}>{t('inputs.mentions', { number: mentions.length })}</Text>
    </XStack>
  )

  const renderButtonContent = () => {
    if (mentions.length === 0) return renderEmptyState()
    if (mentions.length === 1) return renderSingleModel(mentions[0])
    return renderMultipleModels()
  }

  return (
    <>
      <TouchableOpacity style={{ maxWidth: BUTTON_STYLES.maxWidth }} onPress={handlePress} hitSlop={5}>
        {renderButtonContent()}
      </TouchableOpacity>

      <ModelSheet ref={bottomSheetModalRef} mentions={mentions} setMentions={handleModelChange} multiple={true} />
    </>
  )
}
