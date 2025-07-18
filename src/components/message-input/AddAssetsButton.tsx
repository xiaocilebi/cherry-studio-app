import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { Keyboard } from 'react-native'
import { Button } from 'tamagui'

import { FileType } from '@/types/file'
import { haptic } from '@/utils/haptic'

import { AssetsIcon } from '../icons/AssetsIcon'
import FileSheet from '../sheets/FileSheet'

interface AddAssetsButtonProps {
  files: FileType[]
  setFiles: (files: FileType[]) => void
}

export const AddAssetsButton: React.FC<AddAssetsButtonProps> = ({ files, setFiles }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePress = () => {
    Keyboard.dismiss()
    haptic(ImpactFeedbackStyle.Light)
    bottomSheetModalRef.current?.present()
  }

  return (
    <>
      <Button circular chromeless size={20} icon={<AssetsIcon size={20} />} onPress={handlePress} />

      <FileSheet ref={bottomSheetModalRef} files={files} setFiles={setFiles} />
    </>
  )
}
