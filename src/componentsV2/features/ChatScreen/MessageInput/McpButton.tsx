import React, { useRef } from 'react'

import { Hammer } from '@/componentsV2/icons'
import { IconButton } from '@/componentsV2/base/IconButton'
import { McpServerSheet } from '../../Sheet/McpServerSheet'
import { Assistant } from '@/types/assistant'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { cn } from 'heroui-native'

interface McpButtonProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

export const McpButton: React.FC<McpButtonProps> = ({ assistant, updateAssistant }) => {
  const mcpServerSheetRef = useRef<BottomSheetModal>(null)

  const openMcpServerSheet = () => {
    mcpServerSheetRef.current?.present()
  }

  return (
    <>
      <IconButton
        icon={
          <Hammer
            size={20}
            className={cn(
              assistant.mcpServers?.length && assistant.mcpServers?.length > 0
                ? 'text-green-100 dark:text-green-dark-100'
                : undefined
            )}
          />
        }
        onPress={openMcpServerSheet}
      />
      <McpServerSheet ref={mcpServerSheetRef} assistant={assistant} updateAssistant={updateAssistant} />
    </>
  )
}
