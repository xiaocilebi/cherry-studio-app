import { MotiText, MotiView } from 'moti'
import React from 'react'

import { Search } from '@/componentsV2/icons'

interface SearchingProps {
  text: React.ReactNode
}

export default function Searching({ text }: SearchingProps) {
  return (
    <MotiView
      className="flex-row items-center gap-1 text-sm p-2.5 pl-0"
      from={{
        opacity: 0.3
      }}
      animate={{
        opacity: 1
      }}
      transition={{
        type: 'timing',
        duration: 1000,
        loop: true,
        repeatReverse: true
      }}>
      <Search size={16} className="text-text-primary dark:text-text-primary-dark" />
      <MotiText className="text-text-primary dark:text-text-primary-dark text-sm">{text}</MotiText>
    </MotiView>
  )
}
