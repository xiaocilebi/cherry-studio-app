import { eq, inArray, InferInsertModel } from 'drizzle-orm'

import { loggerService } from '@/services/LoggerService'
import {
  CitationMessageBlock,
  CodeMessageBlock,
  FileMessageBlock,
  ImageMessageBlock,
  MainTextMessageBlock,
  MessageBlock,
  MessageBlockStatus,
  MessageBlockType,
  ThinkingMessageBlock,
  ToolMessageBlock,
  TranslationMessageBlock
} from '@/types/message'

import { db } from '..'
import { messageBlocks, messages } from '../schema'
const logger = loggerService.withContext('DataBase Message Blocks')

type MessageBlockDbInsert = InferInsertModel<typeof messageBlocks>

function transformPartialMessageBlockToDb(changes: Partial<MessageBlock>): Partial<MessageBlockDbInsert> {
  const dbChanges: Partial<MessageBlockDbInsert> = {}

  for (const key in changes) {
    if (!Object.prototype.hasOwnProperty.call(changes, key)) continue

    // The switch operates on the string `key`.
    switch (key) {
      // --- Base fields (accessible on `changes` directly) ---
      case 'messageId':
        dbChanges.message_id = changes.messageId
        break
      case 'type':
        dbChanges.type = changes.type
        break
      case 'createdAt':
        dbChanges.created_at = changes.createdAt
        break
      case 'updatedAt':
        dbChanges.updated_at = changes.updatedAt
        break
      case 'status':
        dbChanges.status = changes.status
        break
      case 'model':
        dbChanges.model = changes.model ? JSON.stringify(changes.model) : null
        break
      case 'metadata':
        dbChanges.metadata = changes.metadata ? JSON.stringify(changes.metadata) : null
        break
      case 'error':
        dbChanges.error = changes.error ? JSON.stringify(changes.error) : null
        break

      // --- Type-specific fields (require casting) ---
      case 'content': {
        // 'content' can be a string or an object (for ToolBlock).
        // We cast to a union of all types that have a 'content' property.
        const content = (
          changes as Partial<
            MainTextMessageBlock | ThinkingMessageBlock | TranslationMessageBlock | CodeMessageBlock | ToolMessageBlock
          >
        ).content

        if (typeof content === 'object' && content !== null) {
          dbChanges.content = JSON.stringify(content)
        } else {
          dbChanges.content = content as string | null
        }

        break
      }

      case 'knowledgeBaseIds':
        dbChanges.knowledge_base_ids = (changes as Partial<MainTextMessageBlock>).knowledgeBaseIds
          ? JSON.stringify((changes as Partial<MainTextMessageBlock>).knowledgeBaseIds)
          : null
        break
      case 'citationReferences':
        dbChanges.citation_references = (changes as Partial<MainTextMessageBlock>).citationReferences
          ? JSON.stringify((changes as Partial<MainTextMessageBlock>).citationReferences)
          : null
        break
      case 'thinking_millsec':
        dbChanges.thinking_millsec = (changes as Partial<ThinkingMessageBlock>).thinking_millsec ?? null
        break
      case 'language':
        dbChanges.language = (changes as Partial<CodeMessageBlock>).language
        break
      case 'url':
        dbChanges.url = (changes as Partial<ImageMessageBlock>).url
        break
      case 'file':
        // 'file' exists on ImageMessageBlock and FileMessageBlock
        const file = (changes as Partial<ImageMessageBlock | FileMessageBlock>).file
        dbChanges.file = file ? JSON.stringify(file) : null
        break
      case 'toolId':
        dbChanges.tool_id = (changes as Partial<ToolMessageBlock>).toolId
        break
      case 'toolName':
        dbChanges.tool_name = (changes as Partial<ToolMessageBlock>).toolName
        break
      case 'arguments':
        const args = (changes as Partial<ToolMessageBlock>).arguments
        dbChanges.arguments = args ? JSON.stringify(args) : null
        break
      case 'sourceBlockId':
        dbChanges.source_block_id = (changes as Partial<TranslationMessageBlock>).sourceBlockId
        break
      case 'response':
        const response = (changes as Partial<CitationMessageBlock>).response
        dbChanges.response = response ? JSON.stringify(response) : null
        break
      case 'knowledge':
        const knowledge = (changes as Partial<CitationMessageBlock>).knowledge
        dbChanges.knowledge = knowledge ? JSON.stringify(knowledge) : null
        break

      // 'id' is the primary key and typically shouldn't be updated.
      case 'id':
        break

      default:
        break
    }
  }

  return dbChanges
}

