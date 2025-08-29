import 'react-native-reanimated'
import '@/i18n'

import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer'
import React from 'react'

import CustomDrawerContent from '@/components/menu/CustomDrawerContent'
import SettingsStackNavigator from '@/navigators/SettingsStackNavigator'
import AssistantDetailScreen from '@/screens/assistant/AssistantDetailScreen'
import AssistantMarketScreen from '@/screens/assistant/AssistantMarketScreen'
import AssistantScreen from '@/screens/assistant/AssistantScreen'
import ChatScreen from '@/screens/home/ChatScreen'
import TopicScreen from '@/screens/topic/TopicScreen'
import { Width } from '@/utils/device'

const Drawer = createDrawerNavigator()

export default function HomeScreen() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} screenOptions={screenOptions}>
      <Drawer.Screen name="ChatScreen" options={options} component={ChatScreen} />
      <Drawer.Screen name="AssistantMarketScreen" options={options} component={AssistantMarketScreen} />
      <Drawer.Screen name="AssistantScreen" options={options} component={AssistantScreen} />
      <Drawer.Screen name="AssistantDetailScreen" options={options} component={AssistantDetailScreen} />
      <Drawer.Screen name="TopicScreen" options={options} component={TopicScreen} />
      <Drawer.Screen name="Settings" options={options} component={SettingsStackNavigator} />
    </Drawer.Navigator>
  )
}

const screenOptions: DrawerNavigationOptions = {
  drawerStyle: {
    width: Width * 0.8
  },
  swipeEnabled: true,
  drawerType: 'slide',
  keyboardDismissMode: 'none'
}

const options: DrawerNavigationOptions = {
  headerShown: false
}
