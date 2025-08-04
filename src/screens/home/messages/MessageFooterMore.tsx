import BottomSheet from '@gorhom/bottom-sheet'
import { Download, ExternalLink } from '@tamagui/lucide-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text, XStack, YStack } from 'tamagui'

import { ISheet } from '@/components/ui/Sheet'
import { loggerService } from '@/services/LoggerService'

const logger = loggerService.withContext('MessageFooterMore')

interface MessageFooterMoreProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>
  isOpen: boolean
  onClose: () => void
}

export function MessageFooterMore({ bottomSheetRef, isOpen, onClose }: MessageFooterMoreProps) {
  const { t } = useTranslation()
  const sheetSnapPoints = ['30%']

  const onDownload = async () => {
    try {
      // TODO: 实现下载功能
      logger.info('Download functionality not implemented yet')
      onClose()
    } catch (error) {
      logger.error('Error downloading message:', error)
    }
  }

  const onExternalLink = async () => {
    try {
      // TODO: 实现外部链接功能
      logger.info('External link functionality not implemented yet')
      onClose()
    } catch (error) {
      logger.error('Error opening external link:', error)
    }
  }

  return (
    <ISheet bottomSheetRef={bottomSheetRef} isOpen={isOpen} onClose={onClose} snapPoints={sheetSnapPoints}>
      <YStack alignItems="center" paddingTop={10} paddingBottom={30} paddingHorizontal={20} gap={10}>
        <XStack width="100%" alignItems="center" justifyContent="center">
          <Text fontSize={16} fontWeight="bold">
            {t('更多选项')}
          </Text>
        </XStack>

        <YStack width="100%" gap={10}>
          <Button onPress={onDownload} icon={<Download size={18} />} theme="gray" justifyContent="flex-start">
            {t('下载消息')}
          </Button>
          <Button onPress={onExternalLink} icon={<ExternalLink size={18} />} theme="gray" justifyContent="flex-start">
            {t('在浏览器中打开')}
          </Button>
        </YStack>
      </YStack>
    </ISheet>
  )
}
