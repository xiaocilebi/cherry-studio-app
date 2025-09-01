import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { Check } from '@tamagui/lucide-icons'
import React, { forwardRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Text, useTheme, View, XStack, YStack } from 'tamagui'

import {
  MdiLightbulbAutoOutline,
  MdiLightbulbOffOutline,
  MdiLightbulbOn10,
  MdiLightbulbOn50,
  MdiLightbulbOn90
} from '@/components/icons/MdiLightbulbIcon'
import { GEMINI_FLASH_MODEL_REGEX } from '@/config/models'
import {
  isDoubaoThinkingAutoModel,
  isSupportedReasoningEffortGrokModel,
  isSupportedThinkingTokenDoubaoModel,
  isSupportedThinkingTokenGeminiModel,
  isSupportedThinkingTokenQwenModel
} from '@/config/models/reasoning'
import { useTheme as useCustomTheme } from '@/hooks/useTheme'
import { Assistant, ReasoningEffortOptions } from '@/types/assistant'

export type ThinkingOption = ReasoningEffortOptions | 'off'

interface ReasoningSheetProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

// (迁移) 模型类型到支持选项的映射表
const MODEL_SUPPORTED_OPTIONS: Record<string, ThinkingOption[]> = {
  default: ['off', 'low', 'medium', 'high'],
  grok: ['low', 'high'],
  gemini: ['off', 'low', 'medium', 'high', 'auto'],
  gemini_pro: ['low', 'medium', 'high', 'auto'],
  qwen: ['off', 'low', 'medium', 'high'],
  doubao: ['off', 'auto', 'high']
}

// (迁移) 选项转换映射表：当选项不支持时使用的替代选项
const OPTION_FALLBACK: Record<ThinkingOption, ThinkingOption> = {
  off: 'low', // off -> low (for Gemini Pro models)
  low: 'high',
  medium: 'high', // medium -> high (for Grok models)
  high: 'high',
  auto: 'high' // auto -> high (for non-Gemini models)
}

const createThinkingIcon = (option?: ThinkingOption) => {
  switch (option) {
    case 'low':
      return <MdiLightbulbOn10 />
    case 'medium':
      return <MdiLightbulbOn50 />
    case 'high':
      return <MdiLightbulbOn90 />
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
  ({ assistant, updateAssistant }, ref) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const { isDark } = useCustomTheme()
    const model = assistant.model!

    const isGrokModel = isSupportedReasoningEffortGrokModel(model)
    const isGeminiModel = isSupportedThinkingTokenGeminiModel(model)
    const isGeminiFlashModel = GEMINI_FLASH_MODEL_REGEX.test(model?.id || '')
    const isQwenModel = isSupportedThinkingTokenQwenModel(model)
    const isDoubaoModel = isSupportedThinkingTokenDoubaoModel(model)
    const insets = useSafeAreaInsets()

    // Converted from useMemo to a simple const
    const currentReasoningEffort = assistant.settings?.reasoning_effort || 'off'

    const modelType = (() => {
      if (isGeminiModel) {
        return isGeminiFlashModel ? 'gemini' : 'gemini_pro'
      }

      if (isGrokModel) return 'grok'
      if (isQwenModel) return 'qwen'
      if (isDoubaoModel) return 'doubao'
      return 'default'
    })()

    const supportedOptions = (() => {
      if (modelType === 'doubao') {
        if (isDoubaoThinkingAutoModel(model)) {
          return ['off', 'auto', 'high'] as ThinkingOption[]
        }

        return ['off', 'high'] as ThinkingOption[]
      }

      return MODEL_SUPPORTED_OPTIONS[modelType]
    })()

    // 处理Android返回按钮事件
    useEffect(() => {
      const backAction = () => {
        if ((ref as React.RefObject<BottomSheetModal>)?.current) {
          ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
          return true
        }

        return false
      }

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

      return () => backHandler.remove()
    }, [ref])

    useEffect(() => {
      if (currentReasoningEffort && !supportedOptions.includes(currentReasoningEffort)) {
        const fallbackOption = OPTION_FALLBACK[currentReasoningEffort as ThinkingOption]
        updateAssistant({
          ...assistant,
          settings: {
            ...assistant.settings,
            reasoning_effort: fallbackOption === 'off' ? undefined : fallbackOption,
            qwenThinkMode: fallbackOption !== 'off'
          }
        })
      }
    }, [assistant, currentReasoningEffort, supportedOptions, updateAssistant, model?.id])

    const onValueChange = (option?: ThinkingOption) => {
      const isEnabled = option !== undefined && option !== 'off'

      if (!isEnabled) {
        updateAssistant({
          ...assistant,
          settings: {
            ...assistant.settings,
            reasoning_effort: undefined,
            qwenThinkMode: false
          }
        })
      } else {
        updateAssistant({
          ...assistant,
          settings: {
            ...assistant.settings,
            reasoning_effort: option,
            qwenThinkMode: true
          }
        })
      }

      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    }

    const sheetOptions = supportedOptions.map(option => ({
      value: option,
      label: t(`assistants.settings.reasoning.${option === 'auto' ? 'auto' : option}`),
      icon: createThinkingIcon(option),
      isSelected: currentReasoningEffort === option,
      action: () => onValueChange(option)
    }))

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
          backgroundColor: theme.color.val
        }}>
        <BottomSheetView style={{ paddingBottom: insets.bottom }}>
          <YStack gap={10} paddingHorizontal={20} paddingBottom={20}>
            {sheetOptions.map(option => (
              <Button
                key={option.value}
                icon={option.icon}
                onPress={option.action}
                justifyContent="space-between"
                chromeless>
                <XStack flex={1} justifyContent="space-between" alignItems="center">
                  <Text>{option.label}</Text>
                  {option.isSelected ? <Check size={20} /> : <View width={20} />}
                </XStack>
              </Button>
            ))}
          </YStack>
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)

ReasoningSheet.displayName = 'ReasoningSheet'
