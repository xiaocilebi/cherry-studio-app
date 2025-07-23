import { DrawerContentComponentProps, DrawerItemList } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'
import { ArrowUpRight, Settings } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { Avatar, Button, Stack, Text, View, XStack, YStack } from 'tamagui'

import { MenuTabContent } from '@/components/menu/MenuTabContent'
import { GroupedTopicList } from '@/components/topic/GroupTopicList'
import { BlurView } from '@/components/ui/BlurView'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useExternalAssistants } from '@/hooks/useAssistant'
import { useTopics } from '@/hooks/useTopic'
import { NavigationProps } from '@/types/naviagate'
import { useIsDark } from '@/utils'

import { MarketIcon } from '../icons/MarketIcon'
import { UnionIcon } from '../icons/UnionIcon'
import { SettingDivider } from '../settings'

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { t } = useTranslation()
  const isDark = useIsDark()
  const navigation = useNavigation<NavigationProps>()

  const { topics, isLoading: isLoadingTopics } = useTopics()
  const { isLoading: isLoadingAssistants } = useExternalAssistants()

  const handleTopicSeeAll = () => {
    props.navigation.navigate('Main', { screen: 'TopicScreen' })
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
      <BlurView style={{ flex: 1, backgroundColor: isDark ? '#000000bb' : '#ffffffbb' }} intensity={60} tint="default">
        <YStack gap={10} flex={1} padding={20}>
          <YStack>
            <DrawerItemList {...props} />
          </YStack>

          <YStack backgroundColor="transparent" paddingTop={40} flex={1} gap={10}>
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingVertical={10}
              onPress={() => navigation.navigate('AssistantMarketScreen')}>
              <XStack gap={10} alignItems="center" justifyContent="center">
                <MarketIcon size={20} />
                <Text>{t('assistants.market.title')}</Text>
              </XStack>
              <ArrowUpRight size={20} />
            </XStack>

            <XStack
              justifyContent="space-between"
              paddingVertical={10}
              onPress={() => navigation.navigate('AssistantScreen')}>
              <XStack gap={10} alignItems="center" justifyContent="center">
                <UnionIcon size={20} />
                <Text>{t('assistants.market.my_assistant')}</Text>
              </XStack>
              <ArrowUpRight size={20} />
            </XStack>
            <Stack paddingVertical={20}>
              <SettingDivider />
            </Stack>
            <MenuTabContent title={t('menu.topic.recent')} onSeeAllPress={handleTopicSeeAll}>
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
              <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
            </Avatar>
            <Text>{t('common.cherry_studio')}</Text>
          </XStack>
          <Button
            icon={<Settings size={24} />}
            chromeless
            onPress={() => {
              props.navigation.navigate('Main', { screen: 'SettingsScreen' })
              props.navigation.closeDrawer()
            }}
          />
        </XStack>
      </BlurView>
    </YStack>
  )
}
