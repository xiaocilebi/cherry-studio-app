import React from 'react'
import { ScrollView } from 'tamagui'

import { FileMetadata } from '@/types/file'
import PreviewItem from '@/componentsV2/features/ChatScreen/MessageInput/PreviewItems/PreviewItem'


interface FilePreviewProps {
  files: FileMetadata[]
  setFiles: (files: FileMetadata[]) => void
}

const FilePreview: React.FC<FilePreviewProps> = ({ files, setFiles }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
      {files.map((file, index) => (
        <PreviewItem key={index} file={file} files={files} setFiles={setFiles} />
      ))}
    </ScrollView>
  )
}

export default FilePreview
