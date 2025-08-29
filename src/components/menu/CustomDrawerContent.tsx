import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { ChevronRight, Settings } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { Avatar, Button, Stack, Text, useTheme, View, XStack, YStack } from 'tamagui'

import { MenuTabContent } from '@/components/menu/MenuTabContent'
import { GroupedTopicList } from '@/components/topic/GroupTopicList'
import { useSettings } from '@/hooks/useSettings'
import { useTopics } from '@/hooks/useTopic'
import { haptic } from '@/utils/haptic'

import { MarketIcon } from '../icons/MarketIcon'
import { UnionIcon } from '../icons/UnionIcon'
import { SettingDivider } from '../settings'

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const { avatar, userName } = useSettings()

  const { topics } = useTopics()

  const handleNavigateTopicScreen = () => {
    haptic(ImpactFeedbackStyle.Medium)
    props.navigation.navigate('TopicScreen')
  }

  const handleNavigateAssistantMarketScreen = () => {
    haptic(ImpactFeedbackStyle.Medium)
    props.navigation.navigate('Assistant', { screen: 'AssistantMarketScreen' })
  }

  const handleNavigateAssistantScreen = () => {
    haptic(ImpactFeedbackStyle.Medium)
    props.navigation.navigate('Assistant', { screen: 'AssistantScreen' })
  }

  const handleNavigateSettingsScreen = () => {
    haptic(ImpactFeedbackStyle.Medium)
    props.navigation.navigate('Settings', { screen: 'SettingsScreen' })
  }

  return (
    <YStack flex={1}>
      <YStack gap={10} flex={1} padding={20}>
        <YStack backgroundColor="transparent" flex={1} gap={10} paddingTop={Platform.OS === 'ios' ? 30 : 0}>
          <XStack
            justifyContent="space-between"
            alignItems="center"
            paddingVertical={10}
            onPress={handleNavigateAssistantMarketScreen}>
            <XStack gap={10} alignItems="center" justifyContent="center">
              <MarketIcon size={20} />
              <Text color={theme.color}>{t('assistants.market.title')}</Text>
            </XStack>
            <ChevronRight size={20} color={theme.color} />
          </XStack>

          <XStack justifyContent="space-between" paddingVertical={10} onPress={handleNavigateAssistantScreen}>
            <XStack gap={10} alignItems="center" justifyContent="center">
              <UnionIcon size={20} />
              <Text color={theme.color}>{t('assistants.market.my_assistant')}</Text>
            </XStack>
            <ChevronRight size={20} color={theme.color} />
          </XStack>
          <Stack paddingVertical={20}>
            <SettingDivider />
          </Stack>
          <MenuTabContent title={t('menu.topic.recent')} onSeeAllPress={handleNavigateTopicScreen}>
            <View flex={1} minHeight={200}>
              {/* 只显示7条 */}
              {topics.length > 0 && <GroupedTopicList topics={topics.slice(0, 7)} enableScroll={false} />}
            </View>
          </MenuTabContent>
        </YStack>
      </YStack>

      <Stack padding={20}>
        <SettingDivider />
      </Stack>

      <XStack paddingHorizontal={20} paddingBottom={40} justifyContent="space-between" alignItems="center">
        <XStack gap={10} alignItems="center">
          <Avatar circular size={48}>
            <Avatar.Image accessibilityLabel="Cam" src={avatar || require('@/assets/images/favicon.png')} />
            <Avatar.Fallback delayMs={600} backgroundColor={theme.blue10} />
          </Avatar>
          <Text color={theme.color}>{userName || t('common.cherry_studio')}</Text>
        </XStack>
        <Button icon={<Settings size={24} color={theme.color} />} chromeless onPress={handleNavigateSettingsScreen} />
      </XStack>
    </YStack>
  )
}
