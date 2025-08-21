import { DrawerNavigationProp } from '@react-navigation/drawer'
import { DrawerActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Platform, TouchableOpacity, View } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { useDispatch } from 'react-redux'
import { YStack } from 'tamagui'

import { AssistantCard } from '@/components/assistant/AssistantCard'
import { HeaderBar } from '@/components/header-bar'
import { MessageInput } from '@/components/message-input/MessageInput'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useTopic } from '@/hooks/useTopic'
import { getDefaultAssistant } from '@/services/AssistantService'
import { createNewTopic, getNewestTopic } from '@/services/TopicService'
import { setCurrentTopicId } from '@/store/topic'
import { RootStackParamList } from '@/types/naviagate'
import { runAsyncFunction } from '@/utils'
import { haptic } from '@/utils/haptic'

import ChatContent from './ChatContent'
import WelcomeContent from './WelcomeContent'

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>()
  const navigation = useNavigation<DrawerNavigationProp<any>>()
  const { topicId } = route.params || {}
  const { topic, isLoading } = useTopic(topicId)
  const [showAssistantCard, setShowAssistantCard] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    runAsyncFunction(async () => {
      const newestTopic = await getNewestTopic()

      if (newestTopic) {
        navigation.setParams({ topicId: newestTopic.id })
      } else {
        const defaultAssistant = await getDefaultAssistant()
        const newTopic = await createNewTopic(defaultAssistant)
        navigation.setParams({ topicId: newTopic.id })
        dispatch(setCurrentTopicId(newTopic.id))
      }
    })
  }, [dispatch, navigation])

  // 处理侧滑手势
  const handleSwipeGesture = (event: any) => {
    const { translationX, velocityX, state, absoluteX } = event.nativeEvent
    const screenWidth = Dimensions.get('window').width

    // 检测从左边缘向右滑动
    if (state === State.END) {
      // 进一步放宽触发条件：从屏幕左边缘40%区域开始滑动
      // 滑动距离大于40且速度大于200，或者滑动距离大于80
      const isFromLeftEdge = absoluteX < screenWidth * 0.4
      const hasGoodDistance = translationX > 40
      const hasGoodVelocity = velocityX > 200
      const hasExcellentDistance = translationX > 80

      if (isFromLeftEdge && ((hasGoodDistance && hasGoodVelocity) || hasExcellentDistance)) {
        haptic(ImpactFeedbackStyle.Medium)
        navigation.dispatch(DrawerActions.openDrawer())
      }
    }
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
      <PanGestureHandler
        onGestureEvent={handleSwipeGesture}
        onHandlerStateChange={handleSwipeGesture}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-20, 20]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <YStack paddingHorizontal={12} backgroundColor="$colorTransparent" flex={1} gap={20}>
            <HeaderBar
              topic={topic}
              showAssistantCard={showAssistantCard}
              setShowAssistantCard={setShowAssistantCard}
            />

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
      </PanGestureHandler>
    </SafeAreaContainer>
  )
}

export default ChatScreen
