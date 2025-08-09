import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'

import { uploadFiles } from '@/services/FileService'
import { loggerService } from '@/services/LoggerService'
import { FileType, FileTypes } from '@/types/file'
import { uuid } from '@/utils'
import { getFileType } from '@/utils/file'

const logger = loggerService.withContext('File Handler')

interface UseFileHandlerProps {
  files: FileType[]
  setFiles: (files: FileType[]) => void
  onSuccess?: () => void
}

export const useFileHandler = ({ files, setFiles, onSuccess }: UseFileHandlerProps) => {
  const handleAddImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.2
      })

      if (result.canceled) {
        return
      }

      const _files: Omit<FileType, 'md5'>[] = result.assets.map(asset => {
        const id = uuid()
        return {
          id: id,
          name: asset.fileName || id,
          origin_name: asset.fileName || id,
          path: asset.uri,
          size: asset.fileSize || 0,
          ext: asset.fileName?.split('.').pop() || 'png',
          type: getFileType(asset.fileName?.split('.').pop() || 'png'),
          mime_type: asset.mimeType || '',
          created_at: new Date().toISOString(),
          count: 1
        }
      })

      const uploadedFiles = await uploadFiles(_files)
      setFiles([...files, ...uploadedFiles])
      onSuccess?.()
    } catch (error) {
      logger.error('Error selecting image:', error)
    }
  }

  const handleAddFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ multiple: true })

      if (result.canceled) {
        return
      }

      const _files: Omit<FileType, 'md5'>[] = result.assets.map(asset => {
        return {
          id: uuid(),
          name: asset.name,
          origin_name: asset.name,
          path: asset.uri,
          size: asset.size || 0,
          ext: asset.name.split('.').pop() || '',
          type: getFileType(asset.name.split('.').pop() || ''),
          mime_type: asset.mimeType || '',
          created_at: new Date().toISOString(),
          count: 1
        }
      })

      const uploadedFiles = await uploadFiles(_files)
      setFiles([...files, ...uploadedFiles])
      onSuccess?.()
    } catch (error) {
      logger.error('Error selecting file:', error)
    }
  }

  const handleAddPhotoFromCamera = async (photoUri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(photoUri)

      if (!fileInfo.exists) {
        logger.error('Photo from camera not found at uri:', photoUri)
        return
      }

      const id = uuid()
      const fileName = photoUri.split('/').pop() || `${id}.jpg`
      const _file: Omit<FileType, 'md5'> = {
        id: id,
        name: fileName,
        origin_name: fileName,
        path: photoUri,
        size: fileInfo.size,
        ext: 'jpg',
        type: FileTypes.IMAGE,
        mime_type: 'image/jpeg',
        created_at: new Date().toISOString(),
        count: 1
      }

      const uploadedFiles = await uploadFiles([_file])
      setFiles([...files, ...uploadedFiles])
    } catch (error) {
      logger.error('Error processing camera photo:', error)
    }
  }

  return {
    handleAddImage,
    handleAddFile,
    handleAddPhotoFromCamera
  }
}