// 数据库记录转换为 MessageBlock 类型
export function transformDbToMessageBlock(dbRecord: any): MessageBlock {
  const base = {
    id: dbRecord.id,
    messageId: dbRecord.message_id,
    type: dbRecord.type as MessageBlockType,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
    status: dbRecord.status as MessageBlockStatus,
    model: dbRecord.model ? JSON.parse(dbRecord.model) : undefined,
    metadata: dbRecord.metadata ? JSON.parse(dbRecord.metadata) : undefined,
    error: dbRecord.error ? JSON.parse(dbRecord.error) : undefined
  }

  // 根据类型添加特定字段并返回正确的类型
  switch (base.type) {
    case MessageBlockType.MAIN_TEXT:
      return {
        ...base,
        type: MessageBlockType.MAIN_TEXT,
        content: dbRecord.content || '',
        knowledgeBaseIds: dbRecord.knowledge_base_ids ? JSON.parse(dbRecord.knowledge_base_ids) : undefined,
        citationReferences: dbRecord.citation_references ? JSON.parse(dbRecord.citation_references) : undefined
      }

    case MessageBlockType.THINKING:
      return {
        ...base,
        type: MessageBlockType.THINKING,
        content: dbRecord.content || '',
        thinking_millsec: dbRecord.thinking_millsec || undefined
      }

    case MessageBlockType.CODE:
      return {
        ...base,
        type: MessageBlockType.CODE,
        content: dbRecord.content || '',
        language: dbRecord.language || 'text'
      }

    case MessageBlockType.IMAGE:
      return {
        ...base,
        type: MessageBlockType.IMAGE,
        url: dbRecord.url || undefined,
        file: dbRecord.file ? JSON.parse(dbRecord.file) : undefined
      }

    case MessageBlockType.TOOL:
      return {
        ...base,
        type: MessageBlockType.TOOL,
        toolId: dbRecord.tool_id || '',
        toolName: dbRecord.tool_name || undefined,
        arguments: dbRecord.arguments ? JSON.parse(dbRecord.arguments) : undefined,
        content: dbRecord.content
          ? // 尝试解析为对象，如果失败则保持为字符串
            (() => {
              try {
                return JSON.parse(dbRecord.content)
              } catch {
                return dbRecord.content
              }
            })()
          : undefined
      }

    case MessageBlockType.TRANSLATION:
      return {
        ...base,
        type: MessageBlockType.TRANSLATION,
        content: dbRecord.content || '',
        sourceBlockId: dbRecord.source_block_id || undefined
      }

    case MessageBlockType.CITATION:
      return {
        ...base,
        type: MessageBlockType.CITATION,
        response: dbRecord.response ? JSON.parse(dbRecord.response) : undefined,
        knowledge: dbRecord.knowledge ? JSON.parse(dbRecord.knowledge) : undefined
      }

    case MessageBlockType.FILE:
      return {
        ...base,
        type: MessageBlockType.FILE,
        file: dbRecord.file ? JSON.parse(dbRecord.file) : { id: '', name: '', path: '', size: 0, type: '', ext: '' }
      }

    case MessageBlockType.ERROR:
      return {
        ...base,
        type: MessageBlockType.ERROR
      }

    case MessageBlockType.UNKNOWN:
    default:
      return {
        ...base,
        type: MessageBlockType.UNKNOWN
      }
  }
}

