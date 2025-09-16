import { ChevronRight, HardDriveDownload, HardDriveUpload, LogOut, RefreshCcw, UserPlus } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, XStack, YStack } from 'tamagui'

import {
  SettingContainer,
  SettingGroup,
  SettingGroupTitle,
  SettingRow,
  SettingRowRightArrow
} from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'

export default function NutstoreLoginScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // State to track login status

  const { t } = useTranslation()

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <HeaderBar title={t('settings.nutstore.nutstore')} />
      <ScrollView flex={1} backgroundColor="$background">
        <SettingContainer>
          {isLoggedIn ? (
            <YStack gap={24} flex={1}>
              <SettingGroupTitle>{t('settings.nutstore.title')}</SettingGroupTitle>
              <SettingGroup>
                <SettingRow>
                  <XStack alignItems="center" gap={12}>
                    <Text fontSize="$5">{t('settings.nutstore.username')}</Text>
                  </XStack>
                  <XStack alignItems="center" gap={12}>
                    <Text fontSize="$5">Cherry@gmail.com</Text>
                    <RefreshCcw size={24} color="$blue9" />
                  </XStack>
                </SettingRow>
                <SettingRow>
                  <XStack alignItems="center" gap={12}>
                    <LogOut size={24} color="red" />
                    <Text fontSize="$5" color="red">
                      {t('settings.nutstore.logout')}
                    </Text>
                  </XStack>
                </SettingRow>
              </SettingGroup>
              <SettingGroupTitle>{t('settings.webdav.backup.title')}</SettingGroupTitle>
              <SettingGroup>
                <SettingRow>
                  <XStack alignItems="center" gap={12}>
                    <HardDriveUpload size={24} />
                    <Text fontSize="$5">{t('settings.nutstore.to_nutstore')}</Text>
                  </XStack>
                </SettingRow>
                <SettingRow>
                  <XStack alignItems="center" gap={12}>
                    <HardDriveDownload size={24} />
                    <Text fontSize="$5">{t('settings.nutstore.from_nutstore')}</Text>
                  </XStack>
                </SettingRow>
                <SettingRow>
                  <XStack alignItems="center" gap={12}>
                    <Text fontSize="$5">{t('settings.nutstore.backupPath')}</Text>
                  </XStack>
                  <XStack alignItems="center" gap={12}>
                    <Text fontSize="$5">/cherry-studio</Text>
                    <SettingRowRightArrow />
                  </XStack>
                </SettingRow>
                <SettingRow>
                  <XStack alignItems="center" gap={12}>
                    <Text fontSize="$5">{t('settings.webdav.backup.auto_backup')}</Text>
                  </XStack>
                  <XStack alignItems="center" gap={12}>
                    <Text fontSize="$5">1 min</Text>
                    <SettingRowRightArrow />
                  </XStack>
                </SettingRow>
                <SettingRow onPress={() => {}}>
                  <XStack alignItems="center" gap={12}>
                    <Text fontSize="$5">{t('settings.nutstore.backupStatus')}</Text>
                  </XStack>
                  <XStack alignItems="center" gap={8}>
                    <Text fontSize="$5">Last Backup: 12:44:11</Text>
                  </XStack>
                </SettingRow>
              </SettingGroup>
            </YStack>
          ) : (
            <YStack gap={24} flex={1}>
              <SettingGroupTitle>{t('settings.nutstore.title')}</SettingGroupTitle>
              <SettingGroup>
                <SettingRow onPress={() => setIsLoggedIn(true)}>
                  <XStack alignItems="center" gap={12}>
                    <UserPlus size={24} />
                    <Text fontSize="$5">{t('settings.nutstore.login')}</Text>
                  </XStack>
                  <SettingRowRightArrow />
                </SettingRow>
              </SettingGroup>
            </YStack>
          )}
        </SettingContainer>
      </ScrollView>
    </SafeAreaContainer>
  )
}
