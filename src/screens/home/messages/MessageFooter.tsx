import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { AudioLines, CirclePause, Copy, MoreHorizontal, RefreshCw } from '@tamagui/lucide-icons'
import * as Clipboard from 'expo-clipboard'
import * as Speech from 'expo-speech'
import React, { useRef, useState } from 'react'
import { Button, View, XStack } from 'tamagui'

import { loggerService } from '@/services/LoggerService'
import { regenerateAssistantMessage } from '@/services/MessagesService'
import { useAppDispatch } from '@/store'
import { Assistant } from '@/types/assistant'
import { Message } from '@/types/message'
import { filterMessages } from '@/utils/messageUtils/filters'
import { getMainTextContent } from '@/utils/messageUtils/find'

import MessageFooterMoreSheet from './MessageFooterMoreSheet'

const logger = loggerService.withContext('MessageFooter')

interface MessageFooterProps {
  assistant: Assistant
  message: Message
}

type PlayState = 'idle' | 'playing'

const MessageFooter = ({ message, assistant }: MessageFooterProps) => {
  const dispatch = useAppDispatch()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const [playState, setPlayState] = useState<PlayState>('idle')

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
      await regenerateAssistantMessage(message, assistant, dispatch)
    } catch (error) {
      logger.error('Error regenerating message:', error)
      // 可以添加 toast 提示用户重新生成失败
    }
  }

  const onPlay = async () => {
    try {
      if (playState === 'idle') {
        const filteredMessages = await filterMessages([message])
        const mainContent = await getMainTextContent(filteredMessages[0])
        Speech.speak(mainContent, { onDone: () => setPlayState('idle') })
        setPlayState('playing')
      } else if (playState === 'playing') {
        Speech.stop()
        setPlayState('idle')
      }
    } catch (error) {
      logger.error('Error controlling audio:', error)
      setPlayState('idle')
      // 可以添加 toast 提示用户操作失败
    }
  }

  const getAudioIcon = () => {
    switch (playState) {
      case 'playing':
        return <CirclePause size={18} />
      default:
        return <AudioLines size={18} />
    }
  }

  return (
    <View>
      <XStack gap={20}>
        <Button chromeless circular size={24} icon={<Copy size={18} />} onPress={onCopy}></Button>
        <Button chromeless circular size={24} icon={<RefreshCw size={18} />} onPress={onRegenerate}></Button>
        <Button chromeless circular size={24} icon={getAudioIcon()} onPress={onPlay}></Button>
        <Button
          chromeless
          circular
          size={24}
          icon={<MoreHorizontal size={18} />}
          onPress={() => {
            bottomSheetModalRef.current?.present()
          }}></Button>
      </XStack>
      <MessageFooterMoreSheet ref={bottomSheetModalRef} message={message} />
    </View>
  )
}

export default MessageFooter
