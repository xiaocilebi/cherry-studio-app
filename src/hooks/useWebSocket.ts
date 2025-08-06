import * as FileSystem from 'expo-file-system'
import { File, Paths } from 'expo-file-system/next'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import { loggerService } from '@/services/LoggerService'
const logger = loggerService.withContext('useWebSocket')

// 定义 WebSocket 连接状态的枚举
export enum WebSocketStatus {
  IDLE = 'idle',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ZIP_FILE_START = 'zip_file_start',
  ZIP_FILE_END = 'zip_file_end',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

export function useWebSocket() {
  const socket = useRef<Socket | null>(null)
  const zipFileInfo = useRef<{ filename: string; totalSize: number }>({ filename: '', totalSize: 0 })
  const zipFileChunk = useRef<{ chunk: Uint8Array[]; size: number }>({ chunk: [], size: 0 })

  const [status, setStatus] = useState<WebSocketStatus>(WebSocketStatus.IDLE)
  const [progress, setProgress] = useState<number>(0)
  const [filename, setFilename] = useState<string>('')

  useEffect(() => {
    return () => {
      socket.current?.disconnect()
      socket.current = null
    }
  }, [])

  // 写入文件的函数
  const writeZipFile = async () => {
    try {
      await FileSystem.makeDirectoryAsync(Paths.join(Paths.cache, 'Files'), { intermediates: true })
      // 文件路径 Paths.cache + zipFileInfo.current.filename
      const file = new File(Paths.join(Paths.cache, 'Files'), zipFileInfo.current.filename)

      if (file.exists) {
        file.delete()
      }

      // 合并所有 chunk 为一个完整的 Uint8Array
      const totalSize = zipFileChunk.current.size
      const completeData = new Uint8Array(totalSize)
      let offset = 0

      for (const chunk of zipFileChunk.current.chunk) {
        completeData.set(chunk, offset)
        offset += chunk.length
      }

      // 创建文件并写入数据
      file.create()
      file.write(completeData)

      logger.info(`File ${file.name} saved successfully`)
      logger.info(`File Path: ${file.uri}`)

      // 清理缓存数据
      zipFileChunk.current = { chunk: [], size: 0 }
      zipFileInfo.current = { filename: '', totalSize: 0 }
    } catch (error) {
      logger.error('Failed to write zip file:', error)
      setStatus(WebSocketStatus.ERROR)
    }
  }

  const connect = async (ip: string) => {
    if (socket.current) {
      return
    }

    try {
      setStatus(WebSocketStatus.CONNECTING)
      logger.info('ip', ip)
      socket.current = io(`http://${ip}`, { timeout: 5000, reconnection: true })

      // 连接客户端
      socket.current.on('connect', () => {
        logger.info('connected to WebSocket server')
        setStatus(WebSocketStatus.CONNECTED)
        socket.current?.emit('message', 'This is from iPhone')
      })

      // 接收连接成功消息
      socket.current.on('message_received', (data: { success: boolean }) => {
        logger.info('message received from WebSocket server:', data)
      })

      // 断开连接
      socket.current.on('disconnect', () => {
        logger.info('disconnected from WebSocket server')
        setStatus(WebSocketStatus.DISCONNECTED)
        socket.current = null
      })

      // 连接错误
      socket.current.on('connect_error', error => {
        logger.error('WebSocket connection error:', error)
        setStatus(WebSocketStatus.ERROR)
        socket.current = null
      })

      // 文件接收开始
      socket.current.on('zip-file-start', (data: { filename: string; totalSize: number }) => {
        logger.info('zip-file-start:', data)
        setStatus(WebSocketStatus.ZIP_FILE_START)
        zipFileInfo.current = data
        setFilename(data.filename)
      })

      // 文件接收过程
      // todo: progress无法实时更新
      socket.current.on('zip-file-chunk', (chunk: ArrayBuffer) => {
        const chunkData = new Uint8Array(chunk)
        zipFileChunk.current.chunk.push(chunkData)
        zipFileChunk.current.size += chunkData.length
        const progress = Math.min((zipFileChunk.current.size / zipFileInfo.current.totalSize) * 100, 100)
        setProgress(progress)
        logger.info('zip-file-chunk:', Math.floor(progress), '%')
      })

      // 文件接收结束
      socket.current.on('zip-file-end', async () => {
        logger.info('zip-file-end')

        // 写入文件
        await writeZipFile()
        setStatus(WebSocketStatus.ZIP_FILE_END)
        setProgress(100)
      })
    } catch (error) {
      logger.error('Failed to get IP address:', error)
      setStatus(WebSocketStatus.ERROR)
    }
  }

  const disconnect = () => {
    socket.current?.disconnect()
    socket.current = null
  }

  return { connect, status, progress, filename, disconnect }
}
