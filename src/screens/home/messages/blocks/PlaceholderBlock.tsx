import React from 'react'
import { Spinner, View } from 'tamagui'

import { MessageBlockStatus, MessageBlockType, PlaceholderMessageBlock } from '@/types/message'

interface PlaceholderBlockProps {
  block: PlaceholderMessageBlock
}

const PlaceholderBlock: React.FC<PlaceholderBlockProps> = ({ block }) => {
  if (block.status === MessageBlockStatus.PROCESSING && block.type === MessageBlockType.UNKNOWN) {
    return (
      <View flex={1} alignItems="flex-start">
        <Spinner size="small" color="$gray" />
      </View>
    )
  }
}

export default React.memo(PlaceholderBlock)
