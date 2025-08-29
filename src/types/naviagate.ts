import { StackNavigationProp } from '@react-navigation/stack'

export type RootStackParamList = {
  WelcomeScreen: undefined
  HomeScreen: { screen: string; params: { topicId: string } }
  ChatScreen: { topicId: string }
  AssistantDetailScreen: { assistantId: string; tab?: string }
}

export type NavigationProps = StackNavigationProp<RootStackParamList>
