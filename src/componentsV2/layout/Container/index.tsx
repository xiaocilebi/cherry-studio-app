import React from 'react'
import { ViewProps, Keyboard } from 'react-native'
import YStack from '../YStack'

export interface ContainerProps extends ViewProps {
  className?: string
}

const Container: React.FC<ContainerProps> = ({ className, children, ...props }) => {
  return (
    <YStack
      className={`flex-1 p-4 gap-5 bg-transparent overflow-hidden ${className || ''}`}
      onStartShouldSetResponder={() => true}
      onResponderRelease={Keyboard.dismiss}
      {...props}>
      {children}
    </YStack>
  )
}

export default Container
