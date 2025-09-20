import { File, Paths } from 'expo-file-system/next'
import React, { useEffect, useState } from 'react'

import { DEFAULT_ICONS_STORAGE } from '@/constants/storage'
import { useTheme } from '@/hooks/useTheme'
import { Provider } from '@/types/assistant'
import { getProviderIcon } from '@/utils/icons/'
import Image from '@/componentsV2/base/Image'
import YStack from '@/componentsV2/layout/YStack'

interface ProviderIconProps {
  provider: Provider
  size?: number
  className?: string
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider, size, className }) => {
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

  const sizeClass = size ? `w-[${size}px] h-[${size}px]` : 'w-5 h-5'
  const finalClassName = className ? `${sizeClass} ${className}` : sizeClass

  if (!iconUri) {
    return (
      <YStack
        className={finalClassName}
        style={size ? { width: size, height: size } : undefined}
      />
    )
  }

  return (
    <Image
      className={`${finalClassName} rounded-full`}
      source={iconUri}
      style={size ? { width: size, height: size } : undefined}
    />
  )
}