import { LinearGradient } from '@tamagui/linear-gradient'
import { ImpactFeedbackStyle } from 'expo-haptics'
import { isEmpty } from 'lodash'
import { AnimatePresence, MotiView } from 'moti'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard } from 'react-native'
import { styled, TextArea, View, XStack, YStack } from 'tamagui'

import { isReasoningModel } from '@/config/models/reasoning'
import { useAssistant } from '@/hooks/useAssistant'
import { loggerService } from '@/services/LoggerService'
import { sendMessage as _sendMessage } from '@/services/MessagesService'
import { getUserMessage } from '@/services/MessagesService'
import { Model, Topic } from '@/types/assistant'
import { FileType } from '@/types/file'
import { MessageInputBaseParams } from '@/types/message'
import { useIsDark } from '@/utils'
import { haptic } from '@/utils/haptic'

import FilePreview from './FilePreview'
import { MentionButton } from './MentionButton'
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
  const isDark = useIsDark()
  const { assistant, isLoading, updateAssistant } = useAssistant(topic.assistantId)

  const [text, setText] = useState('')
  const [files, setFiles] = useState<FileType[]>([])
  const [mentions, setMentions] = useState<Model[]>([])

  const isReasoning = isReasoningModel(assistant?.model)

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

      await _sendMessage(message, blocks, assistant, topic.id)
    } catch (error) {
      logger.error('Error sending message:', error)
    }
  }

  if (isLoading || !assistant) {
    return null
  }

  return (
    <LinearGradient
      padding={1}
      borderRadius={20}
      colors={isDark ? ['#acf3a633', '#acf3a6ff', '#acf3a633'] : ['#8de59e4d', '#81df94ff', '#8de59e4d']}
      start={[0, 0]}
      end={[1, 1]}>
      <InputContent style={{ backgroundColor: isDark ? '#121213ff' : '#f7f7f7ff' }}>
        <View>
          <YStack gap={10}>
            {files.length > 0 && <FilePreview files={files} setFiles={setFiles} />}
            {/* message */}
            <XStack>
              <TextArea
                placeholder={t('inputs.placeholder')}
                borderWidth={0}
                backgroundColor="$colorTransparent"
                flex={1}
                value={text}
                onChangeText={setText}
                lineHeight={22}
                color="$textSecondaryLight"
              />
            </XStack>
            {/* button */}
            <XStack justifyContent="space-between" alignItems="center" minHeight={30}>
              <XStack gap={10} alignItems="center">
                <ToolButton files={files} setFiles={setFiles} assistant={assistant} updateAssistant={updateAssistant} />
                {isReasoning && <ThinkButton assistant={assistant} updateAssistant={updateAssistant} />}
                <ToolPreview assistant={assistant} updateAssistant={updateAssistant} />
              </XStack>
              <XStack gap={10} alignItems="center">
                <MentionButton mentions={mentions} setMentions={setMentions} />
                <AnimatePresence exitBeforeEnter>
                  {text && (
                    <MotiView
                      key="send-button"
                      from={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'timing', duration: 200 }}>
                      <SendButton onSend={sendMessage} />
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
        </View>
      </InputContent>
    </LinearGradient>
  )
}

const InputContent = styled(YStack, {
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 20
})
