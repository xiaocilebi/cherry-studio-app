import { CircleX, Download, Share } from '@tamagui/lucide-icons'
import { FC, useState } from 'react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import ImageView from 'react-native-image-viewing'
import { Image, useWindowDimensions, View } from 'tamagui'

import ContextMenu from '@/components/ui/ContextMenu'
import { loggerService } from '@/services/LoggerService'
import { saveImageToGallery } from '@/services/ImageService'
import { shareFile } from '@/services/FileService'
import { FileMetadata } from '@/types/file'
import { useToast } from '@/hooks/useToast'

const logger = loggerService.withContext('Image Item')

interface ImageItemProps {
  file: FileMetadata
  allImages?: FileMetadata[]
  onRemove?: (file: FileMetadata) => void
  size?: number
}

const ImageItem: FC<ImageItemProps> = ({ file, allImages = [], onRemove, size }) => {
  const [visible, setIsVisible] = useState(false)
  const imagesForViewer = allImages.length > 0 ? allImages : [file]
  const imageIndex = imagesForViewer.findIndex(img => img.path === file.path)
  const { width: screenWidth } = useWindowDimensions()
  // Default size is 30% of the screen width
  const imageWidth = size ? size : screenWidth * 0.3
  const { t } = useTranslation()
  const toast = useToast()

  const handleRemove = e => {
    e.stopPropagation()
    onRemove?.(file)
  }

  const handleSaveImage = async () => {
    try {
      const result = await saveImageToGallery(file.path)

      if (result.success) {
        toast.show(t('common.saved'))
        logger.info('Image saved successfully')
      } else {
        toast.show(result.message, { color: '$red100', duration: 2500 })
        logger.warn('Failed to save image:', result.message)
      }
    } catch (error) {
      toast.show(t('common.error_occurred'), { color: '$red100', duration: 2500 })
      logger.error('Error in handleSaveImage:', error)
    }
  }

  const handleShareImage = async () => {
    try {
      const result = await shareFile(file.path)

      if (result.success) {
        logger.info('Image shared successfully')
      } else {
        toast.show(result.message, { color: '$red100', duration: 2500 })
        logger.warn('Failed to share image:', result.message)
      }
    } catch (error) {
      toast.show(t('common.error_occurred'), { color: '$red100', duration: 2500 })
      logger.error('Error in handleShareImage:', error)
    }
  }

  return (
    <View style={{ position: 'relative' }}>
      <ContextMenu
        onPress={() => setIsVisible(true)}
        list={[
          {
            title: t('button.save_image'),
            iOSIcon: 'square.and.arrow.down',
            androidIcon: <Download size={16} />,
            onSelect: handleSaveImage
          },
          {
            title: t('button.share'),
            iOSIcon: 'square.and.arrow.up',
            androidIcon: <Share size={16} />,
            onSelect: handleShareImage
          }
        ]}
        borderRadius={8}>
        <Image source={{ uri: file.path, width: imageWidth, height: imageWidth }} style={{ borderRadius: 8 }} />
      </ContextMenu>
      <ImageView
        images={imagesForViewer.map(f => ({ uri: f.path }))}
        imageIndex={imageIndex >= 0 ? imageIndex : 0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
        presentationStyle="fullScreen"
        animationType="slide"
      />
      {onRemove && (
        <TouchableOpacity
          onPress={handleRemove}
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            borderRadius: 99
          }}>
          <CircleX size={20} color="$backgroundPrimary" borderRadius={99} backgroundColor="$gray60" />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default ImageItem
