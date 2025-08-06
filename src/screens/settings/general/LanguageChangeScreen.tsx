import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, useTheme, XStack, YStack } from 'tamagui'

import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { languagesOptions } from '@/config/languages'
import { NavigationProps } from '@/types/naviagate'

export default function LanguageChangeScreen() {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const navigation = useNavigation<NavigationProps>()
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language)

  useEffect(() => {
    const fetchCurrentLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('language')

      if (storedLanguage) {
        setCurrentLanguage(storedLanguage)
      }
    }

    fetchCurrentLanguage()
  }, [])

  const changeLanguage = async (langCode: string) => {
    await AsyncStorage.setItem('language', langCode)
    await i18n.changeLanguage(langCode)
    setCurrentLanguage(langCode)
    navigation.goBack()
  }

  return (
    <SafeAreaContainer style={{ flex: 1, backgroundColor: theme.background.val }}>
      <HeaderBar title={t('settings.general.language.title')} onBackPress={() => navigation.goBack()} />
      <SettingContainer>
        <YStack flex={1} space={12} paddingHorizontal={16}>
          {languagesOptions.map(opt => (
            <XStack
              key={opt.value}
              onPress={() => changeLanguage(opt.value)}
              alignItems="center"
              justifyContent="space-between"
              padding={16}
              borderRadius={8}
              backgroundColor={theme['$color3']}
              hoverStyle={{ backgroundColor: theme['$color4'] }}
              pressStyle={{ opacity: 0.7 }}>
              <XStack alignItems="center" space>
                <Text fontSize={16}>{opt.flag}</Text>
                <Text fontSize={16}>{opt.label}</Text>
              </XStack>

              <XStack
                width={20}
                height={20}
                borderRadius={10}
                borderWidth={2}
                borderColor={currentLanguage === opt.value ? theme.color.val : theme['$color8']}
                alignItems="center"
                justifyContent="center">
                {currentLanguage === opt.value && (
                  <XStack width={10} height={10} borderRadius={5} backgroundColor={theme.color.val} />
                )}
              </XStack>
            </XStack>
          ))}
        </YStack>
      </SettingContainer>
    </SafeAreaContainer>
  )
}