// MessageBlock 转换为数据库记录
function transformMessageBlockToDb(messageBlock: MessageBlock): any {
  const base = {
    id: messageBlock.id,
    message_id: messageBlock.messageId,
    type: messageBlock.type,
    created_at: messageBlock.createdAt,
    updated_at: messageBlock.updatedAt,
    status: messageBlock.status,
    model: messageBlock.model ? JSON.stringify(messageBlock.model) : null,
    metadata: messageBlock.metadata ? JSON.stringify(messageBlock.metadata) : null,
    error: messageBlock.error ? JSON.stringify(messageBlock.error) : null
  }

  // 根据类型添加特定字段
  switch (messageBlock.type) {
    case MessageBlockType.MAIN_TEXT:
      return {
        ...base,
        content: messageBlock.content,
        knowledge_base_ids: messageBlock.knowledgeBaseIds ? JSON.stringify(messageBlock.knowledgeBaseIds) : null,
        citation_references: messageBlock.citationReferences ? JSON.stringify(messageBlock.citationReferences) : null
      }

    case MessageBlockType.THINKING:
      return {
        ...base,
        content: messageBlock.content,
        thinking_millsec: messageBlock.thinking_millsec || null
      }

    case MessageBlockType.CODE:
      return {
        ...base,
        content: messageBlock.content,
        language: messageBlock.language
      }

    case MessageBlockType.IMAGE:
      return {
        ...base,
        url: messageBlock.url || null,
        file: messageBlock.file ? JSON.stringify(messageBlock.file) : null
      }

    case MessageBlockType.TOOL:
      return {
        ...base,
        tool_id: messageBlock.toolId,
        tool_name: messageBlock.toolName || null,
        arguments: messageBlock.arguments ? JSON.stringify(messageBlock.arguments) : null,
        content: typeof messageBlock.content === 'object' ? JSON.stringify(messageBlock.content) : messageBlock.content
      }

    case MessageBlockType.TRANSLATION:
      return {
        ...base,
        content: messageBlock.content,
        source_block_id: messageBlock.sourceBlockId || null
      }

    case MessageBlockType.CITATION:
      return {
        ...base,
        response: messageBlock.response ? JSON.stringify(messageBlock.response) : null,
        knowledge: messageBlock.knowledge ? JSON.stringify(messageBlock.knowledge) : null
      }

    case MessageBlockType.FILE:
      return {
        ...base,
        file: JSON.stringify(messageBlock.file)
      }

    default:
      return base
  }
}

/**
 * 添加或更新一个或多个块 (Upsert)。
 * @param blocks - 要更新或插入的 MessageBlock 对象或对象数组。
 */
export async function upsertBlocks(blocks: MessageBlock | MessageBlock[]) {
  const blocksArray = Array.isArray(blocks) ? blocks : [blocks]
  if (blocksArray.length === 0) return

  try {
    const dbRecords = blocksArray.map(transformMessageBlockToDb)

    await db.transaction(async tx => {
      const upsertPromises = dbRecords.map(record =>
        tx.insert(messageBlocks).values(record).onConflictDoUpdate({
          target: messageBlocks.id,
          set: record // 更新除主键外的所有字段
        })
      )
      await Promise.all(upsertPromises)
    })
  } catch (error) {
    logger.error('Error upserting block(s):', error)
    throw error
  }
}

/**
 * 更新单个现有块。
 * @param update - 包含块 ID 和要应用的更改的对象。
 */
export async function updateOneBlock(update: {
  id: string
  changes: Partial<MessageBlock>
}): Promise<MessageBlock | null> {
  const { id, changes } = update

  if (Object.keys(changes).length === 0) {
    // 如果没有变更，可以提前返回或抛出错误
    // 为了避免不必要的数据库查询，这里直接查询并返回当前块
    const currentRecord = db.select().from(messageBlocks).where(eq(messageBlocks.id, id)).get()
    return currentRecord ? transformDbToMessageBlock(currentRecord) : null
  }

  // 1. 将 Partial<MessageBlock> 转换为数据库可以理解的部分更新对象
  const dbUpdatePayload = transformPartialMessageBlockToDb(changes)

  // 2. 自动更新 updated_at 字段
  if (!dbUpdatePayload.updated_at) {
    dbUpdatePayload.updated_at = new Date().toISOString()
  }

  try {
    // 3. 执行更新并使用 .returning() 获取更新后的完整记录
    // .returning() 会返回一个包含更新后行的数组
    const updatedRecords = await db
      .update(messageBlocks)
      .set(dbUpdatePayload)
      .where(eq(messageBlocks.id, id))
      .returning()

    // 4. 检查是否有记录被更新
    if (updatedRecords.length === 0) {
      logger.warn(`Block with id "${id}" not found for update.`)
      return null
    }

    // 5. 将返回的数据库记录转换为 MessageBlock 领域对象
    const updatedRecord = updatedRecords[0]
    return transformDbToMessageBlock(updatedRecord)
  } catch (error) {
    logger.error('Failed to update message block in database:', error)
    // 根据你的错误处理策略，可以抛出错误或返回 null
    throw error
  }
}

/**
 * 根据 ID 移除单个块。
 * @param blockId - 要移除的块的 ID。
 */
