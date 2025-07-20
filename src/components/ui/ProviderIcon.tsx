import React from 'react'
import { useColorScheme } from 'react-native'
import { Image } from 'tamagui'

import { Provider } from '@/types/assistant'
import { getProviderIcon } from '@/utils/icons/'

interface ProviderIconProps {
  provider: Provider
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider }) => {
  const theme = useColorScheme()
  const isDark = theme === 'dark'

  const iconSource = getProviderIcon(provider.id, isDark)

  return <Image width={20} height={20} source={iconSource} />
}
