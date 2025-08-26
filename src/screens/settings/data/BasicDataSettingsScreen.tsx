import { useNavigation } from '@react-navigation/native'
import { ChevronRight, FileText, Folder, FolderOpen, RotateCcw, Trash2 } from '@tamagui/lucide-icons'
import { reloadAppAsync } from 'expo'
import * as DocumentPicker from 'expo-document-picker'
import { Paths } from 'expo-file-system/next'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Sharing from 'expo-sharing'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Platform } from 'react-native'
import { ScrollView, Text, XStack, YStack } from 'tamagui'

import { SettingContainer, SettingGroup, SettingGroupTitle, SettingRow } from '@/components/settings'
import { RestoreProgressModal } from '@/components/settings/data/RestoreProgressModal'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { LOCAL_RESTORE_STEPS, useRestore } from '@/hooks/useRestore'
import { getCacheDirectorySize, resetCacheDirectory } from '@/services/FileService'
import { loggerService } from '@/services/LoggerService'
import { persistor } from '@/store'
import { NavigationProps } from '@/types/naviagate'
import { formatFileSize } from '@/utils/file'

import { resetDatabase } from '../../../../db/queries/reset.queries'
const logger = loggerService.withContext('BasicDataSettingsScreen')

interface SettingItemConfig {
  title: string
  screen?: string
  icon: React.ReactElement
  subtitle?: string
  danger?: boolean
  onPress?: () => void
  disabled?: boolean
}

interface SettingGroupConfig {
  title: string
  items: SettingItemConfig[]
}

