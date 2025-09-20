import { DrawerNavigationProp } from '@react-navigation/drawer'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { PropsWithChildren } from 'react'
import { PanGestureHandler, State } from 'react-native-gesture-handler'

import { haptic } from '@/utils/haptic'

interface DrawerGestureWrapperProps extends PropsWithChildren {
  enabled?: boolean
}

/**
 * Common wrapper component for handling drawer opening gesture
 * Swipe right from anywhere on the screen to open the drawer
 */
export const DrawerGestureWrapper = ({ children, enabled = true }: DrawerGestureWrapperProps) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>()

  const handleSwipeGesture = (event: any) => {
    if (!enabled) return

    const { translationX, velocityX, state } = event.nativeEvent

    // Detect right swipe gesture
    if (state === State.END) {
      // Full screen swipe trigger: distance > 20 and velocity > 100, or distance > 80
      const hasGoodDistance = translationX > 20
      const hasGoodVelocity = velocityX > 100
      const hasExcellentDistance = translationX > 80

      if ((hasGoodDistance && hasGoodVelocity) || hasExcellentDistance) {
        haptic(ImpactFeedbackStyle.Medium)
        navigation.dispatch(DrawerActions.openDrawer())
      }
    }
  }

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <PanGestureHandler
      onGestureEvent={handleSwipeGesture}
      onHandlerStateChange={handleSwipeGesture}
      activeOffsetX={[-10, 10]}
      failOffsetY={[-20, 20]}>
      {children}
    </PanGestureHandler>
  )
}
