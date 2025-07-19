import { eq } from 'drizzle-orm'

import { loggerService } from '@/services/LoggerService'
import { Assistant } from '@/types/assistant'
import { safeJsonParse } from '@/utils/json'

import { db } from '..'
import { assistants } from '../schema'
import { transformDbToTopic } from './topics.queries'

const logger = loggerService.withContext('DataBase Assistants')

/**
 * 将数据库记录转换为 Assistant 类型。
 * @param dbRecord - 从数据库检索的记录。
 * @returns 一个 Assistant 对象。
 */
export function transformDbToAssistant(dbRecord: any): Assistant {
  const topics = Array.isArray(dbRecord.topics) ? dbRecord.topics.map(transformDbToTopic) : []
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    prompt: dbRecord.prompt,
    // knowledgeIds: safeJsonParse(dbRecord.knowledge_ids, []),
    type: dbRecord.type,
    emoji: dbRecord.emoji,
    description: dbRecord.description,
    model: safeJsonParse(dbRecord.model),
    defaultModel: safeJsonParse(dbRecord.default_model),
    settings: safeJsonParse(dbRecord.settings),
    enableWebSearch: !!dbRecord.enable_web_search,
    webSearchProviderId: dbRecord.websearch_provider_id,
    enableGenerateImage: !!dbRecord.enable_generate_image,
    // mcpServers: safeJsonParse(dbRecord.mcp_servers),
    knowledgeRecognition: dbRecord.knowledge_recognition,
    tags: safeJsonParse(dbRecord.tags, []),
    group: safeJsonParse(dbRecord.group, []),
    topics: topics,
    isStar: dbRecord.isStar
  }
}

/**
 * 将 Assistant 对象转换为数据库记录格式。
 * @param assistant - Assistant 对象。
 * @returns 一个适合数据库操作的对象。
 */
function transformAssistantToDb(assistant: Assistant): any {
  return {
    id: assistant.id,
    name: assistant.name,
    prompt: assistant.prompt,
    // knowledge_ids: assistant.knowledgeIds ? JSON.stringify(assistant.knowledgeIds) : null,
    type: assistant.type,
    emoji: assistant.emoji,
    description: assistant.description,
    model: assistant.model ? JSON.stringify(assistant.model) : null,
    default_model: assistant.defaultModel ? JSON.stringify(assistant.defaultModel) : null,
    settings: assistant.settings ? JSON.stringify(assistant.settings) : null,
    enable_web_search: assistant.enableWebSearch ? 1 : 0,
    websearch_provider_id: assistant.webSearchProviderId === undefined ? null : assistant.webSearchProviderId,
    enable_generate_image: assistant.enableGenerateImage ? 1 : 0,
    // mcp_servers: assistant.mcpServers ? JSON.stringify(assistant.mcpServers) : null,
    knowledge_recognition: assistant.knowledgeRecognition,
    tags: assistant.tags ? JSON.stringify(assistant.tags) : null,
    group: assistant.group ? JSON.stringify(assistant.group) : null,
    isStar: assistant.isStar || false
  }
}

/**
 * 获取所有助手。
 * @returns 一个包含所有 Assistant 对象的数组。
 */
export async function getAllAssistants(): Promise<Assistant[]> {
  try {
    const result = await db.select().from(assistants)
    return result.map(transformDbToAssistant)
  } catch (error) {
    logger.error('Error getting all assistants:', error)
    throw error
  }
}

export async function getStarredAssistants(): Promise<Assistant[]> {
  try {
    const results = await db.query.assistants.findMany({
      where: eq(assistants.isStar, true),
      with: {
        topics: true
      }
    })
    return results.map(transformDbToAssistant)
  } catch (error) {
    logger.error('Error getting star assistants:', error)
    throw error
  }
}

export async function getAssistantById(id: string): Promise<Assistant | null> {
  try {
    const result = await db.select().from(assistants).where(eq(assistants.id, id)).limit(1)

    if (result.length === 0) {
      return null
    }

    return transformDbToAssistant(result[0])
  } catch (error) {
    logger.error('Error getting assistant by ID:', error)
    throw error
  }
}

/**
 *
 * @param assistantsToUpsert 要插入或更新的助手数组。
 * @returns 无返回值。
 * @description 此函数将尝试插入或更新助手记录到数据库中。
 */
export async function upsertAssistants(assistantsToUpsert: Assistant[]) {
  try {
    const dbRecords = assistantsToUpsert.map(transformAssistantToDb)
    const upsertPromises = dbRecords.map(record =>
      db
        .insert(assistants)
        .values(record)
        .onConflictDoUpdate({
          target: [assistants.id],
          set: record
        })
    )
    await Promise.all(upsertPromises)
  } catch (error) {
    logger.error('Error upserting assistants:', error)
    throw error
  }
}

export async function deleteAssistantById(id: string) {
  try {
    await db.delete(assistants).where(eq(assistants.id, id))
  } catch (error) {
    logger.error(`Error deleting assistant with ID ${id}:`, error)
    throw error
  }
}
