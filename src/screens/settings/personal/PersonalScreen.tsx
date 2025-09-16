import { Camera, CircleUserRound } from '@tamagui/lucide-icons'
import * as ImagePicker from 'expo-image-picker'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { Avatar, Card, Input, Separator, Text, XStack, YStack } from 'tamagui'

import { SettingContainer } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useDialog } from '@/hooks/useDialog'
import { useSettings } from '@/hooks/useSettings'
import { loggerService } from '@/services/LoggerService'

const logger = loggerService.withContext('PersonalScreen')

export default function PersonalScreen() {
  const { t } = useTranslation()
  const dialog = useDialog()
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
      dialog.open({
        type: 'error',
        title: 'Error',
        content: 'Failed to pick image'
      })
      logger.error('handleAvatarPress', error as Error)
    }
  }

  return (
    <SafeAreaContainer>
      <HeaderBar title={t('settings.personal.title')} />
      <SettingContainer>
        <Card elevate bordered padding={16} borderRadius={16}>
          <YStack gap={16}>
            <XStack alignItems="center" justifyContent="center" marginTop={8}>
              <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
                <XStack position="relative">
                  <Avatar circular size={96}>
                    <Avatar.Image accessibilityLabel="Avatar" src={avatar || require('@/assets/images/favicon.png')} />
                    <Avatar.Fallback delayMs={400} backgroundColor="$blue10" />
                  </Avatar>
                  <XStack
                    position="absolute"
                    bottom={0}
                    right={0}
                    backgroundColor="$blue10"
                    padding={6}
                    borderRadius={999}
                    borderWidth={2}
                    borderColor="#FFFFFF">
                    <Camera size={14} color="#FFFFFF" />
                  </XStack>
                </XStack>
              </TouchableOpacity>
            </XStack>

            <XStack
              justifyContent="space-between"
              alignItems="center"
              borderRadius={16}
              borderWidth={1}
              borderColor="$borderColor"
              paddingVertical={0}
              paddingLeft={14}>
              <XStack gap={6} alignItems="center">
                <CircleUserRound opacity={0.8} color="$textSecondary" />
                <Text opacity={0.8} color="$textSecondary">
                  {t('settings.personal.name')}
                </Text>
              </XStack>

              <Input
                value={userName}
                onChangeText={setUserName}
                placeholder={t('settings.personal.namePlaceholder')}
                flex={1}
                borderColor="transparent"
                backgroundColor="transparent"
                paddingVertical={0}
                height={48}
                focusStyle={{ borderColor: 'transparent' }}
                fontSize={14}
              />
            </XStack>
          </YStack>
        </Card>
      </SettingContainer>
    </SafeAreaContainer>
  )
}