export async function removeOneBlock(blockId: string) {
  try {
    await db.delete(messageBlocks).where(eq(messageBlocks.id, blockId))
  } catch (error) {
    logger.error(`Error removing block with ID ${blockId}:`, error)
    throw error
  }
}

/**
 * 根据 ID 列表移除多个块。
 * @param blockIds - 要移除的块的 ID 数组。
 */
export async function removeManyBlocks(blockIds: string[]) {
  if (blockIds.length === 0) return

  try {
    await db.delete(messageBlocks).where(inArray(messageBlocks.id, blockIds))
  } catch (error) {
    logger.error('Error removing multiple blocks:', error)
    throw error
  }
}

/**
 * 移除所有块。
 */
export async function removeAllBlocks() {
  try {
    await db.delete(messageBlocks)
  } catch (error) {
    logger.error('Error removing all blocks:', error)
    throw error
  }
}

// --- 查询函数 ---

/**
 * 根据消息 ID 获取所有消息块。
 * @param messageId - 消息的 ID。
 * @returns MessageBlock 对象数组。
 */
export async function getBlocksByMessageId(messageId: string): Promise<MessageBlock[]> {
  try {
    const dbRecords = await db.select().from(messageBlocks).where(eq(messageBlocks.message_id, messageId))
    return dbRecords.map(transformDbToMessageBlock)
  } catch (error) {
    logger.error(`Error getting blocks for message ID ${messageId}:`, error)
    throw error
  }
}

/**
 * 根据消息 ID 获取所有块的 ID。
 * @param messageId - 消息的 ID。
 * @returns 块 ID 数组。
 */
export async function getBlocksIdByMessageId(messageId: string): Promise<string[]> {
  const startTime = performance.now()

  try {
    const dbRecords = await db
      .select({ id: messageBlocks.id })
      .from(messageBlocks)
      .where(eq(messageBlocks.message_id, messageId))

    const duration = performance.now() - startTime
    const blockCount = dbRecords.length

    logger.debug(`📦 getBlocksIdByMessageId`, {
      messageId: messageId.substring(0, 8),
      blockCount,
      duration: `${duration.toFixed(2)}ms`
    })

    return dbRecords.map(record => record.id)
  } catch (error) {
    logger.error(`Error getting block IDs for message ID ${messageId}:`, error)
    throw error
  }
}

export async function getBlockById(blockId: string): Promise<MessageBlock | null> {
  try {
    const dbRecord = await db.select().from(messageBlocks).where(eq(messageBlocks.id, blockId)).limit(1).execute()

    if (dbRecord.length === 0) {
      return null
    }

    return transformDbToMessageBlock(dbRecord[0])
  } catch (error) {
    logger.error(`Error getting block with ID ${blockId}:`, error)
    throw error
  }
}

export async function deleteBlocksByTopicId(topicId: string): Promise<void> {
  try {
    const messagesWithTopic = await db.select({ id: messages.id }).from(messages).where(eq(messages.topic_id, topicId))
    const messageIds = messagesWithTopic.map(message => message.id)

    if (messageIds.length === 0) {
      logger.info(`No messages found for topic ID ${topicId}. Nothing to delete.`)
      return
    }

    const blocks = await db.select().from(messageBlocks).where(inArray(messageBlocks.message_id, messageIds))

    if (blocks.length === 0) {
      logger.info(`No blocks found for messages in topic ID ${topicId}. Nothing to delete.`)
      return
    }

    const blockIds = blocks.map(block => block.id)
    await removeManyBlocks(blockIds)
    logger.info(`Successfully deleted ${blockIds.length} blocks for topic ID ${topicId}.`)
  } catch (error) {
    logger.error(`Error deleting blocks for topic ID ${topicId}:`, error)
    throw error
  }
}

export async function deleteBlocksByMessageId(messageId: string): Promise<void> {
  try {
    const blocks = await getBlocksByMessageId(messageId)

    if (blocks.length === 0) {
      logger.info(`No blocks found for message ID ${messageId}. Nothing to delete.`)
      return
    }

    const blockIds = blocks.map(block => block.id)
    await removeManyBlocks(blockIds)
    logger.info(`Successfully deleted ${blockIds.length} blocks for message ID ${messageId}.`)
  } catch (error) {
    logger.error(`Error deleting blocks for message ID ${messageId}:`, error)
    throw error
  }
}
