import React from 'react'
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'

interface IconButtonProps {
  onPress?: () => void
  icon: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export const IconButton = ({ onPress, icon, style }: IconButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={10} style={style}>
      {icon}
    </TouchableOpacity>
  )
}
