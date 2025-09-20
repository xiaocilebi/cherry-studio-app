import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Settings2 } from '@/componentsV2/icons/LucideIcon'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useSettings } from '@/hooks/useSettings'
import { useTopics } from '@/hooks/useTopic'
import { haptic } from '@/utils/haptic'

import { MarketIcon, UnionIcon } from '@/componentsV2/icons'
import {SafeAreaContainer} from '@/componentsV2'
import { Divider } from 'heroui-native'
import { MenuTabContent } from './MenuTabContent'
import YStack from '@/componentsV2/layout/YStack'
import XStack from '@/componentsV2/layout/XStack'
import Text from '@/componentsV2/base/Text'
import RowRightArrow from '@/componentsV2/layout/Row/RowRightArrow'
import { TopicList } from '../TopicList'
import Image from '@/componentsV2/base/Image'
import PressableRow from '@/componentsV2/layout/PressableRow'
import { IconButton } from '@/componentsV2/base/IconButton'

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { t } = useTranslation()
  const { avatar, userName } = useSettings()

  const { topics } = useTopics()

  const handleNavigateTopicScreen = () => {
    haptic(ImpactFeedbackStyle.Medium)
    props.navigation.navigate('Home', { screen: 'TopicScreen' })
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
    props.navigation.navigate('Home', { screen: 'SettingsScreen' })
  }

  const handleNavigatePersonalScreen = () => {
    haptic(ImpactFeedbackStyle.Medium)
    props.navigation.navigate('Home', { screen: 'AboutSettings', params: { screen: 'PersonalScreen' } })
  }

  const handleNavigateChatScreen = (topicId: string) => {
    haptic(ImpactFeedbackStyle.Medium)
    props.navigation.navigate('Home', { screen: 'ChatScreen', params: { topicId: topicId } })
  }

  return (
    <SafeAreaContainer>
      <YStack className="gap-2.5 flex-1">
        <YStack className="gap-1.5 px-2.5">
          <PressableRow
            className="flex-row justify-between items-center py-2.5 px-2.5 rounded-lg"
            onPress={handleNavigateAssistantMarketScreen}
          >
            <XStack className="gap-2.5 items-center justify-center">
              <MarketIcon size={24} />
              <Text className="text-base ">
                {t('assistants.market.title')}
              </Text>
            </XStack>
            <RowRightArrow />
          </PressableRow>

          <PressableRow
            className="flex-row justify-between items-center py-2.5 px-2.5 rounded-lg"
            onPress={handleNavigateAssistantScreen}
          >
            <XStack className="gap-2.5 items-center justify-center">
              <UnionIcon size={24} />
              <Text className="text-base ">
                {t('assistants.market.my_assistant')}
              </Text>
            </XStack>
            <RowRightArrow />
          </PressableRow>
          <YStack className="px-2.5">
            <Divider />
          </YStack>
        </YStack>

        <MenuTabContent title={t('menu.topic.recent')} onSeeAllPress={handleNavigateTopicScreen}>
          <YStack className="flex-1 min-h-[200px]">
            {topics.length > 0 && (
              <TopicList topics={topics} enableScroll={true} handleNavigateChatScreen={handleNavigateChatScreen} />
            )}
          </YStack>
        </MenuTabContent>
      </YStack>

      <YStack className="px-5 pb-2.5">
        <Divider />
      </YStack>

      <XStack className="justify-between items-center">
        <PressableRow
          className="gap-2.5 items-center"
          onPress={handleNavigatePersonalScreen}
        >
          <Image
            className="w-12 h-12 rounded-full"
            source={avatar ? { uri: avatar } : require('@/assets/images/favicon.png')}
          />
          <Text className="text-base">
            {userName || t('common.cherry_studio')}
          </Text>
        </PressableRow>
        <IconButton icon={<Settings2 size={24}  />} onPress={handleNavigateSettingsScreen} style={{paddingRight: 16}}/>

      </XStack>
    </SafeAreaContainer>
  )
}
