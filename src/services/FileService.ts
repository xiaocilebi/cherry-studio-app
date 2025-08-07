import * as FileSystem from 'expo-file-system'
import { Directory, File, Paths } from 'expo-file-system/next'

import { loggerService } from '@/services/LoggerService'
import { FileType, FileTypes } from '@/types/file'
import { uuid } from '@/utils'

import { deleteFileById, getAllFiles, getFileById, upsertFiles } from '../../db/queries/files.queries'
const logger = loggerService.withContext('File Service')

const fileStorageDir = new Directory(Paths.cache, 'Files')

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
  if (!fileStorageDir.exists) {
    fileStorageDir.create({ intermediates: true, overwrite: true })
  }

  const filePromises = files.map(async file => {
    try {
      const sourceFile = new File(file.path)
      const destinationFile = new File(fileStorageDir, `${file.id}.${file.ext}`)
      upsertFiles([
        { ...file, path: destinationFile.uri, mime_type: destinationFile.type || '', md5: destinationFile.md5 || '' }
      ])
      sourceFile.copy(destinationFile)
      return {
        ...file,
        mime_type: destinationFile.type || '',
        md5: destinationFile.md5 || '',
        path: destinationFile.uri
      }
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

export default {
  readFile,
  readBase64File,
  readBinaryFile,
  readStreamFile,
  getFile: getFileById,
  getAllFiles,
  uploadFiles,
  deleteFiles
}
