import { useNavigation } from '@react-navigation/native'
import { ChevronRight, Cloud, Globe, HardDrive, Info, Package, Settings } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, Text, useTheme, XStack, YStack } from 'tamagui'

import { SettingContainer, SettingGroup, SettingGroupTitle, SettingRow } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useSettings } from '@/hooks/useSettings'
import { NavigationProps } from '@/types/naviagate'
import { useIsDark } from '@/utils'

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
  const navigation = useNavigation<NavigationProps>()
  const { avatar, userName } = useSettings()

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
          icon: <Settings size={24} />
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
      <HeaderBar title={t('settings.title')} onBackPress={() => navigation.goBack()} />

      <SettingContainer>
        <YStack gap={24} flex={1}>
          {settingsItems.map((group, index) => (
            <Group key={index} title={group.title ?? ''}>
              {group.items.map(item => (
                <SettingItem key={item.title} title={item.title} screen={item.screen} icon={item.icon} />
              ))}
            </Group>
          ))}
        </YStack>
      </SettingContainer>
    </SafeAreaContainer>
  )
}

interface SettingGroupProps {
  title: string
  children: React.ReactNode
}

function Group({ title, children }: SettingGroupProps) {
  return (
    <YStack gap={8}>
      <SettingGroupTitle>{title}</SettingGroupTitle>
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
  const isDark = useIsDark()
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
