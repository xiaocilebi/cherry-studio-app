import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import React, { forwardRef, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View } from 'tamagui'

import {
  MdiLightbulbAutoOutline,
  MdiLightbulbOffOutline,
  MdiLightbulbOn,
  MdiLightbulbOn30,
  MdiLightbulbOn50,
  MdiLightbulbOn80
} from '@/components/icons/MdiLightbulbIcon'
import { getThinkModelType, MODEL_SUPPORTED_OPTIONS } from '@/config/models'
import { isDoubaoThinkingAutoModel } from '@/config/models'
import { useTheme } from '@/hooks/useTheme'
import { Assistant, Model, ThinkingOption } from '@/types/assistant'

import SelectionList, { SelectionListItem } from '../ui/SelectionList'

interface ReasoningSheetProps {
  model: Model
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

const createThinkingIcon = (option?: ThinkingOption) => {
  switch (option) {
    case 'minimal':
      return <MdiLightbulbOn30 />
    case 'low':
      return <MdiLightbulbOn50 />
    case 'medium':
      return <MdiLightbulbOn80 />
    case 'high':
      return <MdiLightbulbOn />
    case 'auto':
      return <MdiLightbulbAutoOutline />
    case 'off':
      return <MdiLightbulbOffOutline />
    default:
      return <MdiLightbulbOffOutline />
  }
}

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
)

export const ReasoningSheet = forwardRef<BottomSheetModal, ReasoningSheetProps>(
  ({ model, assistant, updateAssistant }, ref) => {
    const { t } = useTranslation()
    const { isDark } = useTheme()
    const [isVisible, setIsVisible] = useState(false)

    const insets = useSafeAreaInsets()

    // Converted from useMemo to a simple const
    const currentReasoningEffort = assistant.settings?.reasoning_effort || 'off'

    const modelType = getThinkModelType(model)

    // 获取当前模型支持的选项
    const supportedOptions: ThinkingOption[] = useMemo(() => {
      if (modelType === 'doubao') {
        if (isDoubaoThinkingAutoModel(model)) {
          return ['off', 'auto', 'high']
        }

        return ['off', 'high']
      }

      return MODEL_SUPPORTED_OPTIONS[modelType]
    }, [model, modelType])

    const onValueChange = (option?: ThinkingOption) => {
      const isEnabled = option !== undefined && option !== 'off'

      if (!isEnabled) {
        updateAssistant({
          ...assistant,
          settings: {
            ...assistant.settings,
            reasoning_effort: undefined,
            reasoning_effort_cache: undefined,
            qwenThinkMode: false
          }
        })
      } else {
        updateAssistant({
          ...assistant,
          settings: {
            ...assistant.settings,
            reasoning_effort: option,
            reasoning_effort_cache: option,
            qwenThinkMode: true
          }
        })
      }

      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    }

    const sheetOptions: SelectionListItem[] = supportedOptions.map(option => ({
      value: option,
      label: t(`assistants.settings.reasoning.${option}`),
      icon: (
        <View width={20} height={20}>
          {createThinkingIcon(option)}
        </View>
      ),
      isSelected: currentReasoningEffort === option,
      onSelect: () => onValueChange(option)
    }))

    useEffect(() => {
      if (!isVisible) return

      const backAction = () => {
        ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
        return true
      }

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
      return () => backHandler.remove()
    }, [ref, isVisible])

    return (
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        enableDynamicSizing={true}
        ref={ref}
        backgroundStyle={{
          borderRadius: 30,
          backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? '#f9f9f9ff' : '#202020ff'
        }}
        onDismiss={() => setIsVisible(false)}
        onChange={index => setIsVisible(index >= 0)}>
        <BottomSheetView style={{ paddingBottom: insets.bottom }}>
          <SelectionList items={sheetOptions} />
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)

ReasoningSheet.displayName = 'ReasoningSheet'
