import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { AudioLines, CirclePause, Copy, MoreHorizontal, RefreshCw, ThumbsUp } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { View, XStack } from 'tamagui'

import { IconButton } from '@/components/ui/IconButton'
import { useMessageActions } from '@/hooks/useMessageActions'
import { Assistant } from '@/types/assistant'
import { Message } from '@/types/message'
import { haptic } from '@/utils/haptic'

import MessageFooterMoreSheet from './MessageFooterMoreSheet'

interface MessageFooterProps {
  assistant: Assistant
  message: Message
  isMultiModel?: boolean
}

const MessageFooter = ({ message, assistant, isMultiModel = false }: MessageFooterProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const { playState, handleCopy, handleRegenerate, handlePlay, handleBestAnswer } = useMessageActions({
    message,
    assistant
  })

  const getAudioIcon = () => {
    switch (playState) {
      case 'playing':
        return <CirclePause size={18} color="$textSecondary" />
      default:
        return <AudioLines size={18} color="$textSecondary" />
    }
  }

  return (
    <View paddingHorizontal={20} paddingBottom={14}>
      <XStack gap={20}>
        <IconButton icon={<Copy size={18} color="$textSecondary" />} onPress={handleCopy} />
        <IconButton icon={<RefreshCw size={18} color="$textSecondary" />} onPress={handleRegenerate} />
        <IconButton icon={getAudioIcon()} onPress={handlePlay} />
        {message.role === 'assistant' && isMultiModel && (
          <IconButton
            icon={
              message.useful ? <ThumbsUp size={18} color="$green100" /> : <ThumbsUp size={18} color="$textSecondary" />
            }
            onPress={handleBestAnswer}
          />
        )}
        <IconButton
          icon={<MoreHorizontal size={18} color="$textSecondary" />}
          onPress={() => {
            haptic(ImpactFeedbackStyle.Medium)
            bottomSheetModalRef.current?.present()
          }}
        />
      </XStack>
      <MessageFooterMoreSheet ref={bottomSheetModalRef} message={message} />
    </View>
  )
}

export default MessageFooter
