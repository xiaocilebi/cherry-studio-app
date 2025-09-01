import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, XStack, YStack } from 'tamagui'

interface MenuTabContentProps {
  title: string
  onSeeAllPress?: () => void
  children?: React.ReactNode
}

export function MenuTabContent({ title, onSeeAllPress, children }: MenuTabContentProps) {
  const { t } = useTranslation()

  return (
    <YStack flex={1} gap={10}>
      <YStack paddingHorizontal={20}>
        <XStack justifyContent="space-between" alignItems="center">
          <XStack paddingVertical={10} gap={8} alignItems="center">
            <Text>{title}</Text>
          </XStack>
          <Text color="$textLink" onPress={onSeeAllPress} pressStyle={{ opacity: 0.6 }}>
            {t('menu.see_all')}
          </Text>
        </XStack>
      </YStack>
      {children}
    </YStack>
  )
}
