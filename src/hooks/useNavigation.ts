import { useNavigation as _useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import { setCurrentTopicId } from '@/store/topic'
import { NavigationProps } from '@/types/naviagate'
import { haptic } from '@/utils/haptic'
import { ImpactFeedbackStyle } from 'expo-haptics'

export function useCustomNavigation() {
  const navigation = _useNavigation<NavigationProps>()
  const dispatch = useDispatch()

  const navigateToChatScreen = (topicId: string) => {
    dispatch(setCurrentTopicId(topicId))
    navigation.navigate('HomeScreen', { screen: 'ChatScreen', params: { topicId } })
  }

  const navigateToHomeScreen = () => {
    navigation.navigate('HomeScreen', { screen: 'ChatScreen', params: { topicId: 'new' } })
  }

  const navigateBack = () => {
    haptic(ImpactFeedbackStyle.Medium)
    navigation.goBack()
  }

  return {
    navigateBack,
    navigateToChatScreen,
    navigateToHomeScreen
  }
}
