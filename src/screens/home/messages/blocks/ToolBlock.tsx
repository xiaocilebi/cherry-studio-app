import React from 'react'
import { View } from 'tamagui'

import { ToolMessageBlock } from '@/types/message'

import MessageTools from '../tools/MessageTools'

interface Props {
  block: ToolMessageBlock
}

const ToolBlock: React.FC<Props> = ({ block }) => {
  return (
    <View>
      <MessageTools block={block} />
    </View>
  )
}

export default React.memo(ToolBlock)
