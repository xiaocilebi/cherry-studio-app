import { useNavigation } from '@react-navigation/native'
import { ScanQrCode } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TextInput, View } from 'react-native'
import { Button, ScrollView, Text, useTheme, YStack } from 'tamagui'

import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'

export default function WebDavConfigScreen() {
  const theme = useTheme()
  const navigation = useNavigation()
  const { t } = useTranslation()

  const [host, setHost] = useState('')
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [path, setPath] = useState('')

  const isButtonEnabled = host.trim() !== '' && user.trim() !== '' && password.trim() !== ''

  const fieldProps = {
    style: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.borderColor.val,
      borderRadius: 8,
      paddingHorizontal: 12,
      color: theme.color.val
    },
    placeholderTextColor: theme.color.val + '80'
  } as const

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <HeaderBar
        title={t('settings.webdav.config.title')}
        onBackPress={() => navigation.goBack()}
        rightButton={{
          icon: <ScanQrCode size={24} />,
          onPress: () => {
            // Handle add action here
          }
        }}
      />
      <ScrollView flex={1} contentContainerStyle={{ padding: 16 }}>
        <YStack gap={24}>
          <Text fontSize="$5" mb={4}>
            {t('settings.webdav.config.host')}
          </Text>
          <TextInput
            placeholder={t('settings.webdav.config.host_placeholder')}
            onChangeText={setHost}
            value={host}
            {...fieldProps}
          />

          <Text fontSize="$5" mb={4}>
            {t('settings.webdav.config.user')}
          </Text>
          <TextInput
            placeholder={t('settings.webdav.config.user_placeholder')}
            onChangeText={setUser}
            value={user}
            {...fieldProps}
          />

          <Text fontSize="$5" mb={4}>
            {t('settings.webdav.config.password')}
          </Text>
          <TextInput
            placeholder={t('settings.webdav.config.password_placeholder')}
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            {...fieldProps}
          />
          <Text fontSize="$3" color="$blue9" mb={8}>
            {t('settings.webdav.config.password_hint')}
          </Text>

          <Text fontSize="$5" mb={4}>
            {t('settings.webdav.config.path')}
          </Text>
          <TextInput
            placeholder={t('settings.webdav.config.path_placeholder')}
            onChangeText={setPath}
            value={path}
            {...fieldProps}
          />

          <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 20 }}>
            <Button
              disabled={!isButtonEnabled}
              backgroundColor={isButtonEnabled ? '$green' : '$gray'}
              width="90%"
              height={50}
              borderRadius={8}>
              {t('settings.webdav.config.apply')}
            </Button>
          </View>
        </YStack>
      </ScrollView>
    </SafeAreaContainer>
  )
}
