import React, { memo } from 'react'

import ImageItem from '@/components/message-input/preview-items/ImageItem'
import ImageSkeleton from '@/components/ui/ImageSkeleton'
import { ImageMessageBlock, MessageBlockStatus } from '@/types/message'

interface Props {
  block: ImageMessageBlock
}

const ImageBlock: React.FC<Props> = ({ block }) => {
  if (block.status === MessageBlockStatus.PENDING) return <ImageSkeleton />

  const uploadedFile = block.file

  if (!uploadedFile) {
    return null
  }

  if (uploadedFile) {
    return <ImageItem file={uploadedFile} />
  }

  return null
}

export default memo(ImageBlock)
