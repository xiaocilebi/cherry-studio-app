import { useNavigation } from '@react-navigation/native'
import { ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, XStack } from 'tamagui'

import { Provider } from '@/types/assistant'
import { NavigationProps } from '@/types/naviagate'

import { ProviderIcon } from '../../ui/ProviderIcon'
import { PressableSettingRow } from '..'

interface ProviderItemProps {
  provider: Provider
  mode?: 'enabled' | 'checked' // 添加 mode 属性来区分显示模式
}

export const ProviderItem: React.FC<ProviderItemProps> = ({ provider, mode = 'enabled' }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()

  // 根据模式决定显示条件和文本
  const shouldShowStatus = mode === 'enabled' ? provider.enabled : provider.apiKey
  const statusText = mode === 'enabled' ? t('settings.provider.enabled') : t('settings.provider.added')

  return (
    <PressableSettingRow
      onPress={() =>
        navigation.navigate('Settings', { screen: 'ProviderSettingsScreen', params: { providerId: provider.id } })
      }>
      <XStack gap={5} alignItems="center">
        <ProviderIcon provider={provider} />
        <Text>{t(`provider.${provider.id}`, { defaultValue: provider.name })}</Text>
      </XStack>
      <XStack gap={10} alignItems="center">
        {shouldShowStatus && (
          <Text
            paddingVertical={2}
            paddingHorizontal={8}
            borderRadius={8}
            borderWidth={0.5}
            backgroundColor="$green10"
            borderColor="$green20"
            color="$green100"
            fontSize={14}>
            {statusText}
          </Text>
        )}
        <ChevronRight color="$white9" width={6} height={12} />
      </XStack>
    </PressableSettingRow>
  )
}
