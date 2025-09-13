import { Send } from '@tamagui/lucide-icons'
import React from 'react'
import { TouchableOpacity } from 'react-native'

interface SendButtonProps {
  onSend: () => void
}

export const SendButton: React.FC<SendButtonProps> = ({ onSend }) => {
  return (
    <TouchableOpacity onPress={onSend}>
      <Send size={20} />
    </TouchableOpacity>
  )
}
