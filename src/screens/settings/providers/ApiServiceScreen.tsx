import BottomSheet from '@gorhom/bottom-sheet'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Eye, EyeOff, ShieldCheck } from '@tamagui/lucide-icons'
import { sortBy } from 'lodash'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Alert } from 'react-native'
import { Button, Input, Stack, Text, XStack, YStack } from 'tamagui'

import ExternalLink from '@/components/ExternalLink'
import { SettingContainer, SettingGroupTitle, SettingHelpText } from '@/components/settings'
import { HeaderBar } from '@/components/settings/HeaderBar'
import { ApiCheckSheet } from '@/components/settings/providers/ApiCheckSheet'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { isEmbeddingModel } from '@/config/models/embedding'
import { PROVIDER_CONFIG } from '@/config/providers'
import { useProvider } from '@/hooks/useProviders'
import { checkApi } from '@/services/ApiService'
import { loggerService } from '@/services/LoggerService'
import { ApiStatus, Model } from '@/types/assistant'
import { NavigationProps, RootStackParamList } from '@/types/naviagate'
import { getModelUniqId } from '@/utils/model'
const logger = loggerService.withContext('ApiServiceScreen')

type ProviderSettingsRouteProp = RouteProp<RootStackParamList, 'ApiServiceScreen'>

export default function ApiServiceScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()
  const route = useRoute<ProviderSettingsRouteProp>()

  const { providerId } = route.params
  const { provider, isLoading, updateProvider } = useProvider(providerId)

  const [showApiKey, setShowApiKey] = useState(false)
  const [selectedModel, setSelectedModel] = useState<Model | undefined>()
  const [checkApiStatus, setCheckApiStatus] = useState<ApiStatus>('idle')

  const bottomSheetRef = useRef<BottomSheet>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const webSearchProviderConfig = provider?.id ? PROVIDER_CONFIG[provider.id] : undefined
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
        <HeaderBar title={t('settings.provider.not_found')} onBackPress={() => navigation.goBack()} />
        <SettingContainer>
          <Text textAlign="center" color="$gray10" paddingVertical={24}>
            {t('settings.provider.not_found_message')}
          </Text>
        </SettingContainer>
      </SafeAreaContainer>
    )
  }

  const selectOptions = !provider.models?.length
    ? []
    : [
        {
          label: provider.isSystem ? t(`provider.${provider.id}`) : provider.name,
          title: provider.name,
          options: sortBy(provider.models, 'name')
            .filter(model => !isEmbeddingModel(model))
            .map(model => ({
              label: model.name,
              value: getModelUniqId(model),
              model
            }))
        }
      ]

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand()
    setIsBottomSheetOpen(true)
  }

  const handleBottomSheetClose = () => {
    bottomSheetRef.current?.close()
    setIsBottomSheetOpen(false)
  }

  const handleModelChange = (value: string) => {
    if (!value) {
      setSelectedModel(undefined)
      return
    }

    const allOptions = selectOptions.flatMap(group => group.options)
    const foundOption = allOptions.find(opt => opt.value === value)
    setSelectedModel(foundOption?.model)
  }

  const toggleApiKeyVisibility = () => {
    setShowApiKey(prevShowApiKey => !prevShowApiKey)
  }

  const handleProviderConfigChange = async (key: 'apiKey' | 'apiHost', value: string) => {
    const updatedProvider = { ...provider, [key]: value }
    await updateProvider(updatedProvider)
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  // 模型检测处理
  const handleStartModelCheck = async () => {
    if (!selectedModel) return

    try {
      setCheckApiStatus('processing')
      await checkApi(provider, selectedModel)
      setCheckApiStatus('success')
    } catch (error: any) {
      logger.error('Model check failed:', error)
      const errorMessage =
        error && error.message
          ? ' ' + (error.message.length > 100 ? error.message.substring(0, 100) + '...' : error.message)
          : ''

      setCheckApiStatus('error')

      Alert.alert(t('settings.websearch.check_fail'), errorMessage, [
        {
          text: t('common.ok'),
          style: 'cancel',
          onPress: () => handleBottomSheetClose()
        }
      ])
    } finally {
      setTimeout(() => {
        setCheckApiStatus('idle')
        handleBottomSheetClose()
      }, 500)
    }
  }

  return (
    <SafeAreaContainer
      style={{
        flex: 1
      }}>
      <HeaderBar title={t('settings.provider.api_service')} onBackPress={handleBackPress} />

      <SettingContainer>
        {/* API Key 配置 */}
        <YStack gap={8}>
          <XStack paddingHorizontal={10} height={20} justifyContent="space-between" alignItems="center">
            <SettingGroupTitle>{t('settings.provider.api_key')}</SettingGroupTitle>
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
              flex={1}
              placeholder={t('settings.provider.api_key.placeholder')}
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
              {t('settings.provider.api_key.get')}
            </ExternalLink>
          </XStack>
        </YStack>

        {/* API Host 配置 */}
        <YStack gap={8}>
          <XStack paddingHorizontal={10} height={20} alignItems="center">
            <SettingGroupTitle>{t('settings.provider.api_host')}</SettingGroupTitle>
          </XStack>
          <Input
            placeholder={t('settings.provider.api_host.placeholder')}
            value={provider?.apiHost || ''}
            onChangeText={text => handleProviderConfigChange('apiHost', text)}
          />
        </YStack>
      </SettingContainer>

      <ApiCheckSheet
        bottomSheetRef={bottomSheetRef}
        isOpen={isBottomSheetOpen}
        onClose={handleBottomSheetClose}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        selectOptions={selectOptions}
        apiKey={provider?.apiKey || ''}
        onStartModelCheck={handleStartModelCheck}
        checkApiStatus={checkApiStatus}
      />
    </SafeAreaContainer>
  )
}
