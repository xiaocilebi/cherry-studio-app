import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { MotiView } from 'moti'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Group, Row, RowRightArrow, Text, TextField, YStack } from '@/componentsV2'
import { ChevronRight } from '@/componentsV2/icons/LucideIcon'
import { isReasoningModel } from '@/config/models'
import { DEFAULT_CONTEXTCOUNT, DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from '@/constants'
import { Assistant, AssistantSettings, Model } from '@/types/assistant'

import { Button, Switch } from 'heroui-native'

import ModelSheet from '../sheets/ModelSheet'
import { ReasoningSheet } from '../sheets/ReasoningSheet'

interface ModelTabContentProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

export function ModelTabContent({ assistant, updateAssistant }: ModelTabContentProps) {
  const { t } = useTranslation()
  const modelSheetRef = useRef<BottomSheetModal>(null)
  const reasoningSheetRef = useRef<BottomSheetModal>(null)

  // Local state for input values
  const [temperatureInput, setTemperatureInput] = useState(
    (assistant.settings?.temperature ?? DEFAULT_TEMPERATURE).toString()
  )
  const [contextInput, setContextInput] = useState(
    (assistant.settings?.contextCount ?? DEFAULT_CONTEXTCOUNT).toString()
  )
  const [maxTokensInput, setMaxTokensInput] = useState((assistant.settings?.maxTokens ?? DEFAULT_MAX_TOKENS).toString())

  // 统一的助手更新函数
  const handleAssistantChange = async (updates: Partial<Assistant>) => {
    const updatedAssistant = { ...assistant, ...updates }
    await updateAssistant(updatedAssistant)
  }

  // 设置更新函数
  const handleSettingsChange = (key: keyof AssistantSettings, value: any) => {
    const updatedSettings = { ...assistant.settings, [key]: value }
    handleAssistantChange({ settings: updatedSettings })
  }

  // 模型更新函数
  const handleModelChange = async (models: Model[]) => {
    await handleAssistantChange({ defaultModel: models[0] })
  }

  const handleModelPress = () => {
    modelSheetRef.current?.present()
  }

  const handleReasoningPress = () => {
    reasoningSheetRef.current?.present()
  }

  const model = assistant?.defaultModel ? [assistant.defaultModel] : []
  const settings = assistant.settings || {}

  return (
    <MotiView
      style={{ flex: 1, gap: 16 }}
      from={{ opacity: 0, translateY: 10 }}
      animate={{
        translateY: 0,
        opacity: 1
      }}
      exit={{ opacity: 1, translateY: -10 }}
      transition={{
        type: 'timing'
      }}>
      <Button
        variant="tertiary"
        className="border-0 justify-between bg-ui-card-background dark:bg-ui-card-background-dark rounded-xl"
        onPress={handleModelPress}>
        <Button.LabelContent className="flex-1 justify-between items-center flex-row">
          {model.length > 0 ? (
            <>
              <Text className="leading-[17px] flex-shrink" numberOfLines={1} ellipsizeMode="tail">
                {t(`provider.${model[0].provider}`)}
              </Text>
              <Text className="leading-5 text-xs flex-shrink-0 max-w-[80%]" numberOfLines={1} ellipsizeMode="tail">
                {model[0].name}
              </Text>
            </>
          ) : (
            <Text className="leading-5 flex-1" numberOfLines={1} ellipsizeMode="tail">
              {t('settings.models.empty')}
            </Text>
          )}
        </Button.LabelContent>
        <Button.EndContent>
          <ChevronRight size={14} />
        </Button.EndContent>
      </Button>
      <Group>
        <Row>
          <Text>{t('assistants.settings.temperature')}</Text>
          <TextField className="min-w-[60px]">
            <TextField.Input
              className="h-[25px] text-xs leading-[14.4px] text-center"
              value={temperatureInput}
              onChangeText={setTemperatureInput}
              onBlur={() => {
                const parsedValue = parseFloat(temperatureInput)

                if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 1) {
                  handleSettingsChange('temperature', parsedValue)
                } else {
                  setTemperatureInput((settings.temperature ?? DEFAULT_TEMPERATURE).toString())
                }
              }}
              keyboardType="numeric"
            />
          </TextField>
        </Row>
        <Row>
          <Text>{t('assistants.settings.context')}</Text>
          <TextField className="min-w-[60px]">
            <TextField.Input
              className="h-[25px] text-xs leading-[14.4px] text-center"
              value={contextInput}
              onChangeText={setContextInput}
              onBlur={() => {
                const parsedValue = parseInt(contextInput)

                if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 30) {
                  handleSettingsChange('contextCount', parsedValue)
                } else {
                  setContextInput((settings.contextCount ?? DEFAULT_CONTEXTCOUNT).toString())
                }
              }}
              keyboardType="numeric"
            />
          </TextField>
        </Row>
      </Group>

      <Group>
        <Row>
          <Text>{t('assistants.settings.stream_output')}</Text>
          <Switch
            color="success"
            isSelected={settings.streamOutput ?? true}
            onSelectedChange={checked => handleSettingsChange('streamOutput', checked)}
          />
        </Row>
        <Row>
          <Text>{t('assistants.settings.max_tokens')}</Text>
          <Switch
            color="success"
            isSelected={settings.enableMaxTokens ?? false}
            onSelectedChange={checked => handleSettingsChange('enableMaxTokens', checked)}
          />
        </Row>
        {settings.enableMaxTokens && (
          <Row>
            <Text>{t('assistants.settings.max_tokens_value')}</Text>
            <TextField className="min-w-[60px]">
              <TextField.Input
                className="h-[25px] text-xs leading-[14.4px] text-center"
                value={maxTokensInput}
                onChangeText={setMaxTokensInput}
                onBlur={() => {
                  const parsedValue = parseInt(maxTokensInput)

                  if (!isNaN(parsedValue) && parsedValue > 0) {
                    handleSettingsChange('maxTokens', parsedValue)
                  } else {
                    setMaxTokensInput((settings.maxTokens ?? DEFAULT_MAX_TOKENS).toString())
                  }
                }}
                keyboardType="numeric"
              />
            </TextField>
          </Row>
        )}

        {isReasoningModel(model[0]) && (
          <Button
            variant="tertiary"
            className="border-0 py-3 pl-4 pr-5 justify-between bg-transparent rounded-xl"
            onPress={handleReasoningPress}>
            <Button.LabelContent className="flex-1 justify-between items-center flex-row">
              <Text className="flex-1">{t('assistants.settings.reasoning')}</Text>

              <YStack className="justify-end">
                <Text className="text-xs bg-green-10 dark:bg-green-dark-10 border-green-20 dark:border-green-dark-20 text-green-100 dark:text-green-dark-100 border-[0.5px] py-[2px] px-2 rounded-lg">
                  {t(`assistants.settings.reasoning.${settings.reasoning_effort || 'off'}`)}
                </Text>
              </YStack>
            </Button.LabelContent>
            <Button.EndContent>
              <ChevronRight size={14} />
            </Button.EndContent>
          </Button>
        )}
      </Group>
      <ModelSheet ref={modelSheetRef} mentions={model} setMentions={handleModelChange} multiple={false} />
      {model[0] && (
        <ReasoningSheet
          ref={reasoningSheetRef}
          model={model[0]}
          assistant={assistant}
          updateAssistant={handleAssistantChange}
        />
      )}
    </MotiView>
  )
}
