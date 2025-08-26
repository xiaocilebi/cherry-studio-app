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
      <Drawer.Screen name="AssistantMarketScreen" options={disableSwipeOptions} component={AssistantMarketScreen} />
      <Drawer.Screen name="AssistantScreen" options={disableSwipeOptions} component={AssistantScreen} />
      <Drawer.Screen name="AssistantDetailScreen" options={disableSwipeOptions} component={AssistantDetailScreen} />
      <Drawer.Screen name="TopicScreen" options={disableSwipeOptions} component={TopicScreen} />
      <Drawer.Screen name="Settings" options={disableSwipeOptions} component={SettingsStackNavigator} />
    </Drawer.Navigator>
  )
}

const screenOptions: DrawerNavigationOptions = {
  drawerStyle: {
    width: Width * 0.8
  },
  swipeEnabled: true,
  drawerType: 'front',
  keyboardDismissMode: 'none'
}

const options: DrawerNavigationOptions = {
  headerShown: false
}

// 其他界面侧滑有概率打开drawer
const disableSwipeOptions: DrawerNavigationOptions = {
  headerShown: false,
  swipeEnabled: false
}
