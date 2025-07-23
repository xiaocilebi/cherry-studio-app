import { t } from 'i18next'

import { loggerService } from '@/services/LoggerService'
import { Assistant, Topic } from '@/types/assistant'
import { uuid } from '@/utils'

import {
  deleteTopicById as _deleteTopicById,
  deleteTopicsByAssistantId as _deleteTopicsByAssistantId,
  getTopicById as _getTopicById,
  getTopics as _getTopics,
  getTopicsByAssistantId as _getTopicsByAssistantId,
  isTopicOwnedByAssistant as _isTopicOwnedByAssistant,
  upsertTopics as _upsertTopics
} from '../../db/queries/topics.queries'
const logger = loggerService.withContext('Topic Service')

export async function createNewTopic(assistant: Assistant): Promise<Topic> {
  const newTopic: Topic = {
    id: uuid(),
    assistantId: assistant.id,
    name: t('topics.new_topic'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: []
  }
  logger.info('createNewTopic', newTopic.id)
  await _upsertTopics(newTopic)
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
  await _upsertTopics(updatedTopics)
}

export async function getNewestTopic(): Promise<Topic | null> {
  const topics = await getTopics()

  if (topics.length === 0) {
    return null
  }

  return topics[0]
}

export async function deleteTopicById(topicId: string): Promise<void> {
  try {
    await _deleteTopicById(topicId)
  } catch (error) {
    logger.error('Failed to delete topic:', error)
    throw error
  }
}

export async function getTopicById(topicId: string): Promise<Topic | null> {
  try {
    const topic = await _getTopicById(topicId)

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
    return await _getTopics()
  } catch (error) {
    logger.error('Failed to get topics', error)
    return []
  }
}

export async function getTopicsByAssistantId(assistantId: string): Promise<Topic[]> {
  try {
    return await _getTopicsByAssistantId(assistantId)
  } catch (error) {
    logger.error('Failed to get topics By AssistantId', assistantId, error)
    return []
  }
}

export async function isTopicOwnedByAssistant(assistantId: string, topicId: string): Promise<boolean> {
  try {
    return await _isTopicOwnedByAssistant(assistantId, topicId)
  } catch (error) {
    logger.error('Failed to get topics By AssistantId', assistantId, error)
    return false
  }
}

export async function deleteTopicsByAssistantId(assistantId: string): Promise<void> {
  try {
    await _deleteTopicsByAssistantId(assistantId)
  } catch (error) {
    logger.error('Failed to delete topic:', error)
    throw error
  }
}
