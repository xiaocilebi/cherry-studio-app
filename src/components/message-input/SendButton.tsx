import { ArrowUp } from '@tamagui/lucide-icons'
import React from 'react'

import { IconButton } from '@/componentsV2'

interface SendButtonProps {
  onSend: () => void
  disabled?: boolean
}

export const SendButton: React.FC<SendButtonProps> = ({ onSend, disabled = false }) => {
  return (
    <IconButton
      icon={<ArrowUp size={24} color={disabled ? '#eeeeee' : '#ffffff'} />}
      onPress={disabled ? undefined : onSend}
      style={{
        borderRadius: 99,
        padding: 3,
        backgroundColor: disabled ? '#cccccc' : '#81df94'
      }}
      disabled={disabled}
    />
  )
}
