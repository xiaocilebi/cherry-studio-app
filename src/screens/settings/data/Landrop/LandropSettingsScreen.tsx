import { useNavigation } from '@react-navigation/native'
import { File, Paths } from 'expo-file-system/next'
import React, { useEffect, useRef, useState } from 'react' // Import useRef
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useTheme } from 'tamagui'

import { RestoreProgressModal } from '@/components/settings/data/RestoreProgressModal'
import { HeaderBar } from '@/components/settings/HeaderBar'
import SafeAreaContainer from '@/components/ui/SafeAreaContainer'
import { useRestore } from '@/hooks/useRestore'
import { useWebSocket, WebSocketStatus } from '@/hooks/useWebSocket'
import { NavigationProps } from '@/types/naviagate'

import { QRCodeScanner } from './QRCodeScanner'

export default function LandropSettingsScreen() {
  const theme = useTheme()
  const { t } = useTranslation()
  const navigation = useNavigation<NavigationProps>()
  const { status, filename, connect } = useWebSocket()
  const [scannedIP, setScannedIP] = useState<string | null>(null)
  const { isModalOpen, restoreSteps, overallStatus, startRestore, closeModal } = useRestore()

  const hasScannedRef = useRef(false)

  useEffect(() => {
    if (status === WebSocketStatus.DISCONNECTED) {
      setScannedIP(null)

      hasScannedRef.current = false
    }
  }, [status])

  // 文件发送完毕后开始恢复
  useEffect(() => {
    const handleRestore = async () => {
      if (status === WebSocketStatus.ZIP_FILE_END) {
        const zip = new File(Paths.join(Paths.cache, 'Files'), filename)
        await startRestore({
          name: zip.name,
          uri: zip.uri,
          size: zip.size || 0,
          mimeType: zip.type || ''
        })
      }
    }

    handleRestore()
  }, [filename, startRestore, status])

  const handleQRCodeScanned = (ip: string) => {
    if (hasScannedRef.current) {
      return
    }

    hasScannedRef.current = true

    setScannedIP(ip)
    connect(ip)
    Alert.alert(
      t('settings.data.landrop.scan_qr_code.success'),
      t('settings.data.landrop.scan_qr_code.success_description')
    )
  }

  const handleModalClose = () => {
    closeModal()
    navigation.goBack()
  }

  return (
    <SafeAreaContainer style={{ flex: 1, backgroundColor: theme.background.val }}>
      <HeaderBar title={t('settings.data.landrop.scan_qr_code.title')} onBackPress={() => navigation.goBack()} />

      {!isModalOpen && !scannedIP && <QRCodeScanner onQRCodeScanned={handleQRCodeScanned} />}
      <RestoreProgressModal
        isOpen={isModalOpen}
        steps={restoreSteps}
        overallStatus={overallStatus}
        onClose={handleModalClose}
      />
    </SafeAreaContainer>
  )
}
