import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, useTheme, XStack, YStack } from 'tamagui'

import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { themeOptions } from '@/config/theme'
import { NavigationProps } from '@/types/naviagate'

export default function ThemeSettingsScreen() {
  const { t } = useTranslation()

  const theme = useTheme()
  const navigation = useNavigation<NavigationProps>()
  const [currentTheme, setCurrentTheme] = useState('system')

  const handleFocus = () => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme')

      if (storedTheme) {
        setCurrentTheme(storedTheme)
      }
    }

    loadTheme()
  }

  // TODO 当前主题切换还存在问题
  useFocusEffect(handleFocus)

  const changeTheme = async (themeValue: string) => {
    setCurrentTheme(themeValue)
    await AsyncStorage.setItem('theme', themeValue)
    navigation.goBack()
  }

  return (
    <SafeAreaContainer style={{ flex: 1, backgroundColor: theme.background.val }}>
      <HeaderBar title={t('settings.general.theme.title')} onBackPress={() => navigation.goBack()} />
      <SettingContainer>
        <YStack flex={1} space={12} paddingHorizontal={16}>
          {themeOptions.map(opt => (
            <XStack
              key={opt.value}
              onPress={() => changeTheme(opt.value)}
              alignItems="center"
              justifyContent="space-between"
              padding={16}
              borderRadius={8}
              backgroundColor={theme['$color3']}
              hoverStyle={{ backgroundColor: theme['$color4'] }}
              pressStyle={{ opacity: 0.7 }}>
              <XStack alignItems="center" space>
                <Text fontSize={16}>{opt.label}</Text>
              </XStack>

              <XStack
                width={20}
                height={20}
                borderRadius={10}
                borderWidth={2}
                borderColor={currentTheme === opt.value ? theme.color.val : theme['$color8']}
                alignItems="center"
                justifyContent="center">
                {currentTheme === opt.value && (
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
