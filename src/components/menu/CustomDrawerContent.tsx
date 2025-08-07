import { DrawerContentComponentProps, DrawerItemList } from '@react-navigation/drawer'
import { ArrowUpRight, Settings } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { Avatar, Button, Stack, Text, useTheme, View, XStack, YStack } from 'tamagui'

import { MenuTabContent } from '@/components/menu/MenuTabContent'
import { GroupedTopicList } from '@/components/topic/GroupTopicList'
import { BlurView } from '@/components/ui/BlurView'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useExternalAssistants } from '@/hooks/useAssistant'
import { useSettings } from '@/hooks/useSettings'
import { useTopics } from '@/hooks/useTopic'
import { useIsDark } from '@/utils'
import { haptic } from '@/utils/haptic'

import { MarketIcon } from '../icons/MarketIcon'
import { UnionIcon } from '../icons/UnionIcon'
import { SettingDivider } from '../settings'

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { t } = useTranslation()
  const isDark = useIsDark()
  const theme = useTheme()
  const { theme: appTheme } = useSettings()

  const { topics, isLoading: isLoadingTopics } = useTopics()
  const { isLoading: isLoadingAssistants } = useExternalAssistants()

  const handleRoute = (route: string) => {
    props.navigation.navigate('Main', { screen: route })
    props.navigation.closeDrawer()
  }

  const handleNavigateTopicScreen = () => {
    haptic(ImpactFeedbackStyle.Medium)
    handleRoute('TopicScreen')
  }

  const handleNavigateAssistantMarketScreen = () => {
    haptic(ImpactFeedbackStyle.Medium)
    handleRoute('AssistantMarketScreen')
  }

  const handleNavigateAssistantScreen = () => {
    haptic(ImpactFeedbackStyle.Medium)
    handleRoute('AssistantScreen')
  }

  if (isLoadingTopics || isLoadingAssistants) {
    return (
      <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  return (
    <YStack flex={1}>
      <BlurView
        style={{
          flex: 1,
          backgroundColor:
            appTheme === 'dark' ? '#121213ff' : appTheme === 'light' ? '#f7f7f7ff' : isDark ? '#121213ff' : '#f7f7f7ff'
        }}
        intensity={10}
        tint="default">
        <YStack gap={10} flex={1} padding={20}>
          <YStack>
            <DrawerItemList {...props} />
          </YStack>

          <YStack backgroundColor="transparent" paddingTop={40} flex={1} gap={10}>
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingVertical={10}
              onPress={handleNavigateAssistantMarketScreen}>
              <XStack gap={10} alignItems="center" justifyContent="center">
                <MarketIcon size={20} />
                <Text color={theme.color}>{t('assistants.market.title')}</Text>
              </XStack>
              <ArrowUpRight size={20} color={theme.color} />
            </XStack>

            <XStack justifyContent="space-between" paddingVertical={10} onPress={handleNavigateAssistantScreen}>
              <XStack gap={10} alignItems="center" justifyContent="center">
                <UnionIcon size={20} />
                <Text color={theme.color}>{t('assistants.market.my_assistant')}</Text>
              </XStack>
              <ArrowUpRight size={20} color={theme.color} />
            </XStack>
            <Stack paddingVertical={20}>
              <SettingDivider />
            </Stack>
            <MenuTabContent title={t('menu.topic.recent')} onSeeAllPress={handleNavigateTopicScreen}>
              <View flex={1} minHeight={200}>
                {/* 只显示7条 */}
                <GroupedTopicList topics={topics.slice(0, 7)} />
              </View>
            </MenuTabContent>
          </YStack>
        </YStack>

        <XStack paddingHorizontal={20} paddingBottom={40} justifyContent="space-between" alignItems="center">
          <XStack gap={10} alignItems="center">
            <Avatar circular size={48}>
              {/* todo: set user avatar */}
              <Avatar.Image accessibilityLabel="Cam" src={require('@/assets/images/favicon.png')} />
              <Avatar.Fallback delayMs={600} backgroundColor={theme.blue10} />
            </Avatar>
            <Text color={theme.color}>{t('common.cherry_studio')}</Text>
          </XStack>
          <Button
            icon={<Settings size={24} color={theme.color} />}
            chromeless
            onPress={() => handleRoute('SettingsScreen')}
          />
        </XStack>
      </BlurView>
    </YStack>
  )
}
