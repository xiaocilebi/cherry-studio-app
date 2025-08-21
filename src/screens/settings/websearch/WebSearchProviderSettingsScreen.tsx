import BottomSheet from '@gorhom/bottom-sheet'
import { RouteProp, useRoute } from '@react-navigation/native'
import { Eye, EyeOff, ShieldCheck } from '@tamagui/lucide-icons'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Alert } from 'react-native'
import { Button, Input, Stack, Text, XStack, YStack } from 'tamagui'

import ExternalLink from '@/components/ExternalLink'
import { SettingContainer, SettingGroupTitle, SettingHelpText } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { ApiCheckSheet } from '@/components/settings/websearch/ApiCheckSheet'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { WEB_SEARCH_PROVIDER_CONFIG } from '@/config/websearchProviders'
import { useWebSearchProvider } from '@/hooks/useWebsearchProviders'
import { SettingsStackParamList } from '@/navigators/SettingsStackNavigator'
import WebSearchService from '@/services/WebSearchService'
import { ApiStatus } from '@/types/assistant'

type WebsearchProviderSettingsRouteProp = RouteProp<SettingsStackParamList, 'WebSearchProviderSettingsScreen'>

export default function WebSearchProviderSettingsScreen() {
  const { t } = useTranslation()
  const route = useRoute<WebsearchProviderSettingsRouteProp>()

  const [showApiKey, setShowApiKey] = useState(false)
  const [checkApiStatus, setCheckApiStatus] = useState<ApiStatus>('idle')

  const bottomSheetRef = useRef<BottomSheet>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const { providerId } = route.params
  const { provider, isLoading, updateProvider } = useWebSearchProvider(providerId)
  const webSearchProviderConfig = provider?.id ? WEB_SEARCH_PROVIDER_CONFIG[provider.id] : undefined
  const apiKeyWebsite = webSearchProviderConfig?.websites?.apiKey

  if (isLoading) {
    return (
      <SafeAreaContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  if (!provider) {
    return (
      <SafeAreaContainer>
        <HeaderBar title={t('settings.provider.not_found')} />
        <SettingContainer>
          <Text textAlign="center" color="$gray10" paddingVertical={24}>
            {t('settings.provider.not_found_message')}
          </Text>
        </SettingContainer>
      </SafeAreaContainer>
    )
  }

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand()
    setIsBottomSheetOpen(true)
  }

  const handleBottomSheetClose = () => {
    bottomSheetRef.current?.close()
    setIsBottomSheetOpen(false)
  }

  const toggleApiKeyVisibility = () => {
    setShowApiKey(prevShowApiKey => !prevShowApiKey)
  }

  const handleProviderConfigChange = async (key: 'apiKey' | 'apiHost', value: string) => {
    const updatedProvider = { ...provider, [key]: value }
    await updateProvider(updatedProvider)
  }

  async function checkSearch() {
    // TODO : 支持多个 API Key 检测
    if (!provider) return
    setCheckApiStatus('processing')

    try {
      const { valid, error } = await WebSearchService.checkSearch(provider)
      const errorMessage =
        error && error?.message
          ? ' ' + (error.message.length > 100 ? error.message.substring(0, 100) + '...' : error.message)
          : ''

      if (valid) {
        setCheckApiStatus('success')
      } else {
        Alert.alert(t('settings.websearch.check_fail'), errorMessage, [
          {
            text: t('common.ok'),
            style: 'cancel',
            onPress: () => setIsBottomSheetOpen(false)
          }
        ])
      }
    } catch (error) {
      Alert.alert(t('settings.websearch.check_error'), t('common.error_occurred'), [
        {
          text: t('common.ok'),
          style: 'cancel',
          onPress: () => setIsBottomSheetOpen(false)
        }
      ])
      throw error
    } finally {
      setTimeout(() => {
        setCheckApiStatus('idle')
        handleBottomSheetClose()
      }, 500)
    }
  }

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <HeaderBar title={provider.name} />
      <SettingContainer>
        {/* API Key 配置 */}
        {provider.type === 'api' && (
          <YStack gap={8}>
            <XStack paddingHorizontal={10} height={20} justifyContent="space-between" alignItems="center">
              <SettingGroupTitle>{t('settings.websearch.api_key')}</SettingGroupTitle>
              <Button
                size={16}
                icon={<ShieldCheck size={16} color="$textLink" />}
                backgroundColor="$colorTransparent"
                circular
                onPress={handleOpenBottomSheet}
              />
            </XStack>

            <XStack paddingVertical={8} gap={8} position="relative">
              <Input
                fontSize={14}
                lineHeight={14 * 1.2}
                flex={1}
                placeholder={t('settings.websearch.api_key.placeholder')}
                secureTextEntry={!showApiKey}
                paddingRight={48}
                value={provider?.apiKey || ''}
                onChangeText={text => handleProviderConfigChange('apiKey', text)}
              />
              <Stack
                position="absolute"
                right={10}
                top="50%"
                height={16}
                width={16}
                alignItems="center"
                justifyContent="center"
                zIndex={1}
                onPress={toggleApiKeyVisibility}
                cursor="pointer">
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </Stack>
            </XStack>

            <XStack justifyContent="space-between">
              <SettingHelpText>{t('settings.provider.api_key.tip')}</SettingHelpText>
              <ExternalLink href={apiKeyWebsite} size={12}>
                {t('settings.websearch.api_key.get')}
              </ExternalLink>
            </XStack>
          </YStack>
        )}

        {/* API Host 配置 */}
        <YStack gap={8}>
          <XStack paddingHorizontal={10} height={20} alignItems="center">
            <SettingGroupTitle>{t('settings.websearch.api_host')}</SettingGroupTitle>
          </XStack>
          <Input
            fontSize={14}
            lineHeight={14 * 1.2}
            placeholder={t('settings.websearch.api_host.placeholder')}
            value={provider?.apiHost || ''}
            onChangeText={text => handleProviderConfigChange('apiHost', text)}
          />
        </YStack>
      </SettingContainer>
      <ApiCheckSheet
        bottomSheetRef={bottomSheetRef}
        isOpen={isBottomSheetOpen}
        onClose={handleBottomSheetClose}
        apiKey={provider?.apiKey || ''}
        onStartModelCheck={checkSearch}
        checkApiStatus={checkApiStatus}
      />
    </SafeAreaContainer>
  )
}
