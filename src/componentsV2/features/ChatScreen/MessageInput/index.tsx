import { AnimatePresence, MotiView } from 'moti'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { DropShadowView } from 'heroui-native'

import { useBottom } from '@/hooks/useBottom'
import { Assistant, Topic } from '@/types/assistant'
import { FilePreview } from './FilePreview'
import { ToolButton } from './ToolButton'
import { ThinkButton } from './ThinkButton'
import { MentionButton } from './MentionButton'
import { ToolPreview } from './ToolPreview'
import { PauseButton } from './PauseButton'
import { SendButton } from './SendButton'
import YStack from '@/componentsV2/layout/YStack'
import XStack from '@/componentsV2/layout/XStack'
import TextField from '@/componentsV2/base/TextField'
import { McpButton } from './McpButton'
import { useMessageInputLogic } from './hooks/useMessageInputLogic'

interface MessageInputProps {
  topic: Topic
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => Promise<void>
}

export const MessageInput: React.FC<MessageInputProps> = ({ topic, assistant, updateAssistant }) => {
  const { t } = useTranslation()
  const bottomPad = useBottom()
  const { text, setText, files, setFiles, mentions, setMentions, isReasoning, isTopicLoading, sendMessage, onPause } =
    useMessageInputLogic(topic, assistant)

  return (
    <DropShadowView
      className="px-5 py-2 rounded-2xl bg-surface-1"
      shadowSize="xl"
      iosShadowStyle={{
        shadowOffset: { width: 0, height: -4 }
      }}
      androidShadowStyle={{
        elevation: 10
      }}
      style={{
        paddingBottom: Platform.OS === 'android' ? bottomPad + 8 : bottomPad
      }}>
      <YStack className="gap-[10px]">
        {files.length > 0 && <FilePreview files={files} setFiles={setFiles} />}
        {/* message */}
        <XStack className="top-[5px]">
          <TextField className="w-full p-0">
            <TextField.Input
              className="h-24 p-0 border-none text-base text-text-primary dark:text-text-primary-dark"
              placeholder={t('inputs.placeholder')}
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={10}
              colors={{
                blurBackground: 'transparent',
                // focusBackground: 'transparent',
                blurBorder: 'transparent',
                focusBorder: 'transparent'
              }}
            />
          </TextField>
        </XStack>
        {/* button */}
        <XStack className="justify-between items-center">
          <XStack className="flex-1 gap-[10px] items-center">
            <ToolButton
              mentions={mentions}
              files={files}
              setFiles={setFiles}
              assistant={assistant}
              updateAssistant={updateAssistant}
            />
            {isReasoning && <ThinkButton assistant={assistant} updateAssistant={updateAssistant} />}
            <MentionButton
              mentions={mentions}
              setMentions={setMentions}
              assistant={assistant}
              updateAssistant={updateAssistant}
            />
            <McpButton assistant={assistant} updateAssistant={updateAssistant} />
            <ToolPreview assistant={assistant} updateAssistant={updateAssistant} />
          </XStack>
          <XStack className="gap-5 items-center">
            <AnimatePresence exitBeforeEnter>
              {isTopicLoading ? (
                <MotiView
                  key="pause-button"
                  from={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'timing', duration: 200 }}>
                  <PauseButton onPause={onPause} />
                </MotiView>
              ) : (
                <MotiView
                  key="send-button"
                  from={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'timing', duration: 200 }}>
                  <SendButton onSend={sendMessage} disabled={!text} />
                </MotiView>
              )}
            </AnimatePresence>
          </XStack>
        </XStack>
      </YStack>
    </DropShadowView>
  )
}
