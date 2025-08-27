import { useNavigation } from '@react-navigation/native'
import { ChevronRight, Cloud, Globe, HardDrive, Info, Package, Settings2 } from '@tamagui/lucide-icons'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { Avatar, Text, useTheme, XStack, YStack } from 'tamagui'

import { SettingContainer, SettingGroup, SettingGroupTitle, SettingRow } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useSettings } from '@/hooks/useSettings'
import { NavigationProps } from '@/types/naviagate'
import { haptic } from '@/utils/haptic'

interface SettingItemConfig {
  title: string
  screen: string
  icon: React.ReactElement | string
}

interface SettingGroupConfig {
  title?: string
  items: SettingItemConfig[]
}

export default function SettingsScreen() {
  const { t } = useTranslation()
  const { avatar, userName } = useSettings()
  const navigation = useNavigation<NavigationProps>()

  // 处理侧滑手势
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

  const settingsItems: SettingGroupConfig[] = [
    {
      items: [
        {
          title: userName,
          screen: 'PersonalScreen',
          icon: avatar
        }
      ]
    },
    {
      title: t('settings.modelAndService'),
      items: [
        {
          title: t('settings.provider.title'),
          screen: 'ProvidersScreen',
          icon: <Cloud size={24} />
        },
        {
          title: t('settings.assistant.title'),
          screen: 'AssistantSettingsScreen',
          icon: <Package size={24} />
        },
        {
          title: t('settings.websearch.title'),
          screen: 'WebSearchSettingsScreen',
          icon: <Globe size={24} />
        }
      ]
    },
    {
      title: t('settings.title'),
      items: [
        {
          title: t('settings.general.title'),
          screen: 'GeneralSettingsScreen',
          icon: <Settings2 size={24} />
        },
        {
          title: t('settings.data.title'),
          screen: 'DataSettingsScreen',
          icon: <HardDrive size={24} />
        }
      ]
    },
    {
      title: t('settings.dataAndSecurity'),
      items: [
        {
          title: t('settings.about.title'),
          screen: 'AboutScreen',
          icon: <Info size={24} />
        }
      ]
    }
  ]

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <View collapsable={false} style={{ flex: 1 }}>
          <HeaderBar title={t('settings.title')} />

          <SettingContainer>
            <YStack gap={24} flex={1}>
              {settingsItems.map((group, index) => (
                <Group key={index} title={group.title}>
                  {group.items.map((item, index) => (
                    <SettingItem key={index} title={item.title} screen={item.screen} icon={item.icon} />
                  ))}
                </Group>
              ))}
            </YStack>
          </SettingContainer>
        </View>
      </GestureDetector>
    </SafeAreaContainer>
  )
}

interface SettingGroupProps {
  title?: string
  children: React.ReactNode
}

function Group({ title, children }: SettingGroupProps) {
  return (
    <YStack gap={8}>
      {title && <SettingGroupTitle>{title}</SettingGroupTitle>}
      <SettingGroup>{children}</SettingGroup>
    </YStack>
  )
}

interface SettingItemProps {
  title: string
  screen: string
  icon: React.ReactElement | string
}

function SettingItem({ title, screen, icon }: SettingItemProps) {
  const navigation = useNavigation<NavigationProps>()
  const theme = useTheme()

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return (
        <Avatar circular size={40}>
          <Avatar.Image accessibilityLabel={title} src={icon || require('@/assets/images/favicon.png')} />
          <Avatar.Fallback delayMs={600} backgroundColor={theme.blue10} />
        </Avatar>
      )
    }

    return icon
  }

  return (
    <SettingRow onPress={() => navigation.navigate(screen as any)}>
      <XStack alignItems="center" gap={12}>
        {renderIcon()}
        <YStack>
          <Text fontWeight="bold">{title}</Text>
        </YStack>
      </XStack>
      <ChevronRight size={20} color="$textSecondary" />
    </SettingRow>
  )
}
