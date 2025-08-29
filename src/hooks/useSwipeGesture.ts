import { useNavigation } from '@react-navigation/native'
import { ImpactFeedbackStyle } from 'expo-haptics'
import { Dimensions } from 'react-native'
import { Gesture } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'

import { NavigationProps } from '@/types/naviagate'
import { haptic } from '@/utils/haptic'

export function useSwipeGesture() {
  const navigation = useNavigation<NavigationProps>()

  const screenWidth = Dimensions.get('window').width
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onBegin(event => {
      // 只在屏幕左半部分触发手势
      if (event.x > screenWidth / 2) {
        runOnJS(() => {})() // 取消手势
      }
    })
    .onEnd(event => {
      const { translationX, velocityX, x } = event

      // 确保手势开始位置在屏幕左半部分
      if (x > screenWidth / 2) return

      // 检测向右滑动
      // 滑动距离大于20且速度大于100，或者滑动距离大于80
      const hasGoodDistance = translationX > 20
      const hasGoodVelocity = velocityX > 100
      const hasExcellentDistance = translationX > 80

      if ((hasGoodDistance && hasGoodVelocity) || hasExcellentDistance) {
        runOnJS(haptic)(ImpactFeedbackStyle.Medium)
        runOnJS(navigation.goBack)()
      }
    })

  return panGesture
}
