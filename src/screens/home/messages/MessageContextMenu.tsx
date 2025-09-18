import { AudioLines, CirclePause, Copy, RefreshCw, TextSelect, ThumbsUp, Trash2 } from '@/componentsV2/icons/LucideIcon'
import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TranslatedIcon, TranslationIcon } from '@/componentsV2/icons'
import TextSelectionSheet, { TextSelectionSheetRef } from '@/components/sheets/TextSelectionSheet'
import ContextMenu, { ContextMenuListProps } from '@/components/ui/ContextMenu'
import { useMessageActions } from '@/hooks/useMessageActions'
import { Assistant } from '@/types/assistant'
import { Message } from '@/types/message'

interface MessageItemProps {
  children: React.ReactNode
  message: Message
  assistant?: Assistant
  isMultiModel?: boolean
}

const MessageContextMenu: FC<MessageItemProps> = ({ children, message, assistant, isMultiModel = false }) => {
  const { t } = useTranslation()
  const textSelectionSheetRef = useRef<TextSelectionSheetRef>(null)
  const [messageContent, setMessageContent] = useState('')

  const {
    playState,
    isTranslated,
    handleCopy,
    handleDelete,
    handleRegenerate,
    handlePlay,
    handleTranslate,
    handleDeleteTranslation,
    getMessageContent,
    handleBestAnswer,
    isUseful
  } = useMessageActions({ message, assistant })

  const handleSelectText = async () => {
    requestAnimationFrame(() => {
      textSelectionSheetRef.current?.present()
    })
  }

  const getAudioIcon = () => {
    switch (playState) {
      case 'playing':
        return <CirclePause size={16} />
      default:
        return <AudioLines size={16} />
    }
  }

  useEffect(() => {
    getMessageContent().then(setMessageContent)
  }, [message, getMessageContent])

  const contextMenuItems: ContextMenuListProps[] = [
    {
      title: t('common.copy'),
      iOSIcon: 'document.on.document',
      androidIcon: <Copy size={16} />,
      onSelect: handleCopy
    },
    {
      title: t('common.select_text'),
      iOSIcon: 'character.cursor.ibeam',
      androidIcon: <TextSelect size={16} />,
      onSelect: handleSelectText
    },
    ...(message.role === 'assistant'
      ? [
          {
            title: t('common.regenerate'),
            iOSIcon: 'arrow.clockwise' as const,
            androidIcon: <RefreshCw size={16} />,
            onSelect: handleRegenerate
          }
        ]
      : []),
    ...(message.role === 'assistant' && isMultiModel
      ? [
          {
            title: t('button.best_answer'),
            iOSIcon: isUseful ? ('hand.thumbsup.fill' as const) : ('hand.thumbsup' as const),
            androidIcon: isUseful ? <ThumbsUp size={16} className="fill-current" /> : <ThumbsUp size={16} />,
            onSelect: handleBestAnswer
          }
        ]
      : []),
    {
      title: playState === 'playing' ? t('common.stop') : t('common.play'),
      iOSIcon: playState === 'playing' ? 'pause.circle' : 'speaker.wave.2',
      androidIcon: getAudioIcon(),
      onSelect: handlePlay
    },

    {
      title: isTranslated ? t('common.delete_translation') : t('message.translate_message'),
      iOSIcon: 'translate',
      androidIcon: isTranslated ? (
        <TranslatedIcon size={16} color={isTranslated ? 'red' : undefined} />
      ) : (
        <TranslationIcon size={16} />
      ),
      destructive: isTranslated,
      color: isTranslated ? 'red' : undefined,
      backgroundColor: isTranslated ? 'rgba(239, 68, 68, 0.1)' : undefined,
      onSelect: isTranslated ? handleDeleteTranslation : handleTranslate
    },
    {
      title: t('message.delete_message'),
      iOSIcon: 'trash',
      androidIcon: <Trash2 size={16} color="red" />,
      destructive: true,
      color: 'red',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      onSelect: handleDelete
    }
  ]

  return (
    <>
      <ContextMenu list={contextMenuItems} withHighLight={false}>
        {children}
      </ContextMenu>

      <TextSelectionSheet ref={textSelectionSheetRef} content={messageContent} />
    </>
  )
}

export default memo(MessageContextMenu)
