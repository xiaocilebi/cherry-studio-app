import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TranslatedIcon, TranslationIcon } from '@/componentsV2/icons'
import { IconButton, XStack, SelectionSheet } from '@/componentsV2'
import {
  AudioLines,
  CirclePause,
  Copy,
  MoreHorizontal,
  RefreshCw,
  ThumbsUp,
  Trash2
} from '@/componentsV2/icons/LucideIcon'
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
        <TranslatedIcon size={18} color={isTranslated ? 'red' : undefined} />
      ) : (
        <TranslationIcon size={18} />
      ),
      color: isTranslated ? 'text-red-100 dark:text-red-100' : undefined,
      backgroundColor: isTranslated ? 'bg-red-20 dark:bg-red-20' : undefined,
      onSelect: isTranslated ? handleDeleteTranslation : handleTranslate
    },
    {
      id: 'delete',
      label: t('message.delete_message'),
      icon: <Trash2 size={18} className="text-red-100 dark:text-red-100" />,
      color: 'text-red-100 dark:text-red-100',
      backgroundColor: 'bg-red-20 dark:bg-red-20',
      onSelect: handleDelete
    }
  ]

  const getAudioIcon = () => {
    switch (playState) {
      case 'playing':
        return <CirclePause size={18} className="text-text-secondary dark:text-text-secondary-dark " />
      default:
        return <AudioLines size={18} className="text-text-secondary dark:text-text-secondary-dark" />
    }
  }

  return (
    <View className="px-5 pb-3.5">
      <XStack className="gap-5">
        <IconButton
          icon={<Copy size={18} className="text-text-secondary dark:text-text-secondary-dark" />}
          onPress={handleCopy}
        />
        <IconButton
          icon={<RefreshCw size={18} className="text-text-secondary dark:text-text-secondary-dark" />}
          onPress={handleRegenerate}
        />
        <IconButton icon={getAudioIcon()} onPress={handlePlay} />
        {message.role === 'assistant' && isMultiModel && (
          <IconButton
            icon={
              message.useful ? (
                <ThumbsUp size={18} className="text-green-600" />
              ) : (
                <ThumbsUp size={18} className="text-text-secondary dark:text-text-secondary-dark" />
              )
            }
            onPress={handleBestAnswer}
          />
        )}
        <IconButton
          icon={<MoreHorizontal size={18} className="text-text-secondary dark:text-text-secondary-dark" />}
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
