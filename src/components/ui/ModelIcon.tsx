import React from 'react'
import { useColorScheme } from 'react-native'
import { Image } from 'tamagui'

import { Model } from '@/types/assistant'
import { getModelOrProviderIcon } from '@/utils/icons'

interface ModelIconProps {
  model: Model
}

export const ModelIcon: React.FC<ModelIconProps> = ({ model }) => {
  const theme = useColorScheme()
  const isDark = theme === 'dark'

  const iconSource = getModelOrProviderIcon(model.id, model.provider, isDark)

  return <Image width={20} height={20} source={iconSource} />
}
