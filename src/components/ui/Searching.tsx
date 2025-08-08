import { Search } from '@tamagui/lucide-icons'
import { MotiText, MotiView } from 'moti'
import React from 'react'
import { StyleSheet } from 'react-native'

import { useIsDark } from '@/utils'
import { getTextPrimaryColor } from '@/utils/color'

interface Props {
  text: React.ReactNode
}

export default function Searching({ text }: Props) {
  const isDark = useIsDark()
  return (
    <MotiView
      style={styles.searchWrapper}
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
      <Search size={16} color={getTextPrimaryColor(isDark)} />
      <MotiText style={{ color: getTextPrimaryColor(isDark) }}>{text}</MotiText>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontSize: 14,
    padding: 10,
    paddingLeft: 0
  }
})
