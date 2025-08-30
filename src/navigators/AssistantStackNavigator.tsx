import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'

import AssistantDetailScreen from '@/screens/assistant/AssistantDetailScreen'
import AssistantMarketScreen from '@/screens/assistant/AssistantMarketScreen'
import AssistantScreen from '@/screens/assistant/AssistantScreen'

export type AssistantStackParamList = {
  AssistantScreen: undefined
  AssistantMarketScreen: undefined
  AssistantDetailScreen: { assistantId: string; tab?: string }
}

const Stack = createStackNavigator<AssistantStackParamList>()

export default function AssistantStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS
      }}>
      <Stack.Screen name="AssistantScreen" component={AssistantScreen} />
      <Stack.Screen name="AssistantMarketScreen" component={AssistantMarketScreen} />
      <Stack.Screen name="AssistantDetailScreen" component={AssistantDetailScreen} />
    </Stack.Navigator>
  )
}
