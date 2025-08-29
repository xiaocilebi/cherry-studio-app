import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'

import ApiServiceScreen from '@/screens/settings/providers/ApiServiceScreen'
import ManageModelsScreen from '@/screens/settings/providers/ManageModelsScreen'
import ProviderListScreen from '@/screens/settings/providers/ProviderListScreen'
import ProviderSettingsScreen from '@/screens/settings/providers/ProviderSettingsScreen'
import ProvidersScreen from '@/screens/settings/providers/ProvidersScreen'

export type ProvidersStackParamList = {
  ProvidersScreen: undefined
  ProviderSettingsScreen: { providerId: string }
  ProviderListScreen: undefined
  ManageModelsScreen: { providerId: string }
  ApiServiceScreen: { providerId: string }
}

const Stack = createStackNavigator<ProvidersStackParamList>()

export default function ProvidersStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS
      }}>
      <Stack.Screen name="ProvidersScreen" component={ProvidersScreen} />
      <Stack.Screen name="ProviderSettingsScreen" component={ProviderSettingsScreen} />
      <Stack.Screen name="ProviderListScreen" component={ProviderListScreen} />
      <Stack.Screen name="ManageModelsScreen" component={ManageModelsScreen} />
      <Stack.Screen name="ApiServiceScreen" component={ApiServiceScreen} />
    </Stack.Navigator>
  )
}
