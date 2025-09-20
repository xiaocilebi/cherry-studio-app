import { BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { SquareFunction, Wrench } from '@/componentsV2/icons/LucideIcon'
import { Assistant } from '@/types/assistant'
import SelectionSheet, { SelectionSheetItem } from '@/componentsV2/base/SelectionSheet'


interface ToolUseSheetProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
  ref: React.RefObject<BottomSheetModal | null>
}

export const ToolUseSheet: FC<ToolUseSheetProps> = ({ assistant, updateAssistant, ref }) => {
  const { t } = useTranslation()

  const toolUseOptions: SelectionSheetItem[] = [
    {
      id: 'function',
      label: t('assistants.settings.tooluse.function'),
      icon: (isSelected: boolean) => (
        <SquareFunction
          size={20}
          className={isSelected ? 'text-green-100 dark:text-green-dark-100' : 'text-text-primary dark:text-text-primary-dark'}
        />
      ),
      isSelected: assistant.settings?.toolUseMode === 'function',
      onSelect: () => handleToolUseModeToggle('function')
    },
    {
      id: 'prompt',
      label: t('assistants.settings.tooluse.prompt'),
      icon: (isSelected: boolean) => (
        <Wrench
          size={20}
          className={isSelected ? 'text-green-100 dark:text-green-dark-100' : 'text-text-primary dark:text-text-primary-dark'}
        />
      ),
      isSelected: assistant.settings?.toolUseMode === 'prompt',
      onSelect: () => handleToolUseModeToggle('prompt')
    }
  ]

  const handleToolUseModeToggle = async (mode: 'function' | 'prompt') => {
    const newToolUseMode = mode === assistant.settings?.toolUseMode ? undefined : mode
    await updateAssistant({
      ...assistant,
      settings: {
        ...assistant.settings,
        toolUseMode: newToolUseMode
      }
    })
    ref.current?.dismiss()
  }

  return <SelectionSheet items={toolUseOptions} ref={ref} />
}
