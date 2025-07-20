import React from 'react'
import { useColorScheme } from 'react-native'
import { Image } from 'tamagui'

import { WebSearchProvider } from '@/types/websearch'
import { getWebSearchProviderIcon } from '@/utils/icons/websearch'

interface WebsearchProviderIconProps {
  provider: WebSearchProvider
}

export const WebsearchProviderIcon: React.FC<WebsearchProviderIconProps> = ({ provider }) => {
  const theme = useColorScheme()
  const isDark = theme === 'dark'

  const iconSource = getWebSearchProviderIcon(provider.id, isDark)

  return <Image width={20} height={20} source={iconSource} />
}
