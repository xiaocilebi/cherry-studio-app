import React from 'react'
import { TextProps } from 'react-native'
import Text from '../../base/Text'

export interface GroupTitleProps extends TextProps {
  className?: string
}

const GroupTitle: React.FC<GroupTitleProps> = ({ className, ...props }) => {
  return <Text className={`font-bold opacity-70 pl-3 ${className || ''}`} {...props} />
}

export default GroupTitle
