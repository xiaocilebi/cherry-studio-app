import { t } from 'i18next'

import { loggerService } from '@/services/LoggerService'
import { Assistant, Topic } from '@/types/assistant'
import { uuid } from '@/utils'

import { topicDatabase } from '@database'
const logger = loggerService.withContext('Topic Service')

export async function createNewTopic(assistant: Assistant): Promise<Topic> {
  const newTopic: Topic = {
    id: uuid(),
    assistantId: assistant.id,
    name: t('topics.new_topic'),
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  logger.info('createNewTopic', newTopic.id)
  await topicDatabase.upsertTopics(newTopic)
  return newTopic
}

export async function upsertTopics(topics: Topic[]): Promise<void> {
  const updatedTopics: Topic[] = topics.map(topic => ({
    ...topic,
    name: topic.name ? topic.name : t('new_topic'),
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
    assistantId: topic.assistantId
  }))
  await topicDatabase.upsertTopics(updatedTopics)
}

/**
 * rank topic by createdAt time
 * @returns Topic
 */
export async function getNewestTopic(): Promise<Topic | null> {
  const newestTopic = await topicDatabase.getNewestTopic()

  if (!newestTopic) {
    return null
  }

  return newestTopic
}

export async function deleteTopicById(topicId: string): Promise<void> {
  try {
    await topicDatabase.deleteTopicById(topicId)
  } catch (error) {
    logger.error('Failed to delete topic:', error)
    throw error
  }
}

export async function getTopicById(topicId: string): Promise<Topic | null> {
  try {
    const topic = await topicDatabase.getTopicById(topicId)

    if (!topic) {
      return null
    }

    return topic
  } catch (error) {
    logger.error('Failed to get topic by ID:', error)
    return null
  }
}

export async function getTopics(): Promise<Topic[]> {
  try {
    return await topicDatabase.getTopics()
  } catch (error) {
    logger.error('Failed to get topics', error)
    return []
  }
}

export async function getTopicsByAssistantId(assistantId: string): Promise<Topic[]> {
  try {
    return await topicDatabase.getTopicsByAssistantId(assistantId)
  } catch (error) {
    logger.error('Failed to get topics By AssistantId', assistantId, error)
    return []
  }
}

export async function isTopicOwnedByAssistant(assistantId: string, topicId: string): Promise<boolean> {
  try {
    return await topicDatabase.isTopicOwnedByAssistant(assistantId, topicId)
  } catch (error) {
    logger.error('Failed to get topics By AssistantId', assistantId, error)
    return false
  }
}

export async function deleteTopicsByAssistantId(assistantId: string): Promise<void> {
  try {
    await topicDatabase.deleteTopicsByAssistantId(assistantId)
  } catch (error) {
    logger.error('Failed to delete topic:', error)
    throw error
  }
}

export async function renameTopic(topicId: string, newName: string): Promise<void> {
  try {
    const topic = await getTopicById(topicId)

    if (!topic) {
      throw new Error(`Topic with ID ${topicId} not found`)
    }

    const updatedTopic: Topic = {
      ...topic,
      name: newName.trim(),
      updatedAt: Date.now(),
      isNameManuallyEdited: true
    }

    await upsertTopics([updatedTopic])
    logger.info('renameTopic', topicId, newName)
  } catch (error) {
    logger.error('Failed to rename topic:', error)
    throw error
  }
}
