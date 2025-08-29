import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'

import AboutScreen from '@/screens/settings/about/AboutScreen'
import AssistantSettingsScreen from '@/screens/settings/assistant/AssistantSettingsScreen'
import PersonalScreen from '@/screens/settings/personal/PersonalScreen'

export type AboutStackParamList = {
  PersonalScreen: undefined
  AssistantSettingsScreen: undefined
  AboutScreen: undefined
}

const Stack = createStackNavigator<AboutStackParamList>()

export default function AboutStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS
      }}>
      <Stack.Screen name="PersonalScreen" component={PersonalScreen} />
      <Stack.Screen name="AssistantSettingsScreen" component={AssistantSettingsScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
    </Stack.Navigator>
  )
}
