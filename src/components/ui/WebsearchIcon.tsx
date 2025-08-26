import React from 'react'
import { Image } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'
import { WebSearchProvider } from '@/types/websearch'
import { getWebSearchProviderIcon } from '@/utils/icons/websearch'

interface WebsearchProviderIconProps {
  provider: WebSearchProvider
}

export const WebsearchProviderIcon: React.FC<WebsearchProviderIconProps> = ({ provider }) => {
  const { isDark } = useTheme()

  const iconSource = getWebSearchProviderIcon(provider.id, isDark)

  return <Image width={20} height={20} source={iconSource} />
}
