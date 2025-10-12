import { Topic } from '@/types/assistant'
import { safeJsonParse } from '@/utils/json'

/**
 * 将数据库记录转换为 Topic 类型。
 * @param dbRecord - 从数据库检索的记录。
 * @returns 一个 Topic 对象。
 */
export function transformDbToTopic(dbRecord: any): Topic {
  return {
    id: dbRecord.id,
    assistantId: dbRecord.assistant_id,
    name: dbRecord.name,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
    messages: dbRecord.messages ? safeJsonParse(dbRecord.messages) : [],
    // 将数字（0 或 1）转换为布尔值
    pinned: !!dbRecord.pinned,
    prompt: dbRecord.prompt,
    isNameManuallyEdited: !!dbRecord.is_name_manually_edited
  }
}

/**
 * 将 Topic 对象转换为数据库记录格式。
 * @param topic - Topic 对象。
 * @returns 一个适合数据库操作的对象。
 */
export function transformTopicToDb(topic: Topic): any {
  return {
    id: topic.id,
    assistant_id: topic.assistantId,
    name: topic.name,
    created_at: topic.createdAt,
    updated_at: topic.updatedAt,
    messages: JSON.stringify(topic.messages),
    // 将布尔值转换为数字（1 表示 true，0 表示 false）
    pinned: topic.pinned ? 1 : 0,
    prompt: topic.prompt,
    is_name_manually_edited: topic.isNameManuallyEdited ? 1 : 0
  }
}
