import React from 'react'
import { Image } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'
import { Provider } from '@/types/assistant'
import { getProviderIcon } from '@/utils/icons/'

interface ProviderIconProps {
  provider: Provider
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider }) => {
  const { isDark } = useTheme()

  const iconSource = getProviderIcon(provider.id, isDark)

  return <Image width={20} height={20} source={iconSource} />
}
