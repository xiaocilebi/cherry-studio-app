import React from 'react'
import { Image } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'
import { Model } from '@/types/assistant'
import { getModelOrProviderIcon } from '@/utils/icons'

interface ModelIconProps {
  model: Model
  size?: number
}

export const ModelIcon: React.FC<ModelIconProps> = ({ model, size }) => {
  const { isDark } = useTheme()

  const iconSource = getModelOrProviderIcon(model.id, model.provider, isDark)

  return <Image width={size ?? 20} height={size ?? 20} source={iconSource} />
}
