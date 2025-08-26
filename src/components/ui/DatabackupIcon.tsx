import React from 'react'
import { Image } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'
import { getDataBackupIcon } from '@/utils/icons/dataBackup'

interface DataBackupIconProps {
  provider: string
}

export const DataBackupIcon: React.FC<DataBackupIconProps> = ({ provider }) => {
  const { isDark } = useTheme()

  const iconSource = getDataBackupIcon(provider, isDark)

  return <Image width={20} height={20} source={iconSource} />
}
