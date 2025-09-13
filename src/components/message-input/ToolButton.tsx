import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'

import { Assistant } from '@/types/assistant'
import { FileMetadata } from '@/types/file'
import { haptic } from '@/utils/haptic'

import { AssetsIcon } from '../icons/AssetsIcon'
import ToolSheet from '../sheets/ToolSheet'

interface AddAssetsButtonProps {
  files: FileMetadata[]
  setFiles: (files: FileMetadata[]) => void
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

export const ToolButton: React.FC<AddAssetsButtonProps> = ({ files, setFiles, assistant, updateAssistant }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePress = () => {
    Keyboard.dismiss()
    haptic(ImpactFeedbackStyle.Medium)
    bottomSheetModalRef.current?.present()
  }

  return (
    <>
      <TouchableOpacity onPress={handlePress}>
        <AssetsIcon size={20} />
      </TouchableOpacity>

      <ToolSheet
        ref={bottomSheetModalRef}
        files={files}
        setFiles={setFiles}
        assistant={assistant}
        updateAssistant={updateAssistant}
      />
    </>
  )
}
