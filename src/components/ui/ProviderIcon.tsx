import { File, Paths } from 'expo-file-system/next'
import React from 'react'
import { Image } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'
import { fileStorageDir } from '@/services/FileService'
import { Provider } from '@/types/assistant'
import { getProviderIcon } from '@/utils/icons/'

interface ProviderIconProps {
  provider: Provider
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider }) => {
  const { isDark } = useTheme()

  const iconSource = provider.isSystem
    ? getProviderIcon(provider.id, isDark)
    : new File(Paths.join(fileStorageDir, `${provider.id}.png`)).uri

  return <Image width={20} height={20} source={{ uri: iconSource }} />
}
