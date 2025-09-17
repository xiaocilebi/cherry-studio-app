import { Camera, CircleUserRound } from '@/componentsV2/icons/LucideIcon'
import * as ImagePicker from 'expo-image-picker'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'

import { Card } from 'heroui-native'
import { HeaderBar, Text, XStack, YStack, SafeAreaContainer, Container, Image, TextField } from '@/componentsV2'
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
      <Container>
        <Card className="p-4 rounded-2xl bg-ui-card-background dark:bg-ui-card-background-dark">
          <YStack className="gap-6">
            <XStack className="items-center justify-center mt-2">
              <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
                <XStack className="relative">
                  <Image
                    className="w-24 h-24 rounded-full"
                    source={avatar ? { uri: avatar } : { uri: require('@/assets/images/favicon.png') }}
                  />
                  <XStack className="absolute bottom-0 right-0 bg-blue-100 p-1.5 rounded-full border-2 border-white">
                    <Camera className="text-white" size={14} />
                  </XStack>
                </XStack>
              </TouchableOpacity>
            </XStack>

            <XStack className="gap-2 justify-between items-center rounded-2xl py-0 pl-3.5">
              <XStack className="gap-1.5 items-center">
                <CircleUserRound />
                <Text>{t('settings.personal.name')}</Text>
              </XStack>

              <TextField className="flex-1">
                <TextField.Input
                  value={userName}
                  onChangeText={setUserName}
                  placeholder={t('settings.personal.namePlaceholder')}
                />
              </TextField>
            </XStack>
          </YStack>
        </Card>
      </Container>
    </SafeAreaContainer>
  )
}
