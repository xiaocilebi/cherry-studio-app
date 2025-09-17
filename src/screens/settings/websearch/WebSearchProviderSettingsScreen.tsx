import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { RouteProp, useRoute } from '@react-navigation/native'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { Button } from 'heroui-native'

import ExternalLink from '@/components/ExternalLink'
import { ApiCheckSheet } from '@/components/settings/websearch/ApiCheckSheet'
import { Container, GroupTitle, HeaderBar, SafeAreaContainer, Text, TextField, XStack, YStack } from '@/componentsV2'
import { Eye, EyeOff, ShieldCheck } from '@/componentsV2/icons/LucideIcon'
import { WEB_SEARCH_PROVIDER_CONFIG } from '@/config/websearchProviders'
import { useDialog } from '@/hooks/useDialog'
import { useWebSearchProvider } from '@/hooks/useWebsearchProviders'
import { WebSearchStackParamList } from '@/navigators/settings/WebSearchStackNavigator'
import WebSearchService from '@/services/WebSearchService'
import { ApiStatus } from '@/types/assistant'
import { haptic } from '@/utils/haptic'

type WebsearchProviderSettingsRouteProp = RouteProp<WebSearchStackParamList, 'WebSearchProviderSettingsScreen'>

export default function WebSearchProviderSettingsScreen() {
  const { t } = useTranslation()
  const dialog = useDialog()
  const route = useRoute<WebsearchProviderSettingsRouteProp>()

  const [showApiKey, setShowApiKey] = useState(false)
  const [checkApiStatus, setCheckApiStatus] = useState<ApiStatus>('idle')

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const { providerId } = route.params
  const { provider, isLoading, updateProvider } = useWebSearchProvider(providerId)
  const webSearchProviderConfig = provider?.id ? WEB_SEARCH_PROVIDER_CONFIG[provider.id] : undefined
  const apiKeyWebsite = webSearchProviderConfig?.websites?.apiKey

  if (isLoading) {
    return (
      <SafeAreaContainer className="items-center justify-center">
        <ActivityIndicator />
      </SafeAreaContainer>
    )
  }

  if (!provider) {
    return (
      <SafeAreaContainer>
        <HeaderBar title={t('settings.provider.not_found')} />
        <Container>
          <Text className="text-center text-gray-400 py-6">{t('settings.provider.not_found_message')}</Text>
        </Container>
      </SafeAreaContainer>
    )
  }

  const handleOpenBottomSheet = () => {
    haptic(ImpactFeedbackStyle.Medium)
    bottomSheetRef.current?.present()
  }

  const handleBottomSheetClose = () => {
    bottomSheetRef.current?.dismiss()
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
        dialog.open({
          type: 'error',
          title: t('settings.websearch.check_fail'),
          content: errorMessage,
          onConFirm: () => handleBottomSheetClose()
        })
      }
    } catch (error) {
      dialog.open({
        type: 'error',
        title: t('settings.websearch.check_error'),
        content: t('common.error_occurred'),
        onConFirm: () => handleBottomSheetClose()
      })
      throw error
    } finally {
      setTimeout(() => {
        setCheckApiStatus('idle')
        handleBottomSheetClose()
      }, 500)
    }
  }

  return (
    <SafeAreaContainer className="flex-1">
      <HeaderBar title={provider.name} />
      <Container>
        {/* API Key 配置 */}
        {provider.type === 'api' && (
          <YStack className="gap-2">
            <XStack className="justify-between items-center">
              <GroupTitle>{t('settings.websearch.api_key')}</GroupTitle>
              <Button size="sm" isIconOnly variant="ghost" onPress={handleOpenBottomSheet}>
                <Button.LabelContent>
                  <ShieldCheck size={16} className="text-blue-500" />
                </Button.LabelContent>
              </Button>
            </XStack>

            <XStack className="gap-2 relative">
              <TextField className="flex-1">
                <TextField.Input
                  className="h-12 pr-0"
                  value={provider?.apiKey || ''}
                  secureTextEntry={!showApiKey}
                  placeholder={t('settings.websearch.api_key.placeholder')}
                  onChangeText={text => handleProviderConfigChange('apiKey', text)}>
                  <TextField.InputEndContent>
                    <Button size="sm" variant="ghost" isIconOnly onPress={toggleApiKeyVisibility}>
                      <Button.LabelContent>
                        {showApiKey ? <EyeOff className="text-white" size={16} /> : <Eye size={16} />}
                      </Button.LabelContent>
                    </Button>
                  </TextField.InputEndContent>
                </TextField.Input>
              </TextField>
            </XStack>

            <XStack className="justify-between px-3">
              <Text className="text-xs opacity-40">{t('settings.provider.api_key.tip')}</Text>
              <ExternalLink href={apiKeyWebsite} size={12}>
                {t('settings.websearch.api_key.get')}
              </ExternalLink>
            </XStack>
          </YStack>
        )}

        {/* API Host 配置 */}
        <YStack className="gap-2">
          <XStack className="pr-3 justify-between items-center">
            <GroupTitle>{t('settings.websearch.api_host')}</GroupTitle>
          </XStack>
          <TextField>
            <TextField.Input
              className="h-12"
              placeholder={t('settings.websearch.api_host.placeholder')}
              value={provider?.apiHost || ''}
              onChangeText={text => handleProviderConfigChange('apiHost', text)}
            />
          </TextField>
        </YStack>
      </Container>
      <ApiCheckSheet ref={bottomSheetRef} onStartModelCheck={checkSearch} checkApiStatus={checkApiStatus} />
    </SafeAreaContainer>
  )
}
