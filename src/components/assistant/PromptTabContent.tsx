import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input, TextArea, YStack } from 'tamagui'

import { SettingRowTitle } from '@/components/settings'
import { Assistant } from '@/types/assistant'

interface PromptTabContentProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => void
}

export function PromptTabContent({ assistant, updateAssistant }: PromptTabContentProps) {
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    name: assistant?.name || '',
    prompt: assistant?.prompt || ''
  })

  useEffect(() => {
    setFormData({
      name: assistant?.name || '',
      prompt: assistant?.prompt || ''
    })
  }, [assistant])

  const handleBlur = () => {
    if (formData.name !== assistant.name || formData.prompt !== assistant.prompt) {
      updateAssistant({
        ...assistant,
        name: formData.name,
        prompt: formData.prompt
      })
    }
  }

  return (
    <MotiView
      style={{ flex: 1, gap: 30 }}
      from={{ opacity: 0, translateY: 10 }}
      animate={{
        translateY: 0,
        opacity: 1
      }}
      exit={{ opacity: 1, translateY: -10 }}
      transition={{
        type: 'timing'
      }}>
      <YStack width="100%" gap={8}>
        <SettingRowTitle paddingHorizontal={10}>{t('common.name')}</SettingRowTitle>
        <Input
          height={49}
          paddingVertical={0}
          paddingHorizontal={16}
          fontSize={14}
          lineHeight={14 * 1.2}
          placeholder={t('assistants.name')}
          value={formData.name}
          onChangeText={name => setFormData(prev => ({ ...prev, name }))}
          onBlur={handleBlur}
        />
      </YStack>
      <YStack width="100%" gap={8} flex={1}>
        <SettingRowTitle paddingHorizontal={10}>{t('common.prompt')}</SettingRowTitle>
        <TextArea
          flex={1}
          padding={15}
          placeholder={t('common.prompt')}
          multiline
          verticalAlign="top"
          value={formData.prompt}
          onChangeText={prompt => setFormData(prev => ({ ...prev, prompt }))}
          onBlur={handleBlur}
        />
      </YStack>
    </MotiView>
  )
}
