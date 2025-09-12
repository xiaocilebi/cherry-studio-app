import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { Trash2 } from '@tamagui/lucide-icons'
import React, { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, TouchableOpacity } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'

import { TranslatedIcon, TranslationIcon } from '@/components/icons/TranslationIcon'
import { useMessageActions } from '@/hooks/useMessageActions'
import { useTheme } from '@/hooks/useTheme'
import { Message } from '@/types/message'
import SelectionList from '@/components/ui/SelectionList'

interface MessageFooterMoreProps {
  message: Message
}

const MessageFooterMoreSheet = forwardRef<BottomSheetModal, MessageFooterMoreProps>(({ message }, ref) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { isTranslated, handleTranslate, handleDeleteTranslation, handleDelete } = useMessageActions({ message })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const backAction = () => {
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => backHandler.remove()
  }, [ref, isVisible])

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )

  const onTranslate = async () => {
    ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    await handleTranslate()
  }

  const onDeleteTranslation = async () => {
    await handleDeleteTranslation()
    ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
  }

  const onDelete = async () => {
    ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    await handleDelete()
  }

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing={true}
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
      <BottomSheetView>
        <SelectionList
          items={[
            {
              id: 'translate',
              label: t('message.translate_message'),
              icon: <TranslationIcon size={18} />,
              onSelect: onTranslate
            },
            {
              id: 'delete',
              label: t('message.delete_message'),
              icon: <Trash2 size={18} color="$red100" />,
              color: '$red100',
              backgroundColor: '$red20',
              onSelect: onDelete
            }
          ]}
        />
      </BottomSheetView>
    </BottomSheetModal>
  )
})

MessageFooterMoreSheet.displayName = 'MessageFooterMoreSheet'

export default MessageFooterMoreSheet
