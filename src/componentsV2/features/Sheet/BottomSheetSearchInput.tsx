import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import React from 'react'
import { StyleSheet } from 'react-native'

import { Search } from '@/componentsV2/icons/LucideIcon'
import { useTheme } from '@/hooks/useTheme'
import XStack from '@/componentsV2/layout/XStack'
import YStack from '@/componentsV2/layout/YStack'

interface BottomSheetSearchInputProps {
  placeholder?: string
  onChangeText?: (text: string) => void
  value?: string
}

export const BottomSheetSearchInput = ({ placeholder, onChangeText, value }: BottomSheetSearchInputProps) => {
  const { isDark } = useTheme()

  return (
    <XStack className="h-10 rounded-lg gap-2 items-center w-full relative">
      <BottomSheetTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[
          styles.input,
          {
            borderColor: isDark ? '#acf3a633' : '#8de59e4d',
            color: isDark ? '#acf3a6ff' : '#81df94ff'
          }
        ]}
        placeholderTextColor={isDark ? '#acf3a6ff' : '#81df94ff'}
      />
      <YStack className="absolute left-4 top-[13px] h-5 w-5 items-center justify-center z-10">
        <Search size={20} className="text-green-100 dark:text-green-dark-100" />
      </YStack>
    </XStack>
  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 44,
    borderRadius: 24,
    paddingLeft: 42,
    paddingRight: 16,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 16,
    lineHeight: 16,
    width: '100%',
    borderWidth: 1
  }
})
