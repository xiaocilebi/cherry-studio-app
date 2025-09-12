import { Share, X } from '@tamagui/lucide-icons'
import { FC } from 'react'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import FileViewer from 'react-native-file-viewer'
import { Stack, Text, useWindowDimensions, View, XStack, YStack } from 'tamagui'

import { FileIcon } from '@/components/icons/FileIcon'
import { loggerService } from '@/services/LoggerService'
import { FileMetadata } from '@/types/file'
import { formatFileSize } from '@/utils/file'
import ContextMenu from '@/components/ui/ContextMenu'
import { useTranslation } from 'react-i18next'
import { shareFile } from '@/services/FileService'
import { useToast } from '@/hooks/useToast'
const logger = loggerService.withContext('File Item')

interface FileItemProps {
  file: FileMetadata
  onRemove?: (file: FileMetadata) => void
  width?: number
  height?: number
  disabledContextMenu?: boolean
}

const FileItem: FC<FileItemProps> = ({ file, onRemove, width, disabledContextMenu }) => {
  const { width: screenWidth } = useWindowDimensions()
  // Default size is 30% of the screen width
  const fileWidth = width ? width : screenWidth * 0.45
  const { t } = useTranslation()
  const toast = useToast()
  const handlePreview = () => {
    FileViewer.open(file.path, { displayName: file.name }).catch(error => {
      logger.error('Handle Preview Error', error)
    })
  }

  const handleRemove = e => {
    e.stopPropagation()
    onRemove?.(file)
  }

  const handleShareFile = async () => {
    try {
      const result = await shareFile(file.path)

      if (result.success) {
        logger.info('File shared successfully')
      } else {
        toast.show(result.message, { color: '$red100', duration: 2500 })
        logger.warn('Failed to share file:', result.message)
      }
    } catch (error) {
      toast.show(t('common.error_occurred'), { color: '$red100', duration: 2500 })
      logger.error('Error in handleShareFile:', error)
    }
  }

  return (
    <ContextMenu
      onPress={handlePreview}
      disableContextMenu={disabledContextMenu}
      list={[
        {
          title: t('button.share'),
          iOSIcon: 'square.and.arrow.up',
          androidIcon: <Share size={16} />,
          onSelect: handleShareFile
        }
      ]}
      borderRadius={16}>
      <XStack
        gap={12}
        borderRadius={16}
        backgroundColor="$green20"
        justifyContent="flex-start"
        alignItems="center"
        paddingVertical={6}
        paddingHorizontal={6}
        paddingRight={12}>
        <Stack
          width={34}
          height={34}
          gap={10}
          borderRadius={12}
          backgroundColor="$green100"
          alignItems="center"
          justifyContent="center">
          <FileIcon size={20} />
        </Stack>
        <YStack justifyContent="center" gap={3}>
          <Text fontSize={14} lineHeight={14} numberOfLines={1} ellipsizeMode="middle">
            {file.name}
          </Text>
          <Text fontSize={11} lineHeight={11} color="$textSecondary">
            {formatFileSize(file.size)}
          </Text>
        </YStack>
      </XStack>
      {onRemove && (
        <TouchableOpacity
          onPress={handleRemove}
          hitSlop={5}
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            borderRadius: 99
          }}>
          <View borderRadius={99} backgroundColor="$foregroundGray" padding={2}>
            <X size={14} color="#eeeeee" />
          </View>
        </TouchableOpacity>
      )}
    </ContextMenu>
  )
}

export default FileItem
