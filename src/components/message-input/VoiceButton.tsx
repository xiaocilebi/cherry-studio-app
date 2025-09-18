import React from 'react'
import { Button } from 'tamagui'

import { VoiceIcon } from '@/componentsV2/icons'

export const VoiceButton: React.FC = () => {
  return <Button chromeless circular size={20} icon={<VoiceIcon size={20} />} />
}
