import { Send } from '@tamagui/lucide-icons'
import React from 'react'
import { Button } from 'tamagui'

interface SendButtonProps {
  onSend: () => void
}

export const SendButton: React.FC<SendButtonProps> = ({ onSend }) => {
  return <Button circular chromeless size={20} icon={<Send size={20} />} onPress={onSend} />
}
