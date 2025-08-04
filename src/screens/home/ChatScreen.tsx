import BottomSheet from '@gorhom/bottom-sheet'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { ActivityIndicator, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { YStack } from 'tamagui'

import { AssistantCard } from '@/components/assistant/AssistantCard'
import { HeaderBar } from '@/components/header-bar'
import { MessageInput } from '@/components/message-input/MessageInput'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useTopic } from '@/hooks/useTopic'
import { MessageFooterMore } from '@/screens/home/messages/MessageFooterMore'
import { loggerService } from '@/services/LoggerService'
import { Message } from '@/types/message'
import { RootStackParamList } from '@/types/naviagate'

import ChatContent from './ChatContent'
import WelcomeContent from './WelcomeContent'

const logger = loggerService.withContext('ChatScreen')
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>()
  const { topicId } = route.params
  const { topic, isLoading } = useTopic(topicId)
  const [showAssistantCard, setShowAssistantCard] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const bottomSheetRef = useRef<BottomSheet | null>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const handleBottomSheetClose = () => {
    bottomSheetRef.current?.close()
    setIsBottomSheetOpen(false)
  }

  if (!topic || isLoading) {
    return (
      <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  const hasMessages = topic.messages.length > 0

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <YStack paddingHorizontal={12} backgroundColor="$background" flex={1} onPress={Keyboard.dismiss} gap={20}>
            <HeaderBar
              topic={topic}
              showAssistantCard={showAssistantCard}
              setShowAssistantCard={setShowAssistantCard}
            />

            {showAssistantCard && <AssistantCard topic={topic} />}

            {hasMessages ? (
              <ChatContent
                key={topic.id}
                topic={topic}
                bottomSheetRef={bottomSheetRef}
                setIsBottomSheetOpen={setIsBottomSheetOpen}
                setSelectedMessage={setSelectedMessage}
              />
            ) : (
              <WelcomeContent key={topic.id} />
            )}
            <MessageInput topic={topic} />
          </YStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {/*这里暂时使用底部弹窗的方式实现，后续可以考虑换成长按消息显示右键菜单的方式*/}
      {selectedMessage && (
        <MessageFooterMore
          bottomSheetRef={bottomSheetRef}
          isOpen={isBottomSheetOpen}
          onClose={handleBottomSheetClose}
          message={selectedMessage}
        />
      )}
    </SafeAreaContainer>
  )
}

export default ChatScreen
