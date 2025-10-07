import { DrawerNavigationProp } from '@react-navigation/drawer'
import { DrawerActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ImpactFeedbackStyle } from 'expo-haptics'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { YStack, SafeAreaContainer } from '@/componentsV2'
import { MessageInputContainer } from '@/componentsV2/features/ChatScreen/MessageInput/MessageInputContainer'

import { useAssistant } from '@/hooks/useAssistant'
import { useBottom } from '@/hooks/useBottom'
import { useTopic } from '@/hooks/useTopic'
import { HomeStackParamList } from '@/navigators/HomeStackNavigator'
import { loggerService } from '@/services/LoggerService'
import { useAppSelector } from '@/store'
import { haptic } from '@/utils/haptic'

import ChatContent from './ChatContent'
import WelcomeContent from './WelcomeContent'
import { ChatScreenHeader } from '@/componentsV2/features/ChatScreen/Header'

const logger = loggerService.withContext('ChatScreen')

type ChatScreenRouteProp = RouteProp<HomeStackParamList, 'ChatScreen'>

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>()
  const navigation = useNavigation<DrawerNavigationProp<any>>()
  const currentTopicId = useAppSelector(state => state.topic.currentTopicId)
  const topicId = route.params?.topicId || currentTopicId
  const [shouldLoadTopic, setShouldLoadTopic] = useState(false)
  const previousTopicId = useRef<string>('')
  const { topic, isLoading } = useTopic(shouldLoadTopic ? topicId : '')
  const { assistant, isLoading: assistantLoading } = useAssistant(topic?.assistantId || '')
  const specificBottom = useBottom()

  // 监听 topicId 变化，延迟 300ms 避免在 drawer 动画期间查询数据库
  useEffect(() => {
    console.log('ChatScreen topicid', route.params?.topicId)
    if (previousTopicId.current !== topicId) {
      // topicId 变化，重置为 false，避免立即查询
      setShouldLoadTopic(false)
      previousTopicId.current = topicId

      // 延迟 300ms 后再允许加载数据
      const timer = setTimeout(() => {
        setShouldLoadTopic(true)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [topicId])

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
