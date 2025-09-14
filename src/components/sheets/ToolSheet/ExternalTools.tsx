import { Check, Globe, Palette } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text, XStack, YStack } from 'tamagui'

import { isGenerateImageModels, isWebSearchModel } from '@/config/models'
import { Assistant, Model } from '@/types/assistant'

interface ExternalTool {
  key: string
  label: string
  icon: React.ReactNode
  onPress: () => void
  getTextColor: () => string
  getTrailingIcon: () => React.ReactNode | null
  shouldShow: boolean
}

interface ExternalToolsProps {
  mentions: Model[]
  assistant: Assistant
  onWebSearchToggle: () => void
  onGenerateImageToggle: () => void
}

export const ExternalTools: React.FC<ExternalToolsProps> = ({
  mentions,
  assistant,
  onWebSearchToggle,
  onGenerateImageToggle
}) => {
  const { t } = useTranslation()

  const options: ExternalTool[] = [
    {
      key: 'webSearch',
      label: t('common.websearch'),
      icon: <Globe size={18} color={assistant.enableWebSearch ? '$green100' : '$textPrimary'} />,
      onPress: onWebSearchToggle,
      getTextColor: () => (assistant.enableWebSearch ? '$green100' : '$textPrimary'),
      getTrailingIcon: () => (assistant.enableWebSearch ? <Check size={18} color="$green100" /> : null),
      // 网络搜索模型 && 设置了工具调用 && 设置了网络搜索服务商 才能开启网络搜索
      shouldShow:
        isWebSearchModel(mentions[0]) &&
        assistant.settings?.toolUseMode !== undefined &&
        assistant.webSearchProviderId !== undefined
    },
    {
      key: 'generateImage',
      label: t('common.generateImage'),
      icon: <Palette size={18} color={assistant.enableGenerateImage ? '$green100' : '$textPrimary'} />,
      onPress: onGenerateImageToggle,
      getTextColor: () => (assistant.enableGenerateImage ? '$green100' : '$textPrimary'),
      getTrailingIcon: () => (assistant.enableGenerateImage ? <Check size={18} color="$green100" /> : null),
      shouldShow: isGenerateImageModels(mentions)
    }
  ]

  if (options.length === 0) {
    return null
  }

  return (
    <YStack paddingHorizontal={20}>
      {options.map(
        option =>
          option.shouldShow && (
            <Button
              padding={0}
              key={option.key}
              chromeless
              onPress={option.onPress}
              justifyContent="flex-start"
              alignItems="center"
              flex={1}>
              <XStack gap={8} alignItems="center" flex={1} justifyContent="space-between">
                <XStack gap={8} alignItems="center">
                  {option.icon}
                  <Text color={option.getTextColor()} fontSize={18} textAlign="center">
                    {option.label}
                  </Text>
                </XStack>
                {option.getTrailingIcon()}
              </XStack>
            </Button>
          )
      )}
    </YStack>
  )
}
