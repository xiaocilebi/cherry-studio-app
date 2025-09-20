import React from 'react'

import { ArrowUp } from '@/componentsV2/icons'
import { IconButton } from '@/componentsV2/base/IconButton'

interface SendButtonProps {
  onSend: () => void
  disabled?: boolean
}

export const SendButton: React.FC<SendButtonProps> = ({ onSend, disabled = false }) => {
  return (
    <IconButton
      icon={<ArrowUp className={`${disabled ? '#eeeeee' : '#ffffff'}`} size={24} />}
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
