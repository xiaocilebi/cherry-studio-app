import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableOpacity } from 'react-native'

import { AtSign } from '@/componentsV2/icons/LucideIcon'
import { ModelIcon } from '@/componentsV2/icons'
import { Assistant, Model } from '@/types/assistant'
import { haptic } from '@/utils/haptic'
import { getBaseModelName } from '@/utils/naming'
import XStack from '@/componentsV2/layout/XStack'
import Text from '@/componentsV2/base/Text'
import ModelSheet from '../../Sheet/ModelSheet'


interface MentionButtonProps {
  mentions: Model[]
  setMentions: (mentions: Model[]) => void
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

const BUTTON_STYLES = {
  maxWidth: 150,
  container:
    'gap-1 items-center bg-green-10 dark:bg-green-dark-10 rounded-[48px] border-green-20 dark:border-green-dark-20 border-[0.5px] py-1 px-1',
  text: 'text-green-100 dark:text-green-dark-100'
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

  const renderEmptyState = () => (
    <AtSign size={DISPLAY_CONSTANTS.ICON_SIZE} className="text-green-100 dark:text-green-dark-100" />
  )

  const renderSingleModel = (model: Model) => (
    <XStack className={`${BUTTON_STYLES.container} justify-center`}>
      <ModelIcon model={model} size={DISPLAY_CONSTANTS.MODEL_ICON_SIZE} />
      <Text
        className={`max-w-[${DISPLAY_CONSTANTS.MAX_TEXT_WIDTH}px] ${BUTTON_STYLES.text}`}
        numberOfLines={1}
        ellipsizeMode="middle">
        {getBaseModelName(model.name)}
      </Text>
    </XStack>
  )

  const renderMultipleModels = () => (
    <XStack className={`${BUTTON_STYLES.container} justify-center`}>
      {mentions.slice(0, DISPLAY_CONSTANTS.MAX_VISIBLE_MODELS).map((mention, index) => (
        <ModelIcon key={index} model={mention} size={DISPLAY_CONSTANTS.MODEL_ICON_SIZE} />
      ))}
      <Text className={BUTTON_STYLES.text}>{t('inputs.mentions', { number: mentions.length })}</Text>
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
