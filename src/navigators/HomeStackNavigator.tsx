import { createStackNavigator, StackNavigationProp, TransitionPresets } from '@react-navigation/stack'
import React from 'react'

import AssistantDetailScreen from '@/screens/assistant/AssistantDetailScreen'
import ChatScreen from '@/screens/home/ChatScreen'
import TopicScreen from '@/screens/topic/TopicScreen'

export type HomeStackParamList = {
  ChatScreen: { topicId?: string }
  TopicScreen: undefined
  AssistantDetailScreen: { assistantId: string; tab?: string }
}

const Stack = createStackNavigator<HomeStackParamList>()
export type HomeStackNavigationProp = StackNavigationProp<HomeStackParamList>

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS
      }}>
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="TopicScreen" component={TopicScreen} />
      <Stack.Screen name="AssistantDetailScreen" component={AssistantDetailScreen} />
    </Stack.Navigator>
  )
}
