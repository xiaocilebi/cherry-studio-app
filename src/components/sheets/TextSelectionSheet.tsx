import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { X } from '@tamagui/lucide-icons'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, Platform, TouchableOpacity } from 'react-native'
import { Text, TextArea, XStack, YStack } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'

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
      <TextArea
        unstyled={true}
        color="$textPrimary"
        multiline
        editable={false}
        fontSize={15}
        lineHeight={24}
        scrollEnabled={false}>
        {children}
      </TextArea>
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
  const { isDark } = useTheme()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const [isVisible, setIsVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetModalRef.current?.present(),
    dismiss: () => bottomSheetModalRef.current?.dismiss()
  }))

  useEffect(() => {
    if (!isVisible) return

    const backAction = () => {
      bottomSheetModalRef.current?.dismiss()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [isVisible])

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={['90%']}
      enableDynamicSizing={false}
      backgroundStyle={{
        borderRadius: 24,
        backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? '#f9f9f9ff' : '#202020ff'
      }}
      backdropComponent={renderBackdrop}
      onDismiss={() => setIsVisible(false)}
      onChange={index => setIsVisible(index >= 0)}>
      <YStack flex={1}>
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={16}
          paddingBottom={16}
          borderBottomWidth={1}
          borderBottomColor="$borderColor">
          <Text fontSize={16} fontWeight="bold">
            {t('common.select_text')}
          </Text>
          <TouchableOpacity
            style={{
              padding: 4,
              backgroundColor: isDark ? '#333333' : '#dddddd',
              borderRadius: 16
            }}
            onPress={() => bottomSheetModalRef.current?.dismiss()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <X size={16} />
          </TouchableOpacity>
        </XStack>
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 40,
            paddingTop: 10
          }}>
          <SelectableText>{content}</SelectableText>
        </BottomSheetScrollView>
      </YStack>
    </BottomSheetModal>
  )
})

TextSelectionSheet.displayName = 'TextSelectionSheet'

export default TextSelectionSheet
