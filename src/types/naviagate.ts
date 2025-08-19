import { NavigatorScreenParams } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { SettingsStackParamList } from '@/navigators/SettingsStackNavigator'

export type RootStackParamList = {
  WelcomeScreen: undefined
  HomeScreen: { screen: string; params: { topicId: string } }
  ChatScreen: { topicId: string }
  Settings: NavigatorScreenParams<SettingsStackParamList> | undefined
  TopicScreen: undefined
  AssistantScreen: undefined
  AssistantDetailScreen: { assistantId: string; tab?: string }
  AssistantMarketScreen: undefined
  TestScreen: undefined
}

export type NavigationProps = StackNavigationProp<RootStackParamList>
