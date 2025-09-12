import React, { memo } from 'react'
import { View } from 'tamagui'

import ImageItem from '@/components/message-input/preview-items/ImageItem'
import ImageSkeleton from '@/components/ui/ImageSkeleton'
import { ImageMessageBlock, MessageBlockStatus } from '@/types/message'

interface Props {
  block: ImageMessageBlock
}

const ImageBlock: React.FC<Props> = ({ block }) => {
  if (block.status === MessageBlockStatus.PENDING)
    return (
      <View marginTop={10}>
        <ImageSkeleton />
      </View>
    )

  const uploadedFile = block.file

  if (!uploadedFile) {
    return null
  }

  if (uploadedFile) {
    return (
      <View marginTop={10}>
        <ImageItem file={uploadedFile} />
      </View>
    )
  }

  return null
}

export default memo(ImageBlock)
