import { ScanQrCode } from '@tamagui/lucide-icons'
import { CameraView, useCameraPermissions } from 'expo-camera'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Spinner, Text, XStack, YStack } from 'tamagui'

import { SettingContainer } from '@/components/settings'
import { loggerService } from '@/services/LoggerService'

import { Overlay } from './Overlay'
const logger = loggerService.withContext('QRCodeScanner')

interface QRCodeScannerProps {
  onQRCodeScanned: (ip: string) => void
}

export function QRCodeScanner({ onQRCodeScanned }: QRCodeScannerProps) {
  const { t } = useTranslation()
  const [permission, requestPermission] = useCameraPermissions()
  const [isRequestingPermission, setIsRequestingPermission] = useState(false)

  useEffect(() => {
    const getPermission = async () => {
      if (!permission?.granted && !isRequestingPermission) {
        setIsRequestingPermission(true)
        await requestPermission()
        setIsRequestingPermission(false)
      }
    }

    if (permission === null || !permission?.granted) {
      getPermission()
    }
  })

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    try {
      const qrData = JSON.parse(data)

      if (qrData && qrData.host && qrData.port) {
        const ip = `${qrData.host}:${qrData.port}`
        onQRCodeScanned(ip)
      }
    } catch (error) {
      logger.error('Failed to parse QR code data:', error)
    }
  }

  if (permission === null || isRequestingPermission) {
    return (
      <SettingContainer>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="$colorBrand" />
          <Text mt="$2">
            {t('settings.data.landrop.scan_qr_code.requesting_permission') || 'Requesting camera permission...'}
          </Text>
        </YStack>
      </SettingContainer>
    )
  }

  if (!permission.granted) {
    return (
      <SettingContainer>
        <YStack flex={1} alignItems="center" justifyContent="center" gap="$3">
          <Text textAlign="center" color="$red8">
            {t('settings.data.landrop.scan_qr_code.permission_denied') ||
              'Camera permission not granted. Please enable it in your device settings to scan QR codes.'}
          </Text>
          <Button onPress={() => requestPermission()} theme="red">
            {t('settings.data.landrop.scan_qr_code.grant_permission') || 'Grant Permission'}
          </Button>
          {/* 在iOS上，用户拒绝后不能直接再次弹窗请求，需要引导用户去设置 */}
          {/* 在Android上，如果用户选择了“Don't ask again”，也不能再次弹窗请求 */}
        </YStack>
      </SettingContainer>
    )
  }

  return (
    <SettingContainer>
      <XStack gap={5} alignItems="center">
        <ScanQrCode color="$colorBrand" />
        <Text>{t('settings.data.landrop.scan_qr_code.description')}</Text>
      </XStack>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr']
        }}
      />
      <Overlay />
    </SettingContainer>
  )
}
