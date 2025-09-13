import { File, Paths } from 'expo-file-system/next'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

import { DEFAULT_ICONS_STORAGE } from '@/constants/storage'
import { useTheme } from '@/hooks/useTheme'
import { Provider } from '@/types/assistant'
import { getProviderIcon } from '@/utils/icons/'

interface ProviderIconProps {
  provider: Provider
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider }) => {
  const { isDark } = useTheme()
  const [iconUri, setIconUri] = useState<string>('')

  useEffect(() => {
    const loadIcon = async () => {
      if (provider.isSystem) {
        setIconUri(getProviderIcon(provider.id, isDark))
      } else {
        const file = new File(Paths.join(DEFAULT_ICONS_STORAGE, `${provider.id}.jpg`))

        if (file.exists) {
          setIconUri(file.uri)
        } else {
          setIconUri('')
        }
      }
    }

    loadIcon()
  }, [provider.id, provider.isSystem, isDark])

  if (!iconUri) {
    return <View style={{ width: 20, height: 20 }} />
  }

  return <Image style={{ borderRadius: 99, width: 20, height: 20 }} source={iconUri} />
}
