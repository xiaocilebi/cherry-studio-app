import { ArrowLeft } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Text, XStack } from 'tamagui'

import { useNavigation } from '@/hooks/useNavigation'

interface HeaderBarProps {
  title: string
  onBackPress?: () => void
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

export function HeaderBar({ title, rightButton, rightButtons, showBackButton = true }: HeaderBarProps) {
  const buttonsToRender = rightButtons || (rightButton ? [rightButton] : [])
  const { navigateBack } = useNavigation()

  return (
    <XStack paddingHorizontal="$4" alignItems="center" height={44} justifyContent="space-between">
      {/* 左侧按钮 */}
      <XStack alignItems="center" minWidth={40}>
        {showBackButton ? (
          <Button size="$2" chromeless circular icon={<ArrowLeft size={24} />} onPress={navigateBack} />
        ) : (
          <XStack width={40} /> // 占位，确保标题能正确居中
        )}
      </XStack>

      {/* 居中标题 */}
      <XStack flex={1} justifyContent="center" alignItems="center">
        <Text fontSize="$6" fontWeight="bold" textAlign="center">
          {title}
        </Text>
      </XStack>

      {/* 右侧按钮 */}
      <XStack alignItems="center" minWidth={40} justifyContent="flex-end">
        {buttonsToRender.length > 0 ? (
          <XStack gap="$2">
            {buttonsToRender.map((button, index) => (
              <Button key={index} size="$2" chromeless circular icon={button.icon} onPress={button.onPress} />
            ))}
          </XStack>
        ) : (
          <XStack width={40} /> // 占位，确保标题能正确居中
        )}
      </XStack>
    </XStack>
  )
}
