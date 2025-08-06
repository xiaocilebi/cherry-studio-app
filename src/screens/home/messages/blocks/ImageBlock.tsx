import React, { memo } from 'react'
import { View } from 'tamagui'

import ImageItem from '@/components/message-input/preview-items/ImageItem'
import ImageSkeleton from '@/components/ui/ImageSkeleton'
import { FileType, FileTypes } from '@/types/file'
import { ImageMessageBlock, MessageBlockStatus } from '@/types/message'
import { uuid } from '@/utils'

interface Props {
  block: ImageMessageBlock
}

const ImageBlock: React.FC<Props> = ({ block }) => {
  if (block.status === MessageBlockStatus.PENDING)
    return (
      <View style={{ paddingHorizontal: 10 }}>
        <ImageSkeleton />
      </View>
    )

  const generatedImages = block.metadata?.generateImageResponse?.images
  const uploadedFile = block.file

  if (!generatedImages?.length && !uploadedFile) {
    return null
  }

  // Handle generated images
  if (generatedImages?.length) {
    const imageFiles: FileType[] = generatedImages.map(url => ({
      id: uuid(),
      name: 'generated image',
      origin_name: 'generated image',
      size: 0,
      path: url,
      type: FileTypes.IMAGE,
      ext: '',
      mime_type: '',
      created_at: '',
      count: 1,
      md5: ''
    }))

    return (
      <View flexDirection="row" flexWrap="wrap" gap={5} style={{ paddingHorizontal: 10 }}>
        {imageFiles.map(file => (
          <ImageItem key={file.path} file={file} allImages={imageFiles} />
        ))}
      </View>
    )
  }

  // Handle single uploaded file
  if (uploadedFile) {
    return (
      <View style={{ paddingHorizontal: 10 }}>
        <ImageItem file={uploadedFile} />
      </View>
    )
  }

  return null
}

export default memo(ImageBlock)
