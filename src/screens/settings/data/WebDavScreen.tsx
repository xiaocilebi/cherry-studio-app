import { useNavigation } from '@react-navigation/native'
import { ChevronRight, CloudUpload, HardDriveDownload, HardDriveUpload } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, useTheme, XStack, YStack } from 'tamagui'

import { SettingContainer, SettingGroup, SettingGroupTitle, SettingRow } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { CustomSwitch } from '@/components/ui/Switch'
import { NavigationProps } from '@/types/naviagate'

export default function WebDavScreen() {
  const theme = useTheme()
  const navigation = useNavigation<NavigationProps>()
  const { t } = useTranslation()

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <HeaderBar title={t('settings.webdav.title')}  />
      <ScrollView flex={1} backgroundColor="$background">
        <SettingContainer>
          <YStack gap={24} flex={1} paddingHorizontal="$4" />

          {/* WebDAV Config entry */}
          <YStack gap={24} flex={1}>
            <SettingGroupTitle>{t('settings.webdav.config.title')}</SettingGroupTitle>
            <SettingGroup>
              <SettingRow onPress={() => navigation.navigate('WebDavConfigScreen')}>
                <XStack alignItems="center" gap={12}>
                  <CloudUpload size={24} />
                  <Text fontSize="$5">{t('settings.webdav.config.title')}</Text>
                </XStack>
                <ChevronRight size={24} color="$colorFocus" />
              </SettingRow>
            </SettingGroup>
          </YStack>

          {/* Backup Settings */}
          <YStack gap={24} flex={1}>
            <SettingGroupTitle>{t('settings.webdav.backup.title')}</SettingGroupTitle>
            <SettingGroup>
              <SettingRow>
                <XStack alignItems="center" gap={12}>
                  <HardDriveUpload size={24} />
                  <Text fontSize="$5">{t('settings.webdav.backup.to_webdav')}</Text>
                </XStack>
              </SettingRow>
              <SettingRow>
                <XStack alignItems="center" gap={12}>
                  <HardDriveDownload size={24} />
                  <Text fontSize="$5">{t('settings.webdav.backup.from_webdav')}</Text>
                </XStack>
              </SettingRow>
              <SettingRow>
                <XStack alignItems="center" gap={12}>
                  <Text fontSize="$5">{t('settings.webdav.backup.auto_backup')}</Text>
                </XStack>
                <CustomSwitch />
              </SettingRow>
              <SettingRow>
                <XStack alignItems="center" gap={12}>
                  <Text fontSize="$5">{t('settings.webdav.backup.slim_backup')}</Text>
                </XStack>
                <CustomSwitch />
              </SettingRow>
              <SettingRow>
                <XStack alignItems="center" gap={12}>
                  <Text fontSize="$5">{t('settings.webdav.backup.max_backups')}</Text>
                </XStack>
                <XStack alignItems="center" gap={12}>
                  <Text fontSize="$5">{t('settings.webdav.backup.unlimited')}</Text>
                  <ChevronRight size={24} color="$colorFocus" />
                </XStack>
              </SettingRow>
            </SettingGroup>
          </YStack>
        </SettingContainer>
      </ScrollView>
    </SafeAreaContainer>
  )
}