export default function BasicDataSettingsScreen() {
  const { t } = useTranslation()
  const [isResetting, setIsResetting] = useState(false)
  const [cacheSize, setCacheSize] = useState<string>('--')
  const { isModalOpen, restoreSteps, overallStatus, startRestore, closeModal } = useRestore({
    stepConfigs: LOCAL_RESTORE_STEPS
  })

  const loadCacheSize = async () => {
    try {
      const size = await getCacheDirectorySize()
      setCacheSize(formatFileSize(size))
    } catch (error) {
      logger.error('loadCacheSize', error as Error)
      setCacheSize('--')
    }
  }

  useEffect(() => {
    loadCacheSize()
  }, [])

  const handleRestore = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/zip' })
    if (result.canceled) return

    const asset = result.assets[0]
    await startRestore({
      name: asset.name,
      uri: asset.uri,
      size: asset.size,
      mimeType: asset.mimeType
    })
  }

  const handleDataReset = async () => {
    if (isResetting) return

    Alert.alert(t('settings.data.reset'), t('settings.data.reset_warning'), [
      {
        text: t('common.cancel'),
        style: 'cancel'
      },
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: async () => {
          setIsResetting(true)

          try {
            await resetDatabase() // reset sqlite
            await persistor.purge() // reset redux
            await resetCacheDirectory() // reset cache
          } catch (error) {
            Alert.alert(t('settings.data.data_reset.error'))
            logger.error('handleDataReset', error as Error)
          } finally {
            setIsResetting(false)
            await reloadAppAsync()
          }
        }
      }
    ])
  }

  const handleClearCache = async () => {
    if (isResetting) return

    Alert.alert(t('settings.data.reset'), t('settings.data.reset_warning'), [
      {
        text: t('common.cancel'),
        style: 'cancel'
      },
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: async () => {
          setIsResetting(true)

          try {
            await resetCacheDirectory() // reset cache
            await loadCacheSize() // refresh cache size after clearing
          } catch (error) {
            Alert.alert(t('settings.data.data_reset.error'))
            logger.error('handleDataReset', error as Error)
          } finally {
            setIsResetting(false)
          }
        }
      }
    ])
  }

  const handleOpenAppData = async () => {
    try {
      if (Platform.OS === 'android') {
        // Open file manager on Android
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: Paths.document.uri,
          type: 'resource/folder'
        })
      } else {
        // On iOS, we can only share the directory info
        Alert.alert(t('settings.data.app_data'), `${t('settings.data.app_data_location')}: ${Paths.document.uri}`, [
          { text: t('common.ok') }
        ])
      }
    } catch (error) {
      logger.error('handleOpenAppData', error as Error)
      Alert.alert(t('settings.data.app_data'), `${t('settings.data.app_data_location')}: ${Paths.document.uri}`)
    }
  }

  const handleOpenAppLogs = async () => {
    try {
      const logPath = Paths.join(Paths.document.uri, 'app.log')

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(logPath)
      } else {
        Alert.alert(t('settings.data.app_logs'), `${t('settings.data.log_location')}: ${logPath}`, [
          { text: t('common.ok') }
        ])
      }
    } catch (error) {
      logger.error('handleOpenAppLogs', error as Error)
      const logPath = Paths.join(Paths.document.uri, 'app.log')
      Alert.alert(t('settings.data.app_logs'), `${t('settings.data.log_location')}: ${logPath}`)
    }
  }

  const settingsItems: SettingGroupConfig[] = [
    {
      title: t('settings.data.title'),
      items: [
        // todo
        // {
        //   title: t('settings.data.backup'),
        //   icon: <Save size={24} />,
        //   onPress: () => {}
        // },
        {
          title: t('settings.data.recovery'),
          icon: <Folder size={24} />,
          onPress: handleRestore
        },
        {
          title: isResetting ? t('common.loading') : t('settings.data.reset'),
          icon: <RotateCcw size={24} color="red" />,
          danger: true,
          onPress: handleDataReset,
          disabled: isResetting
        }
      ]
    },
    {
      title: t('settings.data.data.title'),
      items: [
        {
          title: t('settings.data.app_data'),
          icon: <FolderOpen size={24} />,
          onPress: handleOpenAppData
        },
        {
          title: t('settings.data.app_logs'),
          icon: <FileText size={24} />,
          onPress: handleOpenAppLogs
        },
        {
          title: t('settings.data.clear_cache.button', { cacheSize }),
          icon: <Trash2 size={24} color="red" />,
          danger: true,
          onPress: handleClearCache
        }
      ]
    }
  ]

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <HeaderBar title={t('settings.data.basic_title')} />

      <ScrollView flex={1}>
        <SettingContainer>
          <YStack gap={24} flex={1}>
            {settingsItems.map(group => (
              <Group key={group.title} title={group.title}>
                {group.items.map(item => (
                  <SettingItem key={item.title} {...item} />
                ))}
              </Group>
            ))}
          </YStack>
        </SettingContainer>
      </ScrollView>

      <RestoreProgressModal
        isOpen={isModalOpen}
        steps={restoreSteps}
        overallStatus={overallStatus}
        onClose={closeModal}
      />
    </SafeAreaContainer>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <YStack gap={8}>
      <SettingGroupTitle>{title}</SettingGroupTitle>
      <SettingGroup>{children}</SettingGroup>
    </YStack>
  )
}

function SettingItem({ title, screen, icon, subtitle, danger, onPress, disabled }: SettingItemConfig) {
  const navigation = useNavigation<NavigationProps>()

  const handlePress = () => {
    if (disabled) return

    if (onPress) {
      onPress()
    } else if (screen) {
      navigation.navigate(screen as any)
    }
  }

  return (
    <SettingRow onPress={handlePress} opacity={disabled ? 0.5 : 1}>
      <XStack alignItems="center" gap={12}>
        {icon}
        <YStack>
          <Text fontSize="$5" color={danger ? 'red' : undefined}>
            {title}
          </Text>
          {subtitle && <Text fontSize="$2">{subtitle}</Text>}
        </YStack>
      </XStack>
      {screen && <ChevronRight size={24} color="$colorFocus" />}
    </SettingRow>
  )
}
