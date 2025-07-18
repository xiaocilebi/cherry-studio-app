import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { LinearGradient } from '@tamagui/linear-gradient'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native'
import { styled, YStack } from 'tamagui'

import { HeaderBar } from '@/components/header-bar'
import { MessageInput } from '@/components/message-input/MessageInput'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useAssistant } from '@/hooks/useAssistant'
import { useTopic } from '@/hooks/useTopic'
import { NavigationProps, RootStackParamList } from '@/types/naviagate'
import { useIsDark } from '@/utils'

import ChatContent from './ChatContent'
import WelcomeContent from './WelcomeContent'

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>()
  const navigation = useNavigation<NavigationProps>()
  const { topicId } = route.params
  const isDark = useIsDark()
  const { updateAssistant } = useAssistant('default')
  const { topic, isLoading } = useTopic(topicId)
  const [firstLoadDone, setFirstLoadDone] = useState(false)

  useEffect(() => {
    if (!isLoading && !firstLoadDone) {
      setFirstLoadDone(true)
    }
  }, [isLoading, firstLoadDone])

  // fix: 当drawer删除当前topic则跳转到home获取new topic
  useEffect(() => {
    if (firstLoadDone && !topic) {
      navigation.navigate('HomeScreen')
    }
  }, [firstLoadDone, topic])

  if (!topic || isLoading) {
    return (
      <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  const hasMessages = topic.messages.length > 0

  // 动态颜色配置
  const gradientColors = isDark ? ['#acf3a633', '#acf3a6ff', '#acf3a633'] : ['#8de59e4d', '#81df94ff', '#8de59e4d']

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <YStack paddingHorizontal={12} backgroundColor="$background" flex={1} onPress={Keyboard.dismiss} gap={20}>
            <HeaderBar topic={topic} />

            {hasMessages ? <ChatContent key={topic.id} topic={topic} /> : <WelcomeContent key={topic.id} />}
            <LinearGradient padding={1} borderRadius={20} colors={gradientColors} start={[0, 0]} end={[1, 1]}>
              <InputContent>
                <MessageInput topic={topic} updateAssistant={updateAssistant} />
              </InputContent>
            </LinearGradient>
          </YStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  )
}

const InputContent = styled(YStack, {
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 20,
  backgroundColor: '$background'
})

export default ChatScreen
