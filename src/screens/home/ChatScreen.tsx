import { DrawerNavigationProp } from '@react-navigation/drawer'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { ImpactFeedbackStyle } from 'expo-haptics'
import * as React from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { YStack, SafeAreaContainer } from '@/componentsV2'
import { MessageInputContainer } from '@/componentsV2/features/ChatScreen/MessageInput/MessageInputContainer'

import { useAssistant } from '@/hooks/useAssistant'
import { useBottom } from '@/hooks/useBottom'
import { useTopic } from '@/hooks/useTopic'
import { useAppSelector } from '@/store'
import { haptic } from '@/utils/haptic'

import ChatContent from './ChatContent'
import WelcomeContent from './WelcomeContent'
import { ChatScreenHeader } from '@/componentsV2/features/ChatScreen/Header'

const ChatScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>()
  const topicId = useAppSelector(state => state.topic.currentTopicId)

  const { topic, isLoading } = useTopic(topicId ?? '')
  const { assistant, isLoading: assistantLoading } = useAssistant(topic?.assistantId || '')
  const specificBottom = useBottom()

  // 处理侧滑手势
  const handleSwipeGesture = (event: any) => {
    const { translationX, velocityX, state } = event.nativeEvent

    // 检测向右滑动
    if (state === State.END) {
      // 全屏可侧滑触发：滑动距离大于20且速度大于100，或者滑动距离大于80
      const hasGoodDistance = translationX > 20
      const hasGoodVelocity = velocityX > 100
      const hasExcellentDistance = translationX > 80

      if ((hasGoodDistance && hasGoodVelocity) || hasExcellentDistance) {
        haptic(ImpactFeedbackStyle.Medium)
        navigation.dispatch(DrawerActions.openDrawer())
      }
    }
  }

  if (!topic || isLoading || !assistant || assistantLoading) {
    return (
      <SafeAreaContainer style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  const hasMessage = topic.messages.length > 0

  return (
    <SafeAreaContainer style={{ paddingBottom: 0 }}>
      <PanGestureHandler
        onGestureEvent={handleSwipeGesture}
        onHandlerStateChange={handleSwipeGesture}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-20, 20]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? -20 : -specificBottom}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <YStack className="flex-1">
            <ChatScreenHeader topic={topic} />

            <View
              style={{
                flex: 1
              }}>
              {/* ChatContent use key to re-render screen content */}
              {/* if remove key, change topic will not re-render */}
              {!hasMessage ? <WelcomeContent /> : <ChatContent key={topicId} topic={topic} assistant={assistant} />}
            </View>
            <MessageInputContainer topic={topic} />
          </YStack>
        </KeyboardAvoidingView>
      </PanGestureHandler>
    </SafeAreaContainer>
  )
}

export default ChatScreen
