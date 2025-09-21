import { useNavigation } from '@react-navigation/native'
import { File, Paths } from 'expo-file-system/next'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SafeAreaContainer, HeaderBar, RestoreProgressModal } from '@/componentsV2'
import { useDialog } from '@/hooks/useDialog'
import { useRestore } from '@/hooks/useRestore'
import { useWebSocket, WebSocketStatus } from '@/hooks/useWebSocket'
import { DataSourcesNavigationProps } from '@/types/naviagate'

import { QRCodeScanner } from './QRCodeScanner'

export default function LandropSettingsScreen() {
  const { t } = useTranslation()
  const dialog = useDialog()
  const navigation = useNavigation<DataSourcesNavigationProps>()
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
    dialog.open({
      type: 'info',
      title: t('settings.data.landrop.scan_qr_code.success'),
      content: t('settings.data.landrop.scan_qr_code.success_description')
    })
  }

  const handleModalClose = () => {
    closeModal()
    navigation.goBack()
  }

  return (
    <SafeAreaContainer style={{ flex: 1 }}>
      <HeaderBar title={t('settings.data.landrop.scan_qr_code.title')} />

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
