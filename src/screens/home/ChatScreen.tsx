import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { ActivityIndicator, Platform, TouchableOpacity, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { YStack } from 'tamagui'

import { AssistantCard } from '@/components/assistant/AssistantCard'
import { HeaderBar } from '@/components/header-bar'
import { MessageInput } from '@/components/message-input/MessageInput'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useTopic } from '@/hooks/useTopic'
import { RootStackParamList } from '@/types/naviagate'

import ChatContent from './ChatContent'
import WelcomeContent from './WelcomeContent'

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>()
  const { topicId } = route.params
  const { topic, isLoading } = useTopic(topicId)
  const [showAssistantCard, setShowAssistantCard] = useState(false)

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
        <YStack paddingHorizontal={12} backgroundColor="$colorTransparent" flex={1} gap={20}>
          <HeaderBar topic={topic} showAssistantCard={showAssistantCard} setShowAssistantCard={setShowAssistantCard} />

          {showAssistantCard && (
            <>
              {/*实现失焦回弹*/}
              <TouchableOpacity
                activeOpacity={0}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1
                }}
                onPress={() => setShowAssistantCard(false)}
              />
              <View style={{ zIndex: 2 }}>
                <AssistantCard topic={topic} />
              </View>
            </>
          )}

          {hasMessages ? <ChatContent key={topic.id} topic={topic} /> : <WelcomeContent key={topic.id} />}
          <MessageInput topic={topic} />
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  )
}

export default ChatScreen
