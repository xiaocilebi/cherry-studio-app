import React from 'react'
import { useColorScheme } from 'react-native'
import { Image } from 'tamagui'

import { Model } from '@/types/assistant'
import { getModelOrProviderIcon } from '@/utils/icons'

interface ModelIconProps {
  model: Model
  size?: number
}

export const ModelIcon: React.FC<ModelIconProps> = ({ model, size }) => {
  const theme = useColorScheme()
  const isDark = theme === 'dark'

  const iconSource = getModelOrProviderIcon(model.id, model.provider, isDark)

  return <Image width={size ?? 20} height={size ?? 20} source={iconSource} />
}
