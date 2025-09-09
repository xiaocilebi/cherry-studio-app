import { useNavigation } from '@react-navigation/native'
import { ArrowLeft } from '@tamagui/lucide-icons'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Button, Text, XStack } from 'tamagui'

import { DrawerNavigationProps } from '@/types/naviagate'

interface HeaderBarProps {
  title: string
  onBackPress?: () => void
  leftButton?: {
    icon: any
    onPress: () => void
  }
  rightButton?: {
    icon: any
    onPress: () => void
  }
  rightButtons?: {
    icon: any
    onPress: () => void
  }[]
  showBackButton?: boolean
}

export function HeaderBar({ title, leftButton, rightButton, rightButtons, showBackButton = true }: HeaderBarProps) {
  const buttonsToRender = rightButtons || (rightButton ? [rightButton] : [])
  const navigation = useNavigation<DrawerNavigationProps>()

  const navigateBack = () => {
    navigation.goBack()
  }

  return (
    <XStack paddingHorizontal="$4" alignItems="center" height={44} justifyContent="space-between">
      {/* 左侧按钮 */}
      <XStack alignItems="center" minWidth={40}>
        {leftButton ? (
          <TouchableOpacity hitSlop={10} onPress={leftButton.onPress}>
            {leftButton.icon}
          </TouchableOpacity>
        ) : showBackButton ? (
          <TouchableOpacity hitSlop={10} onPress={navigateBack}>
            {<ArrowLeft size={24} />}
          </TouchableOpacity>
        ) : (
          <XStack width={40} /> // 占位，确保标题能正确居中
        )}
      </XStack>

      {/* 居中标题 */}
      <XStack flex={1} justifyContent="center" alignItems="center">
        <Text color="$textPrimary" fontSize={18} fontWeight="bold" textAlign="center">
          {title}
        </Text>
      </XStack>

      {/* 右侧按钮 */}
      <XStack alignItems="center" minWidth={40} justifyContent="flex-end">
        {buttonsToRender.length > 0 ? (
          <XStack gap="$2">
            {buttonsToRender.map((button, index) => (
              <TouchableOpacity key={index} hitSlop={10} onPress={button.onPress}>
                {button.icon}
              </TouchableOpacity>
            ))}
          </XStack>
        ) : (
          <XStack width={40} /> // 占位，确保标题能正确居中
        )}
      </XStack>
    </XStack>
  )
}
