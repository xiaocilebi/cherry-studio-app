import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { SquareFunction, Wrench } from '@tamagui/lucide-icons'
import { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Assistant } from '@/types/assistant'

import SelectionSheet, { SelectionSheetItem } from '../ui/SelectionSheet'

interface ToolUseSheetProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
  ref: React.RefObject<BottomSheetModal | null>
}

const ToolUseSheet: FC<ToolUseSheetProps> = ({ assistant, updateAssistant, ref }) => {
  const { t } = useTranslation()

  const toolUseOptions: SelectionSheetItem[] = [
    {
      id: 'function',
      label: t('assistants.settings.tooluse.function'),
      icon: (isSelected: boolean) => <SquareFunction size={20} color={isSelected ? '$green100' : '$textPrimary'} />,
      isSelected: assistant.settings?.toolUseMode === 'function',
      onSelect: () => handleToolUseModeToggle('function')
    },
    {
      id: 'prompt',
      label: t('assistants.settings.tooluse.prompt'),
      icon: (isSelected: boolean) => <Wrench size={20} color={isSelected ? '$green100' : '$textPrimary'} />,
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

export default ToolUseSheet
