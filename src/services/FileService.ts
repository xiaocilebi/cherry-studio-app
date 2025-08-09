import * as FileSystem from 'expo-file-system'
import { Directory, File, Paths } from 'expo-file-system/next'

import { loggerService } from '@/services/LoggerService'
import { FileType, FileTypes } from '@/types/file'
import { uuid } from '@/utils'

import { deleteFileById, getAllFiles, getFileById, upsertFiles } from '../../db/queries/files.queries'
const logger = loggerService.withContext('File Service')

const fileStorageDir = new Directory(Paths.cache, 'Files')

// 辅助函数，确保目录存在
async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(fileStorageDir.uri)

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(fileStorageDir.uri, { intermediates: true })
  }
}

export function readFile(file: FileType): string {
  return new File(file.path).text()
}

export function readBase64File(file: FileType): string {
  return new File(file.path).base64()
}

export async function writeBase64File(data: string): Promise<FileType> {
  if (!fileStorageDir.exists) {
    fileStorageDir.create({ intermediates: true, overwrite: true })
  }

  const cleanedBase64 = data.includes('data:image') ? data.split(',')[1] : data

  const fileName = uuid()
  const fileUri = fileStorageDir.uri + `${fileName}.png`

  await FileSystem.writeAsStringAsync(fileUri, cleanedBase64, {
    encoding: FileSystem.EncodingType.Base64
  })

  return {
    id: fileName,
    name: fileName,
    origin_name: fileName,
    path: fileUri,
    size: 0,
    ext: '.png',
    type: FileTypes.IMAGE,
    mime_type: 'image/png',
    created_at: '',
    count: 1,
    md5: ''
  }
}

export function readBinaryFile(file: FileType): Blob {
  return new File(file.path).blob()
}

export function readStreamFile(file: FileType): ReadableStream {
  return new File(file.path).readableStream()
}

export async function uploadFiles(files: Omit<FileType, 'md5'>[]): Promise<FileType[]> {
  await ensureDirExists()
  const filePromises = files.map(async file => {
    try {
      const sourceUri = file.path
      const destinationUri = `${fileStorageDir.uri}${file.id}.${file.ext}`

      await FileSystem.copyAsync({
        from: sourceUri,
        to: destinationUri
      })

      const fileInfo = await FileSystem.getInfoAsync(destinationUri, {
        size: true,
        md5: true
      })

      if (!fileInfo.exists) {
        throw new Error('Failed to copy file or get info.')
      }

      const finalFile: FileType = {
        ...file,
        path: destinationUri,
        size: fileInfo.size,
        md5: fileInfo.md5 || ''
      }
      upsertFiles([finalFile])
      return finalFile
    } catch (error) {
      logger.error('Error uploading file:', error)
      throw new Error(`Failed to upload file: ${file.name}`)
    }
  })
  return await Promise.all(filePromises)
}

async function deleteFile(id: string, force: boolean = false): Promise<void> {
  try {
    const file = await getFileById(id)
    if (!file) return
    const sourceFile = new File(file.path)

    if (!force && file.count > 1) {
      upsertFiles([{ ...file, count: file.count - 1 }])
      return
    }

    deleteFileById(id)

    sourceFile.delete()
  } catch (error) {
    logger.error('Error deleting file:', error)
    throw new Error(`Failed to delete file: ${id}`)
  }
}

export async function deleteFiles(files: FileType[]): Promise<void> {
  await Promise.all(files.map(file => deleteFile(file.id)))
}

export async function resetCacheDirectory() {
  try {
    // Delete Files directory
    const filesDirectory = new Directory(Paths.cache, 'Files')

    if (filesDirectory.exists) {
      filesDirectory.delete()
    }

    // Delete ImagePicker directory
    const imagePickerDirectory = new Directory(Paths.cache, 'ImagePicker')

    if (imagePickerDirectory.exists) {
      imagePickerDirectory.delete()
    }

    // Delete DocumentPicker directory
    const documentPickerDirectory = new Directory(Paths.cache, 'DocumentPicker')

    if (documentPickerDirectory.exists) {
      documentPickerDirectory.delete()
    }

    // Recreate Files directory
    await FileSystem.makeDirectoryAsync(fileStorageDir.uri, { intermediates: true })
  } catch (error) {
    logger.error('resetCacheDirectory', error)
  }
}

export async function getDirectorySizeAsync(directoryUri: string): Promise<number> {
  try {
    const directory = new Directory(directoryUri)

    if (!directory.exists) {
      return 0
    }

    let totalSize = 0
    const contents = directory.list()

    for (const item of contents) {
      if (item instanceof Directory) {
        totalSize += await getDirectorySizeAsync(item.uri)
      } else {
        totalSize += item.size || 0
      }
    }

    return totalSize
  } catch (error) {
    console.error('无法计算目录大小:', error)
    return 0
  }
}

/**
 * Get Cache Directory Size
 * @returns Cache Directory Size
 */
export async function getCacheDirectorySize() {
  // imagePicker and documentPicker will copy files to File, so size will double compututaion
  // this is not equal to ios system cache storage
  const filesDirectory = new Directory(Paths.cache, 'Files')
  // const imagePickerDirectory = new Directory(Paths.cache, 'ImagePicker')
  // const documentPickerDirectory = new Directory(Paths.cache, 'DocumentPicker')

  const filesSize = await getDirectorySizeAsync(filesDirectory.uri)
  // const imageSize = await getDirectorySizeAsync(imagePickerDirectory.uri)
  // const documentSize = await getDirectorySizeAsync(documentPickerDirectory.uri)

  // return filesSize + imageSize + documentSize
  return filesSize
}

export default {
  readFile,
  readBase64File,
  readBinaryFile,
  readStreamFile,
  getFile: getFileById,
  getAllFiles,
  uploadFiles,
  deleteFiles,
  resetCacheDirectory,
  getDirectorySizeAsync,
  getCacheDirectorySize
}
