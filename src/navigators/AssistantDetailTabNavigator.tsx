import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import { Text } from 'tamagui'

import { useTheme } from '@/hooks/useTheme'
import { AssistantStackParamList } from '@/navigators/AssistantStackNavigator'
import ModelTabScreen from '@/screens/assistant/tabs/ModelTabScreen'
import PromptTabScreen from '@/screens/assistant/tabs/PromptTabScreen'
import ToolTabScreen from '@/screens/assistant/tabs/ToolTabScreen'
import { Assistant } from '@/types/assistant'

export type AssistantDetailTabParamList = {
  PromptTab: { assistant: Assistant }
  ModelTab: { assistant: Assistant }
  ToolTab: { assistant: Assistant }
}

const Tab = createMaterialTopTabNavigator<AssistantDetailTabParamList>()

type AssistantDetailRouteProp = RouteProp<AssistantStackParamList, 'AssistantDetailScreen'>

interface AssistantDetailTabNavigatorProps {
  assistant: Assistant
}

function CustomTabBar({ state, navigation }: any) {
  const { isDark } = useTheme()
  const { t } = useTranslation()

  const tabLabels = {
    PromptTab: t('common.prompt'),
    ModelTab: t('common.model'),
    ToolTab: t('common.tool')
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#a0a1b033',
        borderRadius: 25,
        marginHorizontal: 5,
        marginVertical: 4,
        gap: 5,
        paddingVertical: 4,
        paddingHorizontal: 5
      }}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              backgroundColor: isFocused ? (isDark ? '#acf3a633' : '#8de59e4d') : 'transparent',
              borderRadius: 20,
              paddingVertical: 12,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text
              fontSize={12}
              fontWeight="bold"
              color={isFocused ? (isDark ? '#acf3a6ff' : '#81df94ff') : isDark ? '#f9f9f9ff' : '#202020ff'}>
              {tabLabels[route.name as keyof typeof tabLabels]}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default function AssistantDetailTabNavigator({ assistant }: AssistantDetailTabNavigatorProps) {
  const { t } = useTranslation()
  const route = useRoute<AssistantDetailRouteProp>()
  const { tab } = route.params

  return (
    <Tab.Navigator
      initialRouteName={getInitialTabRoute(tab)}
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true
      }}>
      <Tab.Screen
        name="PromptTab"
        component={PromptTabScreen}
        options={{
          tabBarLabel: t('common.prompt')
        }}
        initialParams={{ assistant }}
      />
      <Tab.Screen
        name="ModelTab"
        component={ModelTabScreen}
        options={{
          tabBarLabel: t('common.model')
        }}
        initialParams={{ assistant }}
      />
      <Tab.Screen
        name="ToolTab"
        component={ToolTabScreen}
        options={{
          tabBarLabel: t('common.tool')
        }}
        initialParams={{ assistant }}
      />
    </Tab.Navigator>
  )
}

function getInitialTabRoute(tab?: string): keyof AssistantDetailTabParamList {
  switch (tab) {
    case 'prompt':
      return 'PromptTab'
    case 'model':
      return 'ModelTab'
    case 'tool':
      return 'ToolTab'
    default:
      return 'PromptTab'
  }
}
