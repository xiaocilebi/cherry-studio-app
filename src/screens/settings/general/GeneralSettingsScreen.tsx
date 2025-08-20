import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ChevronRight } from '@tamagui/lucide-icons'
import { useCallback, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, useTheme, XStack, YStack } from 'tamagui'

import { SettingContainer, SettingGroup, SettingGroupTitle, SettingRow } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { CustomSwitch } from '@/components/ui/Switch'
import { languagesOptions } from '@/config/languages'
import { themeOptions } from '@/config/theme'
import { NavigationProps } from '@/types/naviagate'

export default function GeneralSettingsScreen() {
  const { t, i18n } = useTranslation()

  const [language, setLanguage] = useState('zh-CN')
  const [currentTheme, setCurrentTheme] = useState('system')

  const theme = useTheme()
  const navigation = useNavigation<NavigationProps>()

  const handleFocus = useCallback(() => {
    const loadSettings = async () => {
      const storedLanguage = await AsyncStorage.getItem('language')

      if (storedLanguage) {
        setLanguage(storedLanguage)
      } else {
        setLanguage(i18n.language)
      }

      const storedTheme = await AsyncStorage.getItem('theme')

      if (storedTheme) {
        setCurrentTheme(storedTheme)
      }
    }

    loadSettings()
  }, [i18n.language])

  useFocusEffect(handleFocus)

  const getCurrentLanguage = () => {
    const currentLang = languagesOptions.find(item => item.value === language)
    return currentLang ? `${currentLang.flag} ${currentLang.label}` : 'English'
  }

  const getCurrentTheme = () => {
    const currentThemeOption = themeOptions.find(item => item.value === currentTheme)
    return currentThemeOption ? t(currentThemeOption.label) : t('settings.general.theme.auto')
  }

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <HeaderBar title={t('settings.general.title')} />
      <SettingContainer>
        <YStack gap={24} flex={1}>
          {/* Display settings */}
          <YStack gap={8}>
            <SettingGroupTitle>{t('settings.general.display.title')}</SettingGroupTitle>
            <SettingGroup>
              <SettingRow onPress={() => navigation.navigate('Settings',{screen:'ThemeSettingsScreen'})}>
                <XStack alignItems="center">
                  <Text fontSize="$5">{t('settings.general.theme.title')}</Text>
                </XStack>
                <XStack alignItems="center" space="$2">
                  <Text color="$colorFocus">{getCurrentTheme()}</Text>
                  <ChevronRight size={24} color="$colorFocus" />
                </XStack>
              </SettingRow>
            </SettingGroup>
          </YStack>

          {/* General settings */}
          <YStack gap={8}>
            <SettingGroupTitle>{t('settings.general.title')}</SettingGroupTitle>
            <SettingGroup>
              <SettingRow onPress={() => navigation.navigate('Settings',{screen:'LanguageChangeScreen'})}>
                <XStack alignItems="center">
                  <Text fontSize="$5">{t('settings.general.language.title')}</Text>
                </XStack>
                <XStack alignItems="center" space="$2">
                  <Text color="$colorFocus">{getCurrentLanguage()}</Text>
                  <ChevronRight size={24} color="$colorFocus" />
                </XStack>
              </SettingRow>
            </SettingGroup>
          </YStack>

          {/* Privacy settings */}
          <YStack gap={8}>
            <SettingGroupTitle>{t('settings.general.display.title')}</SettingGroupTitle>
            <SettingGroup>
              <SettingRow>
                <XStack alignItems="center">
                  <Text fontSize="$5">{t('settings.general.privacy.anonymous')}</Text>
                </XStack>
                <CustomSwitch />
              </SettingRow>
            </SettingGroup>
          </YStack>
        </YStack>
      </SettingContainer>
    </SafeAreaContainer>
  )
}
