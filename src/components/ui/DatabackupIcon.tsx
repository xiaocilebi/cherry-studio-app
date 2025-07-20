import React from 'react'
import { useColorScheme } from 'react-native'
import { Image } from 'tamagui'

import { getDataBackupIcon } from '@/utils/icons/dataBackup'

interface DataBackupIconProps {
  provider: string
}

export const DataBackupIcon: React.FC<DataBackupIconProps> = ({ provider }) => {
  const theme = useColorScheme()
  const isDark = theme === 'dark'

  const iconSource = getDataBackupIcon(provider, isDark)

  return <Image width={20} height={20} source={iconSource} />
}
