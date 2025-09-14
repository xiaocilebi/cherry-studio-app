import { ImpactFeedbackStyle } from 'expo-haptics'
import { isEmpty } from 'lodash'
import { AnimatePresence, MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard } from 'react-native'
import { styled, TextArea, XStack, YStack } from 'tamagui'

import { isReasoningModel } from '@/config/models'
import { useAssistant } from '@/hooks/useAssistant'
import { useBottom } from '@/hooks/useBottom'
import { useMessageOperations, useTopicLoading } from '@/hooks/useMessageOperation'
import { loggerService } from '@/services/LoggerService'
import { sendMessage as _sendMessage } from '@/services/MessagesService'
import { getUserMessage } from '@/services/MessagesService'
import { useAppDispatch } from '@/store'
import { Model, Topic } from '@/types/assistant'
import { FileMetadata } from '@/types/file'
import { MessageInputBaseParams } from '@/types/message'
import { haptic } from '@/utils/haptic'

import FilePreview from './FilePreview'
import { MentionButton } from './MentionButton'
import { PauseButton } from './PauseButton'
import { SendButton } from './SendButton'
import { ThinkButton } from './ThinkButton'
import { ToolButton } from './ToolButton'
import ToolPreview from './ToolPreview'
const logger = loggerService.withContext('Message Input')

interface MessageInputProps {
  topic: Topic
}

export const MessageInput: React.FC<MessageInputProps> = ({ topic }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { assistant, isLoading, updateAssistant } = useAssistant(topic.assistantId)
  const bottomPad = useBottom()
  const [text, setText] = useState('')
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [mentions, setMentions] = useState<Model[]>([])
  const isTopicLoading = useTopicLoading(topic)
  const { pauseMessages } = useMessageOperations(topic)

  const isReasoning = isReasoningModel(assistant?.model)

  useEffect(() => {
    if (!assistant || !assistant?.defaultModel || mentions.length !== 0) return
    setMentions([assistant?.defaultModel])
  }, [assistant, mentions])

  const sendMessage = async () => {
    if (isEmpty(text.trim()) || !assistant) {
      haptic(ImpactFeedbackStyle.Rigid)
      return
    }

    haptic(ImpactFeedbackStyle.Medium)

    setText('')
    setFiles([])
    Keyboard.dismiss()

    try {
      const baseUserMessage: MessageInputBaseParams = { assistant, topic, content: text }

      if (files.length > 0) {
        baseUserMessage.files = files
      }

      const { message, blocks } = getUserMessage(baseUserMessage)

      if (mentions.length > 0) {
        message.mentions = mentions
      }

      await _sendMessage(message, blocks, assistant, topic.id, dispatch)
    } catch (error) {
      logger.error('Error sending message:', error)
    }
  }

  const onPause = async () => {
    haptic(ImpactFeedbackStyle.Medium)

    try {
      await pauseMessages()
    } catch (error) {
      logger.error('Error pause message:', error)
    }
  }

  if (isLoading || !assistant) {
    return null
  }

  const InputContent = styled(YStack, {
    paddingHorizontal: 18,
    paddingVertical: 8,
    paddingBottom: bottomPad + 8,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '$backgroundOpacity',
    shadowColor: '$textPrimary',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  })

  return (
    <InputContent>
      <YStack gap={10}>
        {files.length > 0 && <FilePreview files={files} setFiles={setFiles} />}
        {/* message */}
        <XStack top={5}>
          <TextArea
            minHeight={50}
            fontSize={16}
            placeholder={t('inputs.placeholder')}
            backgroundColor="$colorTransparent"
            borderWidth={0}
            numberOfLines={10}
            p={0}
            flex={1}
            value={text}
            onChangeText={setText}
            paddingVertical={0}
            color="$textSecondary"
          />
        </XStack>
        {/* button */}
        <XStack justifyContent="space-between" alignItems="center">
          <XStack flex={1} gap={10} alignItems="center">
            <ToolButton files={files} setFiles={setFiles} assistant={assistant} updateAssistant={updateAssistant} />
            {isReasoning && <ThinkButton assistant={assistant} updateAssistant={updateAssistant} />}
            <MentionButton
              mentions={mentions}
              setMentions={setMentions}
              assistant={assistant}
              updateAssistant={updateAssistant}
            />
            <ToolPreview assistant={assistant} updateAssistant={updateAssistant} />
          </XStack>
          <XStack gap={20} alignItems="center" paddingBottom={5}>
            <AnimatePresence exitBeforeEnter>
              {text && !isTopicLoading && (
                <MotiView
                  key="send-button"
                  from={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'timing', duration: 200 }}>
                  <SendButton onSend={sendMessage} />
                </MotiView>
              )}
              {isTopicLoading && (
                <MotiView
                  key="pause-button"
                  from={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'timing', duration: 200 }}>
                  <PauseButton onPause={onPause} />
                </MotiView>
              )}
              {/*{text ? (
                    <MotiView
                      key="send-button"
                      from={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'timing', duration: 100 }}>
                      <SendButton onSend={sendMessage} />
                    </MotiView>
                  ) : (
                    <MotiView
                      key="voice-button"
                      from={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'timing', duration: 100 }}>
                      <VoiceButton />
                    </MotiView>
                  )}*/}
            </AnimatePresence>
          </XStack>
        </XStack>
      </YStack>
    </InputContent>
  )
}
