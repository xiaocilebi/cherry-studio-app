import React, { FC } from 'react'
import { View } from 'tamagui'

import { FileMetadata, FileTypes } from '@/types/file'
import ImageItem from './ImageItem'
import FileItem from './FileItem'


interface PreviewItemProps {
  file: FileMetadata
  files: FileMetadata[]
  setFiles: (files: FileMetadata[]) => void
}

const PreviewItem: FC<PreviewItemProps> = ({ file, files, setFiles }) => {
  const handleRemove = () => {
    setFiles(files.filter(f => f.path !== file.path))
  }

  const isImage = file.type === FileTypes.IMAGE

  return (
    <View style={{ marginRight: 10, marginTop: 8 }}>
      {isImage ? (
        <ImageItem
          file={file}
          allImages={files.filter(f => f.type === FileTypes.IMAGE)}
          onRemove={handleRemove}
          size={44}
          disabledContextMenu
        />
      ) : (
        <FileItem file={file} onRemove={handleRemove} disabledContextMenu />
      )}
    </View>
  )
}

export default PreviewItem
