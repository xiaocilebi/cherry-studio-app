import { Directory, File, Paths } from 'expo-file-system/next'
import { unzip } from 'react-native-zip-archive'

import { loggerService } from '@/services/LoggerService'
import { Assistant } from '@/types/assistant'
import { BackupData, ExportIndexedData, ExportReduxData } from '@/types/databackup'
import { FileType } from '@/types/file'
import { Message } from '@/types/message'

import { upsertAssistants } from '../../db/queries/assistants.queries'
import { upsertBlocks } from '../../db/queries/messageBlocks.queries'
import { upsertMessages } from '../../db/queries/messages.queries'
import { upsertProviders } from '../../db/queries/providers.queries'
import { upsertWebSearchProviders } from '../../db/queries/websearchProviders.queries'
import { upsertTopics } from './TopicService'
const logger = loggerService.withContext('Backup Service')

const fileStorageDir = new Directory(Paths.cache, 'Files')

export type RestoreStepId =
  | 'restore_topics'
  | 'restore_messages_blocks'
  | 'restore_llm_providers'
  | 'restore_assistants'
  | 'restore_websearch'

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'error'

export type ProgressUpdate = {
  step: RestoreStepId
  status: StepStatus
  error?: string
}

type OnProgressCallback = (update: ProgressUpdate) => void

async function restoreIndexedDbData(data: ExportIndexedData, onProgress: OnProgressCallback) {
  onProgress({ step: 'restore_topics', status: 'in_progress' })
  await upsertTopics(data.topics)
  onProgress({ step: 'restore_topics', status: 'completed' })

  onProgress({ step: 'restore_messages_blocks', status: 'in_progress' })
  await upsertBlocks(data.message_blocks)
  await upsertMessages(data.messages)
  onProgress({ step: 'restore_messages_blocks', status: 'completed' })
}

async function restoreReduxData(data: ExportReduxData, onProgress: OnProgressCallback) {
  onProgress({ step: 'restore_llm_providers', status: 'in_progress' })
  await upsertProviders(data.llm.providers)
  onProgress({ step: 'restore_llm_providers', status: 'completed' })

  onProgress({ step: 'restore_assistants', status: 'in_progress' })
  const allSourceAssistants = [data.assistants.defaultAssistant, ...data.assistants.assistants]

  // default assistant为built_in, 其余为external
  const assistants = allSourceAssistants.map(
    (assistant, index) =>
      ({
        ...assistant,
        type: index === 0 ? 'system' : 'external'
      }) as Assistant
  )
  await upsertAssistants(assistants)
  onProgress({ step: 'restore_assistants', status: 'completed' })

  onProgress({ step: 'restore_websearch', status: 'in_progress' })
  await upsertWebSearchProviders(data.websearch.providers)
  onProgress({ step: 'restore_websearch', status: 'completed' })
}

export async function restore(backupFile: Omit<FileType, 'md5'>, onProgress: OnProgressCallback) {
  if (!fileStorageDir.exists) {
    fileStorageDir.create({ intermediates: true, overwrite: true })
  }

  try {
    const dataDir = Paths.join(fileStorageDir, backupFile.name.replace('.zip', ''))
    await unzip(backupFile.path, fileStorageDir.uri)
    const dataFile = new File(dataDir, 'data.json')

    const data = JSON.parse(dataFile.text()) as BackupData

    const { reduxData, indexedData } = transformBackupData(data)

    await restoreIndexedDbData(indexedData, onProgress)
    await restoreReduxData(reduxData, onProgress)
  } catch (error) {
    logger.error('restore error: ', error)
    throw error
  }
}

function transformBackupData(data: BackupData): { reduxData: ExportReduxData; indexedData: ExportIndexedData } {
  const topicsFromRedux = data.redux.assistants.assistants.flatMap(a => a.topics)

  const allMessages = data.indexedDB.topics.flatMap(t => t.messages)

  const messagesByTopicId = allMessages.reduce<Record<string, Message[]>>((acc, message) => {
    const { topicId } = message

    if (!acc[topicId]) {
      acc[topicId] = []
    }

    acc[topicId].push(message)
    return acc
  }, {})

  // 4. 遍历 redux 中的 topics，并将分组后的 messages 附加到每个 topic 上
  const topicsWithMessages = topicsFromRedux.map(topic => {
    const correspondingMessages = messagesByTopicId[topic.id] || []

    return {
      ...topic,
      messages: correspondingMessages
    }
  })

  return {
    reduxData: data.redux as ExportReduxData,
    indexedData: {
      topics: topicsWithMessages,
      message_blocks: data.indexedDB.message_blocks,
      messages: allMessages
    }
  }
}
