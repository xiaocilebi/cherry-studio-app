import { X } from '@tamagui/lucide-icons'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Platform, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'

interface TextSelectionSheetProps {
  content: string
}

export interface TextSelectionSheetRef {
  present: () => void
  dismiss: () => void
}

// TODO: 自定义选择后弹出的菜单
function SelectableText({ children }) {
  if (Platform.OS === 'ios') {
    return (
      <TextInput multiline editable={false} style={{ fontSize: 15, lineHeight: 24 }} scrollEnabled={false}>
        {children}
      </TextInput>
    )
  } else {
    return (
      <Text userSelect="all" fontSize={15} lineHeight={24}>
        {children}
      </Text>
    )
  }
}
const TextSelectionSheet = forwardRef<TextSelectionSheetRef, TextSelectionSheetProps>(({ content }, ref) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    present: () => setVisible(true),
    dismiss: () => setVisible(false)
  }))

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setVisible(false)}>
      <YStack flex={1}>
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={16}
          paddingVertical={16}
          borderBottomWidth={0.5}
          borderBottomColor="$borderColor">
          <Text fontSize={16} fontWeight="bold">
            {t('common.select_text')}
          </Text>
          <TouchableOpacity onPress={() => setVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <X size={20} />
          </TouchableOpacity>
        </XStack>
        <ScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 20, paddingBottom: 30 }}>
          <SelectableText>{content}</SelectableText>
        </ScrollView>
      </YStack>
    </Modal>
  )
})

TextSelectionSheet.displayName = 'TextSelectionSheet'

export default TextSelectionSheet
