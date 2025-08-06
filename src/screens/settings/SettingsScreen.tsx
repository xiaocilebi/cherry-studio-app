import { useNavigation } from '@react-navigation/native'
import { ChevronRight, Cloud, Globe, HardDrive, Info, Package, Settings } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, useTheme, XStack, YStack } from 'tamagui'

import { SettingContainer, SettingGroup, SettingGroupTitle, SettingRow } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { NavigationProps } from '@/types/naviagate'

interface SettingItemConfig {
  title: string
  screen: string
  icon: React.ReactElement
}

interface SettingGroupConfig {
  title: string
  items: SettingItemConfig[]
}

export default function SettingsScreen() {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigation = useNavigation<NavigationProps>()

  const settingsItems: SettingGroupConfig[] = [
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
      <ScrollView flex={1} backgroundColor="$colorTransparent">
        <SettingContainer>
          <YStack gap={24} flex={1}>
            {settingsItems.map(group => (
              <Group key={group.title} title={group.title}>
                {group.items.map(item => (
                  <SettingItem key={item.title} title={item.title} screen={item.screen} icon={item.icon} />
                ))}
              </Group>
            ))}
          </YStack>
        </SettingContainer>
      </ScrollView>
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
  icon: React.ReactElement
}

function SettingItem({ title, screen, icon }: SettingItemProps) {
  const navigation = useNavigation<NavigationProps>()
  return (
    <SettingRow onPress={() => navigation.navigate(screen as any)}>
      <XStack alignItems="center" gap={12}>
        {icon}
        <YStack>
          <Text fontSize="$5">{title}</Text>
        </YStack>
      </XStack>
      <ChevronRight size={24} color="$colorFocus" />
    </SettingRow>
  )
}
