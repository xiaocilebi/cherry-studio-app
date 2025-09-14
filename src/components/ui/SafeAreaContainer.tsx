import { Theme, View, ViewProps } from '@tamagui/core'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useBottom } from '@/hooks/useBottom'
import { useTheme } from '@/hooks/useTheme'

interface SafeAreaContainerProps extends ViewProps {
  children: React.ReactNode
}

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({ children, style, ...rest }) => {
  const insets = useSafeAreaInsets()
  const { isDark } = useTheme()
  const backgroundColor = isDark ? '#121213ff' : '#f7f7f7ff'
  const specificBottom = useBottom()

  return (
    <Theme name={isDark ? 'dark' : 'light'}>
      <View
        style={[
          {
            paddingTop: insets.top,
            paddingBottom: specificBottom,
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
