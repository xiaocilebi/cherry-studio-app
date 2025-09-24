import { FC, useState } from 'react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, useWindowDimensions, View } from 'react-native'
import ImageView from 'react-native-image-viewing'

import { useToast } from '@/hooks/useToast'
import { shareFile } from '@/services/FileService'
import { saveImageToGallery } from '@/services/ImageService'
import { loggerService } from '@/services/LoggerService'
import { FileMetadata } from '@/types/file'
import { Download, Share, X, ImageOff } from '@/componentsV2/icons'
import { ContextMenu } from '@/componentsV2/base/ContextMenu'
import Image from '@/componentsV2/base/Image'
import ImageViewerFooterComponent from '@/componentsV2/base/ImageViewerFooterComponent'

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

  const handleRemove = (e: any) => {
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
        toast.show(result.message, { color: 'red', duration: 2500 })
        logger.warn('Failed to save image:', result.message)
      }
    } catch (error) {
      toast.show(t('common.error_occurred'), { color: 'red', duration: 2500 })
      logger.error('Error in handleSaveImage:', error)
    }
  }

  const handleShareImage = async () => {
    try {
      const result = await shareFile(file.path)

      if (result.success) {
        logger.info('Image shared successfully')
      } else {
        toast.show(result.message, { color: 'red', duration: 2500 })
        logger.warn('Failed to share image:', result.message)
      }
    } catch (error) {
      toast.show(t('common.error_occurred'), { color: 'red', duration: 2500 })
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
            androidIcon: <Download size={16} className="text-text-primary dark:text-text-primary-dark" />,
            onSelect: handleSaveImage
          },
          {
            title: t('button.share'),
            iOSIcon: 'square.and.arrow.up',
            androidIcon: <Share size={16} className="text-text-primary dark:text-text-primary-dark" />,
            onSelect: handleShareImage
          }
        ]}
        borderRadius={10}>
        {imageError ? (
          <View
            className="bg-gray-5 dark:bg-gray-dark-5 items-center justify-center rounded-2.5"
            style={{
              width: imageWidth,
              height: imageWidth
            }}>
            <ImageOff size={imageWidth * 0.3} className="text-gray-20 dark:text-gray-dark-20" />
          </View>
        ) : (
          <Image
            style={{ width: imageWidth, height: imageWidth }}
            source={{ uri: file.path }}
            className="rounded-sm"
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
        FooterComponent={({ imageIndex: idx }: any) => (
          <ImageViewerFooterComponent
            uri={(imagesForViewer[idx] || file).path}
            onSaved={() => setIsVisible(false)}
          />
        )}
      />
      {onRemove && (
        <TouchableOpacity onPress={handleRemove} hitSlop={5} className="absolute -top-1.5 -right-1.5 rounded-full">
          <View className="border border-white rounded-full p-0.5">
            <X size={14} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default ImageItem
