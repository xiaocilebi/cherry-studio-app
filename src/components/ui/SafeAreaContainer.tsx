import React from 'react'
import { View, ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'tamagui'

import { useIsDark } from '@/utils'

interface SafeAreaContainerProps extends ViewProps {
  children: React.ReactNode
}

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({ children, style, ...rest }) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const isDark = useIsDark()

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
          backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
        },
        style
      ]}
      {...rest}>
      {children}
    </View>
  )
}

export default SafeAreaContainer
