import * as NavigationBar from 'expo-navigation-bar'
import * as StatusBar from 'expo-status-bar'
import React, { useEffect } from 'react'
import { Platform, View, ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useIsDark } from '@/utils'

interface SafeAreaContainerProps extends ViewProps {
  children: React.ReactNode
}

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({ children, style, ...rest }) => {
  const insets = useSafeAreaInsets()
  const isDark = useIsDark()
  const backgroundColor = isDark ? '#121213ff' : '#f7f7f7ff'

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Set the navigation bar style
      NavigationBar.setBackgroundColorAsync(backgroundColor)
      StatusBar.setStatusBarBackgroundColor(backgroundColor)
    }
  }, [backgroundColor])

  return (
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
  )
}

export default SafeAreaContainer
