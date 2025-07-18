import 'react-native-reanimated'
import '@/i18n'

import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import { Dimensions } from 'react-native'

import CustomDrawerContent from '../components/menu/CustomDrawerContent'
import MainStackNavigator from './MainStackNavigator'

const Drawer = createDrawerNavigator()

export default function AppNavigator() {
  const screenWidth = Dimensions.get('window').width

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: screenWidth * 0.8,
          backgroundColor: 'transparent'
        },
        // 无法根据具体route设定开启，希望只在ChatScreen开启，但是当swipeEnabled为true时，所有界面都会开启
        swipeEnabled: false,
        drawerType: 'slide',
        keyboardDismissMode: 'none'
      }}>
      <Drawer.Screen
        name="Main"
        options={{
          headerShown: false,
          drawerItemStyle: {
            display: 'none'
          }
        }}
        component={MainStackNavigator}
      />
    </Drawer.Navigator>
  )
}
