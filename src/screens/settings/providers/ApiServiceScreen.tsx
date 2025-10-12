import { RouteProp, useRoute } from '@react-navigation/native'
import { ImpactFeedbackStyle } from 'expo-haptics'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { Button, Spinner } from 'heroui-native'

import {
  Container,
  ExternalLink,
  GroupTitle,
  HeaderBar,
  SafeAreaContainer,
  Text,
  TextField,
  XStack,
  YStack
} from '@/componentsV2'
import { Eye, EyeOff, ShieldCheck, XCircle } from '@/componentsV2/icons/LucideIcon'
import { PROVIDER_URLS } from '@/config/providers'
import { useDialog } from '@/hooks/useDialog'
import { useProvider } from '@/hooks/useProviders'
import { ProvidersStackParamList } from '@/navigators/settings/ProvidersStackNavigator'
import { checkApi } from '@/services/ApiService'
import { loggerService } from '@/services/LoggerService'
import { ApiStatus, Model } from '@/types/assistant'
import { haptic } from '@/utils/haptic'
import { ModelSelect } from '@/componentsV2/features/SettingsScreen/ModelSelect'
const logger = loggerService.withContext('ApiServiceScreen')

type ProviderSettingsRouteProp = RouteProp<ProvidersStackParamList, 'ApiServiceScreen'>

export default function ApiServiceScreen() {
  const { t } = useTranslation()
  const dialog = useDialog()
  const route = useRoute<ProviderSettingsRouteProp>()

  const { providerId } = route.params
  const { provider, isLoading, updateProvider } = useProvider(providerId)

  const [showApiKey, setShowApiKey] = useState(false)
  const [checkApiStatus, setCheckApiStatus] = useState<ApiStatus>('idle')
  const [apiKey, setApiKey] = useState(provider?.apiKey || '')
  const [apiHost, setApiHost] = useState(provider?.apiHost || '')

  // 当 provider 改变时更新本地状态
  useEffect(() => {
    if (provider) {
      setApiKey(provider.apiKey || '')
      setApiHost(provider.apiHost || '')
    }
  }, [provider])

  const webSearchProviderConfig = provider?.id ? PROVIDER_URLS[provider.id] : undefined
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
    let selectedModel: Model | undefined

    dialog.open({
      type: 'success',
      title: t('settings.provider.api_check.title'),
      content: (
        <ModelSelect
          provider={provider}
          onSelectModel={model => {
            selectedModel = model
          }}
        />
      ),
      onConFirm: async () => {
        await handleStartModelCheck(selectedModel)
      }
    })
  }

  const toggleApiKeyVisibility = () => {
    setShowApiKey(prevShowApiKey => !prevShowApiKey)
  }

  const handleProviderConfigChange = async (key: 'apiKey' | 'apiHost', value: string) => {
    if (key === 'apiKey') {
      setApiKey(value)
    } else if (key === 'apiHost') {
      setApiHost(value)
    }

    const updatedProvider = { ...provider, [key]: value }
    await updateProvider(updatedProvider)
  }

  // 模型检测处理
  const handleStartModelCheck = async (model: Model | undefined) => {
    if (!model || !apiKey) {
      let errorKey = ''

      if (!model && !apiKey) {
        errorKey = 'model_api_key_empty'
      } else if (!model) {
        errorKey = 'model_empty'
      } else if (!apiKey) {
        errorKey = 'api_key_empty'
      }

      dialog.open({
        type: 'error',
        title: t('settings.provider.check_failed.title'),
        content: t(`settings.provider.check_failed.${errorKey}`)
      })
      return
    }

    try {
      setCheckApiStatus('processing')
      await checkApi(provider, model)
      setCheckApiStatus('success')
    } catch (error: any) {
      logger.error('Model check failed:', error)
      const errorMessage =
        error && error.message
          ? ' ' + (error.message.length > 100 ? error.message.substring(0, 100) + '...' : error.message)
          : ''

      setCheckApiStatus('error')

      dialog.open({
        type: 'error',
        title: t('settings.provider.check_failed.title'),
        content: errorMessage
      })
    }
  }

  return (
    <SafeAreaContainer className="flex-1">
      <HeaderBar title={t('settings.provider.api_service')} />
      <Container>
        {/* API Key 配置 */}
        <YStack className="gap-2">
          <XStack className="justify-between items-center">
            <GroupTitle>{t('settings.provider.api_key')}</GroupTitle>
            <Button size="sm" isIconOnly variant="ghost" onPress={handleOpenBottomSheet}>
              <Button.LabelContent>
                {checkApiStatus === 'idle' && <ShieldCheck size={16} />}
                {checkApiStatus === 'error' && <XCircle size={16} />}
                {checkApiStatus === 'processing' && <Spinner size="sm" />}
                {checkApiStatus === 'success' && (
                  <ShieldCheck size={16} className="text-green-100 dark:text-green-dark-100" />
                )}
              </Button.LabelContent>
            </Button>
          </XStack>

          <XStack className="gap-2 relative">
            <TextField className="flex-1">
              <TextField.Input
                className="h-12 pr-0"
                value={apiKey}
                secureTextEntry={!showApiKey}
                placeholder={t('settings.provider.api_key.placeholder')}
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
            <ExternalLink href={apiKeyWebsite} content={t('settings.provider.api_key.get')} />
          </XStack>
        </YStack>

        {/* API Host 配置 */}
        <YStack className="gap-2">
          <XStack className="pr-3 justify-between items-center">
            <GroupTitle>{t('settings.provider.api_host')}</GroupTitle>
          </XStack>
          <TextField>
            <TextField.Input
              className="h-12"
              placeholder={t('settings.provider.api_host.placeholder')}
              value={apiHost}
              onChangeText={text => handleProviderConfigChange('apiHost', text)}
            />
          </TextField>
        </YStack>
      </Container>
    </SafeAreaContainer>
  )
}
