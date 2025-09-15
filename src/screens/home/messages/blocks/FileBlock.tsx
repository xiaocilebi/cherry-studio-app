import { memo } from 'react'
import React from 'react'

import FileItem from '@/components/message-input/preview-items/FileItem'
import { FileMessageBlock } from '@/types/message'

interface Props {
  block: FileMessageBlock
}

const FileBlock: React.FC<Props> = ({ block }) => {
  return <FileItem file={block.file} />
}

export default memo(FileBlock)
