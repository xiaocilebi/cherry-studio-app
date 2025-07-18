import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ChevronRight } from '@tamagui/lucide-icons'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text } from 'tamagui'

import { Assistant } from '@/types/assistant'

import { ReasoningSheet } from '../sheets/ReasoningSheet'

interface ReasoningSelectProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

export function ReasoningSelect({ assistant, updateAssistant }: ReasoningSelectProps) {
  const { t } = useTranslation()

  const reasoningEffort = assistant?.settings?.reasoning_effort || 'off'

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present()
  }

  return (
    <>
      <Button
        width="auto"
        backgroundColor="$colorTransparent"
        borderWidth={0}
        iconAfter={ChevronRight}
        onPress={handlePresentModalPress}
        justifyContent="flex-start"
        padding={0}>
        <Text
          fontSize={12}
          backgroundColor="$backgroundGreen"
          color="$foregroundGreen"
          paddingHorizontal={5}
          borderRadius={5}>
          {t(`assistants.settings.reasoning.${reasoningEffort}`)}
        </Text>
      </Button>

      <ReasoningSheet ref={bottomSheetModalRef} assistant={assistant} updateAssistant={updateAssistant} />
    </>
  )
}
