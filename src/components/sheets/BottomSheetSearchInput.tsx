import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { Search } from '@tamagui/lucide-icons'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Stack, XStack } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'

interface BottomSheetSearchInputProps {
  placeholder?: string
  onChangeText?: (text: string) => void
  value?: string
}

export const BottomSheetSearchInput = ({ placeholder, onChangeText, value }: BottomSheetSearchInputProps) => {
  const { isDark } = useTheme()
  return (
    <XStack height={48} gap={8} alignItems="center" width="100%" position="relative">
      <BottomSheetTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[
          styles.input,
          { borderColor: isDark ? '#acf3a633' : '#8de59e4d', color: isDark ? '#acf3a6ff' : '#81df94ff' }
        ]}
        placeholderTextColor={isDark ? '#acf3a6ff' : '#81df94ff'}
      />
      <Stack
        position="absolute"
        left={16}
        top={13}
        height={20}
        width={20}
        alignItems="center"
        justifyContent="center"
        zIndex={1}>
        <Search size={20} color="$green100" />
      </Stack>
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
