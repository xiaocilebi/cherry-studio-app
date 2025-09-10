import { useNavigation } from '@react-navigation/native'
import { ChevronRight, Edit3, Trash2 } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { SFSymbol } from 'sf-symbols-typescript'
import { Text, XStack } from 'tamagui'

import ContextMenu from '@/components/ui/ContextMenu'
import { deleteProvider } from '@/services/ProviderService'
import { Provider } from '@/types/assistant'
import { HomeNavigationProps } from '@/types/naviagate'

import { ProviderIcon } from '../../ui/ProviderIcon'

interface ProviderItemProps {
  provider: Provider
  mode?: 'enabled' | 'checked' // Add mode prop to distinguish display modes
  onEdit?: (provider: Provider) => void
}

export const ProviderItem: React.FC<ProviderItemProps> = ({ provider, mode = 'enabled', onEdit }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<HomeNavigationProps>()

  // Determine display conditions and text based on mode
  const shouldShowStatus = mode === 'enabled' ? provider.enabled : provider.apiKey
  const statusText = mode === 'enabled' ? t('settings.provider.enabled') : t('settings.provider.added')

  const handleEdit = () => {
    onEdit?.(provider)
  }

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
            const errorMessage = error instanceof Error ? error.message : t('common.unknown_error')
            Alert.alert(t('common.error_occurred'), errorMessage)
          }
        }
      }
    ])
  }

  const handlePress = () => {
    navigation.navigate('ProvidersSettings', {
      screen: 'ProviderSettingsScreen',
      params: { providerId: provider.id }
    })
  }

  const providerRow = (
    <XStack justifyContent="space-between" alignItems="center" paddingVertical={12} paddingHorizontal={16}>
      <XStack gap={8} alignItems="center">
        <ProviderIcon provider={provider} />
        <Text fontSize={16}>{t(`provider.${provider.id}`, { defaultValue: provider.name })}</Text>
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
        <ChevronRight size={20} color="$textSecondary" />
      </XStack>
    </XStack>
  )

  const contextMenuList = [
    {
      title: t('common.edit'),
      onSelect: handleEdit,
      iOSIcon: 'pencil' as SFSymbol,
      androidIcon: <Edit3 size={16} />
    },
    {
      title: t('common.delete'),
      onSelect: handleDelete,
      destructive: true,
      iOSIcon: 'trash' as SFSymbol,
      androidIcon: <Trash2 size={16} color="red" />,
      color: 'red'
    }
  ]

  return (
    <ContextMenu list={contextMenuList} onPress={handlePress} disableContextMenu={provider.isSystem}>
      {providerRow}
    </ContextMenu>
  )
}
