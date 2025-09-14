import { CircleArrowUp } from '@tamagui/lucide-icons'
import React from 'react'

import { IconButton } from '../ui/IconButton'

interface SendButtonProps {
  onSend: () => void
  disabled?: boolean
}

export const SendButton: React.FC<SendButtonProps> = ({ onSend, disabled = false }) => {
  return (
    <IconButton
      icon={<CircleArrowUp size={20} color={disabled ? '#999' : undefined} />}
      onPress={disabled ? undefined : onSend}
      disabled={disabled}
    />
  )
}
