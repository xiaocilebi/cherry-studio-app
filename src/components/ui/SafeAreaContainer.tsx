import { Theme, View, ViewProps } from '@tamagui/core'
import React from 'react'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@/hooks/useTheme'

interface SafeAreaContainerProps extends ViewProps {
  children: React.ReactNode
}

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({ children, style, ...rest }) => {
  const insets = useSafeAreaInsets()
  const { isDark } = useTheme()
  const backgroundColor = isDark ? '#121213ff' : '#f7f7f7ff'

  return (
    <Theme name={isDark ? 'dark' : 'light'}>
      <View
        style={[
          {
            paddingTop: insets.top,
            paddingBottom: Platform.OS === 'android' ? insets.bottom + 10 : insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            flex: 1,
            backgroundColor
          },
          style
        ]}
        {...rest}>
        {children}
      </View>
    </Theme>
  )
}

export default SafeAreaContainer
