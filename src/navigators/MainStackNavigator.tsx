import '@/i18n'

import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import SettingsStackNavigator from '@/navigators/SettingsStackNavigator'
import AssistantDetailScreen from '@/screens/assistant/AssistantDetailScreen'
import AssistantMarketScreen from '@/screens/assistant/AssistantMarketScreen'
import AssistantScreen from '@/screens/assistant/AssistantScreen'
import HomeScreen from '@/screens/home/HomeScreen'
import TopicScreen from '@/screens/topic/TopicScreen'
import WelcomeScreen from '@/screens/WelcomeScreen'
import { useAppSelector } from '@/store'
import { RootStackParamList } from '@/types/naviagate'

const Stack = createStackNavigator<RootStackParamList>()

export default function MainStackNavigator() {
  const welcomeShown = useAppSelector(state => state.app.welcomeShown)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      {/* index */}
      {!welcomeShown && <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />}
      <Stack.Screen name="HomeScreen" component={HomeScreen} />

      {/* assistant screen */}
      <Stack.Screen name="AssistantScreen" component={AssistantScreen} />
      <Stack.Screen name="AssistantDetailScreen" component={AssistantDetailScreen} />
      <Stack.Screen name="AssistantMarketScreen" component={AssistantMarketScreen} />

      {/* Settings Stack */}
      <Stack.Screen name="Settings" component={SettingsStackNavigator} />

      {/* topic screen */}
      <Stack.Screen name="TopicScreen" component={TopicScreen} />
    </Stack.Navigator>
  )
}
