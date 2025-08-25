import '@/i18n'

import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import HomeScreen from '@/screens/home/HomeScreen'
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
    </Stack.Navigator>
  )
}
