import { useNavigation } from '@react-navigation/native'
import { CircleUserRound } from '@tamagui/lucide-icons'
import * as ImagePicker from 'expo-image-picker'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, TouchableOpacity } from 'react-native'
import { Avatar, Input, Text, useTheme, XStack } from 'tamagui'

import { SettingContainer, SettingGroup, SettingRow } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useSettings } from '@/hooks/useSettings'
import { loggerService } from '@/services/LoggerService'
import { NavigationProps } from '@/types/naviagate'

const logger = loggerService.withContext('PersonalScreen')

export default function PersonalScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()
  const theme = useTheme()
  const { avatar, userName, setAvatar, setUserName } = useSettings()

  const handleAvatarPress = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        base64: true,
        quality: 0.8
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0]

        if (selectedImage.base64) {
          const base64Image = `data:image/jpeg;base64,${selectedImage.base64}`
          setAvatar(base64Image)
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image')
      logger.error('handleAvatarPress', error as Error)
    }
  }

  return (
    <SafeAreaContainer>
      <HeaderBar title={t('settings.personal.title')} />
      <SettingContainer>
        <SettingGroup>
          <TouchableOpacity
            onPress={handleAvatarPress}
            style={{
              alignItems: 'center'
            }}>
            <Avatar circular size={80}>
              <Avatar.Image accessibilityLabel="Avatar" src={avatar || require('@/assets/images/favicon.png')} />
              <Avatar.Fallback delayMs={600} backgroundColor={theme.blue10} />
            </Avatar>
          </TouchableOpacity>
          <SettingRow justifyContent="space-between">
            <XStack gap={5} justifyContent="center" alignItems="center">
              <CircleUserRound />
              <Text>{t('settings.personal.name')}</Text>
            </XStack>
            <Input
              height={30}
              minWidth={200}
              value={userName}
              onChangeText={setUserName}
              placeholder={t('settings.personal.namePlaceholder')}
            />
          </SettingRow>
        </SettingGroup>
      </SettingContainer>
    </SafeAreaContainer>
  )
}
