import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'

import AboutScreen from '@/screens/settings/about/AboutScreen'
import AssistantSettingsScreen from '@/screens/settings/assistant/AssistantSettingsScreen'
import BasicDataSettingsScreen from '@/screens/settings/data/BasicDataSettingsScreen'
import DataSettingsScreen from '@/screens/settings/data/DataSettingsScreen'
import JoplinSettingsScreen from '@/screens/settings/data/JoplinSettingsScreen'
import LandropSettingsScreen from '@/screens/settings/data/Landrop/LandropSettingsScreen'
import NotionSettingsScreen from '@/screens/settings/data/NotionSettingsScreen'
import NutstoreLoginScreen from '@/screens/settings/data/NutstoreLoginScreen'
import ObsidianSettingsScreen from '@/screens/settings/data/ObsidianSettingsScreen'
import SiyuanSettingsScreen from '@/screens/settings/data/SiyuanSettingsScreen'
import WebDavConfigScreen from '@/screens/settings/data/WebDavConfigScreen'
import WebDavScreen from '@/screens/settings/data/WebDavScreen'
import YuqueSettingsScreen from '@/screens/settings/data/YuqueSettingsScreen'
import GeneralSettingsScreen from '@/screens/settings/general/GeneralSettingsScreen'
import LanguageChangeScreen from '@/screens/settings/general/LanguageChangeScreen'
import ThemeSettingsScreen from '@/screens/settings/general/ThemeSettingsScreen'
import PersonalScreen from '@/screens/settings/personal/PersonalScreen'
import ApiServiceScreen from '@/screens/settings/providers/ApiServiceScreen'
import ManageModelsScreen from '@/screens/settings/providers/ManageModelsScreen'
import ProviderListScreen from '@/screens/settings/providers/ProviderListScreen'
import ProviderSettingsScreen from '@/screens/settings/providers/ProviderSettingsScreen'
import ProvidersScreen from '@/screens/settings/providers/ProvidersScreen'
import SettingsScreen from '@/screens/settings/SettingsScreen'
import WebSearchProviderSettingsScreen from '@/screens/settings/websearch/WebSearchProviderSettingsScreen'
import WebSearchSettingsScreen from '@/screens/settings/websearch/WebSearchSettingsScreen'

export type SettingsStackParamList = {
  SettingsScreen: undefined
  PersonalScreen: undefined
  ProvidersScreen: undefined
  ProviderSettingsScreen: { providerId: string }
  ProviderListScreen: undefined
  ManageModelsScreen: { providerId: string }
  ApiServiceScreen: { providerId: string }
  AssistantSettingsScreen: undefined
  WebSearchSettingsScreen: undefined
  WebSearchProviderSettingsScreen: { providerId: string }
  GeneralSettingsScreen: undefined
  ThemeSettingsScreen: undefined
  LanguageChangeScreen: undefined
  DataSettingsScreen: undefined
  BasicDataSettingsScreen: undefined
  LandropSettingsScreen: undefined
  NutstoreLoginScreen: undefined
  NotionSettingsScreen: undefined
  YuqueSettingsScreen: undefined
  JoplinSettingsScreen: undefined
  ObsidianSettingsScreen: undefined
  SiyuanSettingsScreen: undefined
  WebDavScreen: undefined
  WebDavConfigScreen: undefined
  AboutScreen: undefined
}

const Stack = createStackNavigator<SettingsStackParamList>()

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS
      }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />

      <Stack.Screen name="PersonalScreen" component={PersonalScreen} />

      <Stack.Screen name="ProvidersScreen" component={ProvidersScreen} />
      <Stack.Screen name="ProviderSettingsScreen" component={ProviderSettingsScreen} />
      <Stack.Screen name="ProviderListScreen" component={ProviderListScreen} />
      <Stack.Screen name="ManageModelsScreen" component={ManageModelsScreen} />
      <Stack.Screen name="ApiServiceScreen" component={ApiServiceScreen} />

      <Stack.Screen name="AssistantSettingsScreen" component={AssistantSettingsScreen} />

      <Stack.Screen name="WebSearchSettingsScreen" component={WebSearchSettingsScreen} />
      <Stack.Screen name="WebSearchProviderSettingsScreen" component={WebSearchProviderSettingsScreen} />

      <Stack.Screen name="GeneralSettingsScreen" component={GeneralSettingsScreen} />
      <Stack.Screen name="ThemeSettingsScreen" component={ThemeSettingsScreen} />
      <Stack.Screen name="LanguageChangeScreen" component={LanguageChangeScreen} />
      <Stack.Screen name="DataSettingsScreen" component={DataSettingsScreen} />
      <Stack.Screen name="BasicDataSettingsScreen" component={BasicDataSettingsScreen} />
      <Stack.Screen name="LandropSettingsScreen" component={LandropSettingsScreen} />
      <Stack.Screen name="NutstoreLoginScreen" component={NutstoreLoginScreen} />
      <Stack.Screen name="NotionSettingsScreen" component={NotionSettingsScreen} />
      <Stack.Screen name="YuqueSettingsScreen" component={YuqueSettingsScreen} />
      <Stack.Screen name="JoplinSettingsScreen" component={JoplinSettingsScreen} />
      <Stack.Screen name="ObsidianSettingsScreen" component={ObsidianSettingsScreen} />
      <Stack.Screen name="SiyuanSettingsScreen" component={SiyuanSettingsScreen} />

      <Stack.Screen name="WebDavScreen" component={WebDavScreen} />
      <Stack.Screen name="WebDavConfigScreen" component={WebDavConfigScreen} />

      <Stack.Screen name="AboutScreen" component={AboutScreen} />
    </Stack.Navigator>
  )
}
