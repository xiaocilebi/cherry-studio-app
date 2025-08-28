import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { Search } from '@tamagui/lucide-icons'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Stack, useTheme, XStack } from 'tamagui'

interface BottomSheetSearchInputProps {
  placeholder?: string
  onChangeText?: (text: string) => void
  value?: string
}

export const BottomSheetSearchInput = ({ placeholder, onChangeText, value }: BottomSheetSearchInputProps) => {
  const theme = useTheme()

  return (
    <XStack alignItems="center" width="100%" position="relative">
      <Stack position="absolute" left={16} zIndex={1}>
        <Search size={20} color="$gray10" />
      </Stack>
      <BottomSheetTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.gray10.val}
        style={[
          styles.input,
          {
            backgroundColor: theme.gray5.val,
            color: theme.color.val
          }
        ]}
        clearButtonMode="always"
      />
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
    fontSize: 16
  }
})
