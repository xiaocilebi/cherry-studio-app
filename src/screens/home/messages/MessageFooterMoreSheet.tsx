import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { Trash2 } from '@tamagui/lucide-icons'
import React, { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, useTheme, YStack } from 'tamagui'

import { TranslatedIcon, TranslationIcon } from '@/components/icons/TranslationIcon'
import { useTheme as useCustomTheme } from '@/hooks/useTheme'
import { loggerService } from '@/services/LoggerService'
import { deleteMessageById, fetchTranslateThunk } from '@/services/MessagesService'
import { Message } from '@/types/message'
import { findTranslationBlocks } from '@/utils/messageUtils/find'

import { removeManyBlocks } from '../../../../db/queries/messageBlocks.queries'
import { upsertMessages } from '../../../../db/queries/messages.queries'

const logger = loggerService.withContext('MessageFooterMore')

interface MessageFooterMoreProps {
  message: Message
}

const MessageFooterMoreSheet = forwardRef<BottomSheetModal, MessageFooterMoreProps>(({ message }, ref) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { isDark } = useCustomTheme()
  const [isTranslating, setIsTranslating] = useState(false)
  const [isTranslated, setIsTranslated] = useState(false)

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
  )

  useEffect(() => {
    const checkTranslation = async () => {
      if (!message) return

      try {
        const translationBlocks = await findTranslationBlocks(message)
        setIsTranslated(translationBlocks.length > 0)
      } catch (error) {
        logger.error('Error checking translation:', error)
        setIsTranslated(false)
      }
    }

    checkTranslation()
  }, [message])

  const onTranslate = async () => {
    if (!message) return

    try {
      if (isTranslating) return
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss() // close sheet
      setIsTranslating(true)
      const messageId = message.id
      await fetchTranslateThunk(messageId, message)
      setIsTranslated(true) // 翻译成功后更新状态
    } catch (error) {
      logger.error('Error during translation:', error)
      // 可以添加 toast 提示用户翻译失败
    } finally {
      setIsTranslating(false)
    }
  }

  const onDeleteTranslation = async () => {
    if (!message) return

    try {
      // 1. 删除 translation block
      const translationBlocks = await findTranslationBlocks(message)
      await removeManyBlocks(translationBlocks.map(block => block.id))

      // 2. 删除 message 中的 translation block id
      const updatedMessage = {
        ...message,
        blocks: message.blocks.filter(blockId => !translationBlocks.some(block => block.id === blockId))
      }
      await upsertMessages(updatedMessage)
      setIsTranslated(false) // 删除成功后更新状态
    } catch (error) {
      logger.error('Error deleting translation:', error)
      throw error
    } finally {
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    }
  }

  const onDelete = async () => {
    if (!message) return

    try {
      await deleteMessageById(message.id)

      if (message.askId) {
        await deleteMessageById(message.askId)
      }

      logger.info('Message deleted successfully:', message.id)
    } catch (error) {
      logger.error('Error deleting message:', error)
      throw error
    } finally {
      ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
    }
  }

  return (
    <BottomSheetModal
      snapPoints={['20%']}
      ref={ref}
      enableDynamicSizing={false}
      backgroundStyle={{
        borderRadius: 30,
        backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff'
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.color.val
      }}
      backdropComponent={renderBackdrop}>
      <BottomSheetView>
        <YStack alignItems="center" paddingTop={10} paddingBottom={30} paddingHorizontal={20} gap={10}>
          <YStack width="100%" gap={10}>
            <Button
              onPress={isTranslated ? onDeleteTranslation : onTranslate}
              icon={isTranslated ? <TranslatedIcon size={18} /> : <TranslationIcon size={18} />}
              justifyContent="flex-start">
              {isTranslated ? t('message.delete_translation') : t('message.translate_message')}
            </Button>
            <Button onPress={onDelete} icon={<Trash2 size={18} />} color="red" justifyContent="flex-start">
              {t('message.delete_message')}
            </Button>
          </YStack>
        </YStack>
      </BottomSheetView>
    </BottomSheetModal>
  )
})

MessageFooterMoreSheet.displayName = 'MessageFooterMoreSheet'

export default MessageFooterMoreSheet
