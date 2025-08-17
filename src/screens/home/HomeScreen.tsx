import 'react-native-reanimated'
import '@/i18n'

import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer'
import React from 'react'

import CustomDrawerContent from '@/components/menu/CustomDrawerContent'
import ChatScreen from '@/screens/home/ChatScreen'
import { Width } from '@/utils/device'

const Drawer = createDrawerNavigator()

export default function HomeScreen() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} screenOptions={screenOptions}>
      <Drawer.Screen name="ChatScreen" options={options} component={ChatScreen} />
    </Drawer.Navigator>
  )
}

const screenOptions: DrawerNavigationOptions = {
  drawerStyle: {
    width: Width * 0.8,
    backgroundColor: 'transparent'
  },
  swipeEnabled: true,
  drawerType: 'front',
  keyboardDismissMode: 'none'
}

const options: DrawerNavigationOptions = {
  headerShown: false,
  drawerItemStyle: {
    display: 'none'
  }
}
