import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal, ScrollView, TouchableOpacity } from 'react-native'
import { X } from '@tamagui/lucide-icons'
import { useTheme as useCustomTheme } from '@/hooks/useTheme'
import { useTranslation } from 'react-i18next'
import { XStack, Text, YStack } from 'tamagui'

interface TextSelectionSheetProps {
  content: string
}

export interface TextSelectionSheetRef {
  present: () => void
  dismiss: () => void
}

const TextSelectionSheet = forwardRef<TextSelectionSheetRef, TextSelectionSheetProps>(({ content }, ref) => {
  const { isDark } = useCustomTheme()
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
      <YStack flex={1} backgroundColor="$uiCardBackground">
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
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {/* FIXME: 还是无法选择文字，待解决 */}
          <Text selectable={true} fontSize={15} lineHeight={24}>
            {content}
          </Text>
        </ScrollView>
      </YStack>
    </Modal>
  )
})

TextSelectionSheet.displayName = 'TextSelectionSheet'

export default TextSelectionSheet
