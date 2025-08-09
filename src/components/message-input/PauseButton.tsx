import { CirclePause } from '@tamagui/lucide-icons'
import React from 'react'
import { Button } from 'tamagui'

interface PauseButtonProps {
  onPause: () => void
}

export const PauseButton: React.FC<PauseButtonProps> = ({ onPause }) => {
  return <Button circular chromeless size={20} icon={<CirclePause size={20} color="$textDelete" />} onPress={onPause} />
}
