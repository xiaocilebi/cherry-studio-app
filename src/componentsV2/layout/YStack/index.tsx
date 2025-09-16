import React, { forwardRef } from 'react'
import { View, ViewProps, Animated } from 'react-native'
import { cn } from '../../utils'

export interface YStackProps extends ViewProps {
  className?: string
}

const YStack = forwardRef<View, YStackProps>(({ className = '', ...rest }, ref) => {
  const composed = cn('flex-col', className)

  return <View ref={ref} className={composed} {...rest} />
})

YStack.displayName = 'YStack'

export const AnimatedYStack = Animated.createAnimatedComponent(YStack)

export default YStack
