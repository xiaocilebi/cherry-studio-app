import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { AtSign } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { Keyboard } from 'react-native'
import { Button } from 'tamagui'

import { Model } from '@/types/assistant'
import { useIsDark } from '@/utils'
import { getGreenColor } from '@/utils/color'
import { haptic } from '@/utils/haptic'

import ModelSheet from '../sheets/ModelSheet'

interface MentionButtonProps {
  mentions: Model[]
  setMentions: (mentions: Model[]) => void
}

export const MentionButton: React.FC<MentionButtonProps> = ({ mentions, setMentions }) => {
  const isDark = useIsDark()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePress = () => {
    Keyboard.dismiss()
    haptic(ImpactFeedbackStyle.Light)
    bottomSheetModalRef.current?.present()
  }

  return (
    <>
      <Button
        circular
        chromeless
        size={20}
        icon={<AtSign size={20} />}
        color={mentions.length > 0 ? getGreenColor(isDark, 100) : undefined}
        onPress={handlePress}
      />

      <ModelSheet ref={bottomSheetModalRef} mentions={mentions} setMentions={setMentions} multiple={true} />
    </>
  )
}
