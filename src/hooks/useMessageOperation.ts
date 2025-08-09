import { createSelector } from '@reduxjs/toolkit'
import { useCallback } from 'react'

import { loggerService } from '@/services/LoggerService'
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { newMessagesActions } from '@/store/newMessage'
import { Topic } from '@/types/assistant'
import { abortCompletion } from '@/utils/abortController'

import { getMessagesByTopicId } from '../../db/queries/messages.queries'

const logger = loggerService.withContext('UseMessageOperations')

const selectMessagesState = (state: RootState) => state.messages

export const selectNewTopicLoading = createSelector(
  [selectMessagesState, (_, topicId: string) => topicId],
  (messagesState, topicId) => messagesState.loadingByTopic[topicId] || false
)

/**
 * Hook 提供针对特定主题的消息操作方法。 / Hook providing various operations for messages within a specific topic.
 * @param topic 当前主题对象。 / The current topic object.
 * @returns 包含消息操作函数的对象。 / An object containing message operation functions.
 */
export function useMessageOperations(topic: Topic) {
  const dispatch = useAppDispatch()

  /**
   * todo: 暂停当前主题正在进行的消息生成。 / Pauses ongoing message generation for the current topic.
   */
  const pauseMessages = useCallback(async () => {
    const topicMessages = await getMessagesByTopicId(topic.id)
    if (!topicMessages) return

    const streamingMessages = topicMessages.filter(m => m.status === 'processing' || m.status === 'pending')
    const askIds = [...new Set(streamingMessages?.map(m => m.askId).filter(id => !!id) as string[])]

    for (const askId of askIds) {
      abortCompletion(askId)
    }

    dispatch(newMessagesActions.setTopicLoading({ topicId: topic.id, loading: false }))
  }, [topic.id, dispatch])

  return {
    pauseMessages
  }
}

export const useTopicLoading = (topic: Topic) => {
  return useAppSelector(state => selectNewTopicLoading(state, topic.id))
}
