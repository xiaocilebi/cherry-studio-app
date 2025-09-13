import { Download, ImageOff, Share, X } from '@tamagui/lucide-icons'
import { FC, useState } from 'react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import ImageView from 'react-native-image-viewing'
import { Image, useWindowDimensions, View } from 'tamagui'

import ContextMenu from '@/components/ui/ContextMenu'
import { useToast } from '@/hooks/useToast'
import { shareFile } from '@/services/FileService'
import { saveImageToGallery } from '@/services/ImageService'
import { loggerService } from '@/services/LoggerService'
import { FileMetadata } from '@/types/file'

const logger = loggerService.withContext('Image Item')

interface ImageItemProps {
  file: FileMetadata
  allImages?: FileMetadata[]
  onRemove?: (file: FileMetadata) => void
  size?: number
  disabledContextMenu?: boolean
}

const ImageItem: FC<ImageItemProps> = ({ file, allImages = [], onRemove, size, disabledContextMenu }) => {
  const [visible, setIsVisible] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imagesForViewer = allImages.length > 0 ? allImages : [file]
  const imageIndex = imagesForViewer.findIndex(img => img.path === file.path)
  const { width: screenWidth } = useWindowDimensions()
  // Default size is 30% of the (screen width - gap)
  const imageWidth = size ? size : (screenWidth - 24) * 0.3
  const { t } = useTranslation()
  const toast = useToast()

  const handleRemove = e => {
    e.stopPropagation()
    onRemove?.(file)
  }

  const handleImageError = () => {
    setImageError(true)
    logger.warn('Image failed to load:', file.path)
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
        onPress={() => !imageError && setIsVisible(true)}
        disableContextMenu={disabledContextMenu || imageError}
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
        borderRadius={10}>
        {imageError ? (
          <View
            width={imageWidth}
            height={imageWidth}
            borderRadius={10}
            backgroundColor="$gray20"
            alignItems="center"
            justifyContent="center">
            <ImageOff size={imageWidth * 0.3} color="$gray20" />
          </View>
        ) : (
          <Image
            source={{ uri: file.path, width: imageWidth, height: imageWidth }}
            style={{ borderRadius: 10, backgroundColor: '$gray10' }}
            onError={handleImageError}
          />
        )}
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
    </View>
  )
}

export default ImageItem
