import BottomSheet from '@gorhom/bottom-sheet'
import { Copy, MoreHorizontal, RefreshCw } from '@tamagui/lucide-icons'
import * as Clipboard from 'expo-clipboard'
import React from 'react'
import { Button, View, XStack } from 'tamagui'

import { loggerService } from '@/services/LoggerService'
import { regenerateAssistantMessage } from '@/services/MessagesService'
import { Assistant } from '@/types/assistant'
import { Message } from '@/types/message'
import { filterMessages } from '@/utils/messageUtils/filters'
import { getMainTextContent } from '@/utils/messageUtils/find'

const logger = loggerService.withContext('MessageFooter')

interface MessageFooterProps {
  assistant: Assistant
  message: Message
  bottomSheetRef: React.RefObject<BottomSheet | null>
  setSelectedMessage: React.Dispatch<React.SetStateAction<Message | null>>
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MessageFooter = ({
  message,
  assistant,
  bottomSheetRef,
  setIsBottomSheetOpen,
  setSelectedMessage
}: MessageFooterProps) => {
  const handleBottomSheetOpen = () => {
    if (setSelectedMessage) {
      setSelectedMessage(message)
    }

    bottomSheetRef.current?.expand()
    setIsBottomSheetOpen(true)
  }

  const onCopy = async () => {
    // todo: 暂时无法复制翻译后的message
    try {
      const filteredMessages = await filterMessages([message])
      logger.info('Filtered Messages:', filteredMessages)
      const mainContent = await getMainTextContent(filteredMessages[0])
      await Clipboard.setStringAsync(mainContent)
    } catch (error) {
      logger.error('Error copying message:', error)
      // 可以添加 toast 提示用户复制失败
    }
  }

  const onRegenerate = async () => {
    try {
      await regenerateAssistantMessage(message, assistant)
    } catch (error) {
      logger.error('Error regenerating message:', error)
      // 可以添加 toast 提示用户重新生成失败
    }
  }

  return (
    <View>
      <XStack gap={20}>
        <Button chromeless circular size={24} icon={<Copy size={18} />} onPress={onCopy}></Button>
        <Button chromeless circular size={24} icon={<RefreshCw size={18} />} onPress={onRegenerate}></Button>
        <Button
          chromeless
          circular
          size={24}
          icon={<MoreHorizontal size={18} />}
          onPress={handleBottomSheetOpen}></Button>
      </XStack>
    </View>
  )
}

export default MessageFooter
