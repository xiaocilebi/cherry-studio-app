import BottomSheet from '@gorhom/bottom-sheet'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, YStack } from 'tamagui'

import { TranslatedIcon, TranslationIcon } from '@/components/icons/TranslationIcon'
import { ISheet } from '@/components/ui/Sheet'
import { fetchTranslate } from '@/services/ApiService'
import { loggerService } from '@/services/LoggerService'
import { Message } from '@/types/message'
import { findTranslationBlocks } from '@/utils/messageUtils/find'

import { removeManyBlocks } from '../../../../db/queries/messageBlocks.queries'
import { upsertMessages } from '../../../../db/queries/messages.queries'

const logger = loggerService.withContext('MessageFooterMore')

interface MessageFooterMoreProps {
  message: Message
  bottomSheetRef: React.RefObject<BottomSheet | null>
  isOpen: boolean
  onClose: () => void
}

export function MessageFooterMore({ message, bottomSheetRef, isOpen, onClose }: MessageFooterMoreProps) {
  const { t } = useTranslation()
  const sheetSnapPoints = ['30%']
  const [isTranslating, setIsTranslating] = useState(false)
  const [isTranslated, setIsTranslated] = useState(false)

  useEffect(() => {
    const checkTranslation = async () => {
      try {
        const translationBlocks = await findTranslationBlocks(message)
        setIsTranslated(translationBlocks.length > 0)
      } catch (error) {
        logger.error('Error checking translation:', error)
        setIsTranslated(false)
      }
    }

    if (isOpen) {
      checkTranslation()
    }
  }, [isOpen, message])

  const onTranslate = async () => {
    try {
      if (isTranslating) return
      setIsTranslating(true)
      const messageId = message.id
      await fetchTranslate({ assistantMessageId: messageId, message: message })
      setIsTranslated(true) // 翻译成功后更新状态
      onClose()
    } catch (error) {
      logger.error('Error during translation:', error)
      // 可以添加 toast 提示用户翻译失败
    } finally {
      setIsTranslating(false)
    }
  }

  const onDeleteTranslation = async () => {
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
      onClose()
    } catch (error) {
      logger.error('Error deleting translation:', error)
      // 可以添加 toast 提示用户删除失败
    }
  }

  return (
    <ISheet bottomSheetRef={bottomSheetRef} isOpen={isOpen} onClose={onClose} snapPoints={sheetSnapPoints}>
      <YStack alignItems="center" paddingTop={10} paddingBottom={30} paddingHorizontal={20} gap={10}>
        <YStack width="100%" gap={10}>
          <Button
            onPress={isTranslated ? onDeleteTranslation : onTranslate}
            icon={isTranslated ? <TranslatedIcon size={18} /> : <TranslationIcon size={18} />}
            theme="gray"
            justifyContent="flex-start">
            {isTranslated ? t('删除翻译') : t('翻译消息')}
          </Button>
        </YStack>
      </YStack>
    </ISheet>
  )
}
