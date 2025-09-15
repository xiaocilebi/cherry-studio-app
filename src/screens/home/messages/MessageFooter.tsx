import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { AudioLines, CirclePause, Copy, MoreHorizontal, RefreshCw, ThumbsUp, Trash2 } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View, XStack } from 'tamagui'

import { TranslatedIcon, TranslationIcon } from '@/components/icons/TranslationIcon'
import { IconButton } from '@/components/ui/IconButton'
import SelectionSheet from '@/components/ui/SelectionSheet'
import { useMessageActions } from '@/hooks/useMessageActions'
import { Assistant } from '@/types/assistant'
import { Message } from '@/types/message'
import { haptic } from '@/utils/haptic'

interface MessageFooterProps {
  assistant: Assistant
  message: Message
  isMultiModel?: boolean
}

const MessageFooter = ({ message, assistant, isMultiModel = false }: MessageFooterProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const {
    isTranslated,
    playState,
    handleCopy,
    handleRegenerate,
    handlePlay,
    handleBestAnswer,
    handleDeleteTranslation,
    handleTranslate,
    handleDelete
  } = useMessageActions({
    message,
    assistant
  })

  const { t } = useTranslation()

  const moreItems = [
    {
      id: 'translate',
      label: isTranslated ? t('common.delete_translation') : t('message.translate_message'),
      icon: isTranslated ? (
        <TranslatedIcon size={18} color={isTranslated ? 'red' : '$textPrimary'} />
      ) : (
        <TranslationIcon size={18} color="$textPrimary" />
      ),
      color: isTranslated ? '$red100' : undefined,
      backgroundColor: isTranslated ? '$red20' : undefined,
      onSelect: isTranslated ? handleDeleteTranslation : handleTranslate
    },
    {
      id: 'delete',
      label: t('message.delete_message'),
      icon: <Trash2 size={18} color="$red100" />,
      color: '$red100',
      backgroundColor: '$red20',
      onSelect: handleDelete
    }
  ]

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

      <SelectionSheet ref={bottomSheetModalRef} items={moreItems} />
    </View>
  )
}

export default MessageFooter
