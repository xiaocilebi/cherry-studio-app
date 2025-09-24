import { File, Paths } from 'expo-file-system'

export type LogSourceWithContext = {
  module?: string
  context?: Record<string, any>
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose' | 'silly'

// Use Expo's global __DEV__ variable. It's synchronous and readily available.
const IS_DEV = __DEV__

// The level map remains the same.
const LEVEL_MAP: Record<LogLevel, number> = {
  error: 5,
  warn: 4,
  info: 3,
  verbose: 2,
  debug: 1,
  silly: 0
}

// Default levels are adjusted slightly. In production, we'll log to a file by default.
const DEFAULT_CONSOLE_LEVEL = IS_DEV ? 'silly' : 'info'
const DEFAULT_FILE_LOG_LEVEL = 'info' // In mobile, it's useful to log info level to file even in prod

export class LoggerService {
  private static instance: LoggerService

  // Renamed 'level' to 'consoleLevel' for clarity
  private consoleLevel: LogLevel = DEFAULT_CONSOLE_LEVEL
  // Renamed 'logToMainLevel' to 'fileLogLevel'
  private fileLogLevel: LogLevel = DEFAULT_FILE_LOG_LEVEL

  // These properties remain the same
  private module: string = ''
  private context: Record<string, any> = {}

  // New properties for file logging
  private logFilePath: string
  private logQueue: string[] = []
  private isWritingToFile = false

  private constructor() {
    // Define the path for our log file in the app's private document directory
    this.logFilePath = `${Paths.document.uri}app.log`
    console.log(`[LoggerService] Log file path: ${this.logFilePath}`)
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService()
    }

    return LoggerService.instance
  }

  // initWindowSource is removed as it's not applicable to React Native.

  // withContext remains the same. It's a great pattern.
  // Using Object.create is efficient as it creates a new object with the original as its prototype.
  public withContext(module: string, context?: Record<string, any>): LoggerService {
    const newLogger = Object.create(this) as LoggerService

    newLogger.module = module
    // We create a new queue for the new logger instance to not interfere with others
    newLogger.logQueue = []
    newLogger.context = { ...this.context, ...context }

    return newLogger
  }

  private processLog(level: LogLevel, message: string, data: any[]): void {
    // --- 1. Console Logging ---
    const consoleLevelNumber = LEVEL_MAP[level]

    if (consoleLevelNumber >= LEVEL_MAP[this.consoleLevel]) {
      const logMessage = this.module ? `[${this.module}] ${message}` : message

      // Use the appropriate console method.
      // In React Native, console.log can handle objects better.
      switch (level) {
        case 'error':
          console.error(logMessage, ...data)
          break
        case 'warn':
          console.warn(logMessage, ...data)
          break
        case 'info':
          console.info(logMessage, ...data)
          break
        default: // verbose, debug, silly all map to console.log
          console.log(logMessage, ...data)
          break
      }
    }

    // --- 2. File Logging ---
    // Check if we should force logging to the file
    const lastArg = data.length > 0 ? data[data.length - 1] : undefined
    const forceLogToFile = typeof lastArg === 'object' && lastArg?.logToFile === true

    if (consoleLevelNumber >= LEVEL_MAP[this.fileLogLevel] || forceLogToFile) {
      const source: LogSourceWithContext = {
        module: this.module
      }

      if (Object.keys(this.context).length > 0) {
        source.context = this.context
      }

      // Remove the { logToFile: true } object before logging
      const fileLogData = forceLogToFile ? data.slice(0, -1) : data

      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...source,
        data: fileLogData
      }

      // Add formatted log to queue and trigger write
      this.logQueue.push(JSON.stringify(logEntry) + '\n')
      this.flushQueue()
    }
  }

  private async flushQueue(): Promise<void> {
    if (this.isWritingToFile || this.logQueue.length === 0) {
      return
    }

    this.isWritingToFile = true
    const logsToWrite = this.logQueue.splice(0).join('')

    try {
      const file = new File(this.logFilePath)
      file.write(logsToWrite)
    } catch (error) {
      console.error('[LoggerService] Failed to write to log file:', error)
    } finally {
      this.isWritingToFile = false

      // If new logs arrived during the write, process them
      if (this.logQueue.length > 0) {
        this.flushQueue()
      }
    }
  }

  // Public logging methods remain unchanged in their signature
  public error(message: string, ...data: any[]): void {
    this.processLog('error', message, data)
  }
  public warn(message: string, ...data: any[]): void {
    this.processLog('warn', message, data)
  }
  public info(message: string, ...data: any[]): void {
    this.processLog('info', message, data)
  }
  public verbose(message: string, ...data: any[]): void {
    this.processLog('verbose', message, data)
  }
  public debug(message: string, ...data: any[]): void {
    this.processLog('debug', message, data)
  }
  public silly(message: string, ...data: any[]): void {
    this.processLog('silly', message, data)
  }

  // --- Level Management Methods (Updated) ---
  public setConsoleLevel(level: LogLevel): void {
    this.consoleLevel = level
  }
  public getConsoleLevel(): string {
    return this.consoleLevel
  }
  public resetConsoleLevel(): void {
    this.setConsoleLevel(DEFAULT_CONSOLE_LEVEL)
  }

  public setFileLogLevel(level: LogLevel): void {
    this.fileLogLevel = level
  }
  public getFileLogLevel(): LogLevel {
    return this.fileLogLevel
  }
  public resetFileLogLevel(): void {
    this.setFileLogLevel(DEFAULT_FILE_LOG_LEVEL)
  }

  // --- New Utility Method for accessing the log file ---
  public async getLogFileContents(): Promise<string> {
    try {
      const file = new File(this.logFilePath)
      return file.text()
    } catch (e) {
      // ENOENT means file doesn't exist yet, which is fine.
      if ((e as any).code === 'ENOENT') {
        return ''
      }

      console.error('[LoggerService] Could not read log file:', e)
      return ''
    }
  }

  public async clearLogFile(): Promise<void> {
    const file = new File(this.logFilePath)
    file.delete()
  }

  public getLogFilePath(): string {
    return this.logFilePath
  }
}

export const loggerService = LoggerService.getInstance()
