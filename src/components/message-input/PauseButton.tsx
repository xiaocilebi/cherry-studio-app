import { CirclePause } from '@tamagui/lucide-icons'
import React from 'react'

import { IconButton } from '@/componentsV2'

interface PauseButtonProps {
  onPause: () => void
}

export const PauseButton: React.FC<PauseButtonProps> = ({ onPause }) => {
  return <IconButton icon={<CirclePause size={24} color="$textDelete" />} onPress={onPause} />
}
