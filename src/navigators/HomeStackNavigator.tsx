import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'

import ChatScreen from '@/screens/home/ChatScreen'
import SettingsScreen from '@/screens/settings/SettingsScreen'
import TopicScreen from '@/screens/topic/TopicScreen'

import AboutStackNavigator from './settings/AboutStackNavigator'
import AssistantSettingsStackNavigator from './settings/AssistantSettingsStackNavigator'
import DataSourcesStackNavigator from './settings/DataSourcesStackNavigator'
import GeneralSettingsStackNavigator from './settings/GeneralSettingsStackNavigator'
import ProvidersStackNavigator from './settings/ProvidersStackNavigator'
import WebSearchStackNavigator from './settings/WebSearchStackNavigator'

export type HomeStackParamList = {
  ChatScreen: { topicId: string }
  TopicScreen: undefined
  SettingsScreen: undefined
  GeneralSettings: { screen?: string; params?: any } | undefined
  AssistantSettings: { screen?: string; params?: any } | undefined
  ProvidersSettings: { screen?: string; params?: any } | undefined
  DataSourcesSettings: { screen?: string; params?: any } | undefined
  WebSearchSettings: { screen?: string; params?: any } | undefined
  AboutSettings: { screen?: string; params?: any } | undefined
}

const Stack = createStackNavigator<HomeStackParamList>()

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureResponseDistance: 9999,
        ...TransitionPresets.SlideFromRightIOS
      }}>
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="TopicScreen" component={TopicScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="GeneralSettings" component={GeneralSettingsStackNavigator} />
      <Stack.Screen name="AssistantSettings" component={AssistantSettingsStackNavigator} />
      <Stack.Screen name="ProvidersSettings" component={ProvidersStackNavigator} />
      <Stack.Screen name="DataSourcesSettings" component={DataSourcesStackNavigator} />
      <Stack.Screen name="WebSearchSettings" component={WebSearchStackNavigator} />
      <Stack.Screen name="AboutSettings" component={AboutStackNavigator} />
    </Stack.Navigator>
  )
}
