import { useNavigation } from '@react-navigation/native'
import { ArrowUpRight, Copyright, Github, Globe, Mail, Rss } from '@tamagui/lucide-icons'
import * as ExpoLinking from 'expo-linking'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text, useTheme, XStack, YStack } from 'tamagui'

import { SettingContainer, SettingGroup, SettingRow } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { loggerService } from '@/services/LoggerService'
const logger = loggerService.withContext('AboutScreen')

export default function AboutScreen() {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigation = useNavigation()

  const openLink = async (url: string) => {
    try {
      await ExpoLinking.openURL(url)
    } catch (error) {
      logger.error('Failed to open link:', error)
    }
  }

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <HeaderBar
        title={t('settings.about.header')}
        
        rightButton={{
          icon: <Github size={24} />,
          onPress: async () => await openLink('https://github.com/CherryHQ/cherry-studio-app')
        }}
      />
      <SettingContainer>
        <YStack gap={24} flex={1}>
          {/* Logo and Description */}
          <SettingGroup>
            <SettingRow gap={18}>
              <Image height={70} width={70} borderRadius={41} source={require('@/assets/images/favicon.png')} />
              <YStack gap={5} paddingVertical={4} flex={1}>
                <Text fontWeight="bold" fontSize={22}>
                  {t('common.cherry_studio')}
                </Text>
                <Text fontSize={12} numberOfLines={0} flexWrap="wrap">
                  {t('common.cherry_studio_description')}
                </Text>
                <Text
                  borderWidth={0.42}
                  borderRadius={25.37}
                  backgroundColor="$gray9"
                  alignSelf="flex-start"
                  paddingHorizontal={8}
                  paddingVertical={2}>
                  v0.0.1
                </Text>
              </YStack>
            </SettingRow>
          </SettingGroup>

          <SettingGroup>
            <SettingRow onPress={async () => await openLink('https://github.com/CherryHQ/cherry-studio-app/releases/')}>
              <XStack alignItems="center" gap={10}>
                <Rss size={20} />
                <Text>{t('settings.about.releases.title')}</Text>
              </XStack>
              <ArrowUpRight size={16} />
            </SettingRow>
            <SettingRow onPress={async () => await openLink('https://www.cherry-ai.com/')}>
              <XStack alignItems="center" gap={10}>
                <Globe size={20} />
                <Text>{t('settings.about.website.title')}</Text>
              </XStack>
              <ArrowUpRight size={16} />
            </SettingRow>
            <SettingRow onPress={async () => await openLink('https://github.com/CherryHQ/cherry-studio-app/issues/')}>
              <XStack alignItems="center" gap={10}>
                <Github size={20} />
                <Text>{t('settings.about.feedback.title')}</Text>
              </XStack>
              <ArrowUpRight size={16} />
            </SettingRow>
            <SettingRow
              onPress={async () => await openLink('https://github.com/CherryHQ/cherry-studio/blob/main/LICENSE/')}>
              <XStack alignItems="center" gap={10}>
                <Copyright size={20} />
                <Text>{t('settings.about.license.title')}</Text>
              </XStack>
              <ArrowUpRight size={16} />
            </SettingRow>
            <SettingRow onPress={async () => await openLink('https://docs.cherry-ai.com/contact-us/questions/')}>
              <XStack alignItems="center" gap={10}>
                <Mail size={20} />
                <Text>{t('settings.about.contact.title')}</Text>
              </XStack>
              <ArrowUpRight size={16} />
            </SettingRow>
          </SettingGroup>
        </YStack>
      </SettingContainer>
    </SafeAreaContainer>
  )
}
