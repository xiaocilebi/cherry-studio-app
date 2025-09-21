import React from 'react'

import { useTheme } from '@/hooks/useTheme'
import { WebSearchProvider } from '@/types/websearch'
import { getWebSearchProviderIcon } from '@/utils/icons/websearch'
import Image from '@/componentsV2/base/Image'

interface WebsearchProviderIconProps {
  provider: WebSearchProvider
}

export const WebsearchProviderIcon: React.FC<WebsearchProviderIconProps> = ({ provider }) => {
  const { isDark } = useTheme()

  const iconSource = getWebSearchProviderIcon(provider.id, isDark)

  return <Image className="w-5 h-5" source={iconSource} />
}
