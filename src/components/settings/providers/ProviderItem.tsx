import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { ChevronRight, Trash2 } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { Text, XStack } from 'tamagui'
import * as ContextMenu from 'zeego/context-menu'

import { ProvidersStackParamList } from '@/navigators/settings/ProvidersStackNavigator'
import { deleteProvider } from '@/services/ProviderService'
import { Provider } from '@/types/assistant'

import { ProviderIcon } from '../../ui/ProviderIcon'
import { PressableSettingRow } from '..'

interface ProviderItemProps {
  provider: Provider
  mode?: 'enabled' | 'checked' // 添加 mode 属性来区分显示模式
}

export const ProviderItem: React.FC<ProviderItemProps> = ({ provider, mode = 'enabled' }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<ProvidersStackParamList>>()

  // 根据模式决定显示条件和文本
  const shouldShowStatus = mode === 'enabled' ? provider.enabled : provider.apiKey
  const statusText = mode === 'enabled' ? t('settings.provider.enabled') : t('settings.provider.added')

  const handleDelete = () => {
    Alert.alert(t('settings.provider.delete.title'), t('settings.provider.delete.content'), [
      {
        text: t('common.cancel'),
        style: 'cancel'
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProvider(provider.id)
          } catch (error) {
            Alert.alert(t('common.error_occurred'), (error as Error).message || 'Unknown error')
          }
        }
      }
    ])
  }

  const providerRow = (
    <PressableSettingRow onPress={() => navigation.navigate('ProviderSettingsScreen', { providerId: provider.id })}>
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

  if (provider.isSystem) {
    return providerRow
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{providerRow}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item key="delete" onSelect={handleDelete}>
          <ContextMenu.ItemTitle>{t('common.delete')}</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon ios={{ name: 'trash' }}>
            <Trash2 size={16} color="red" />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
