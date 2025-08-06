import { useCallback } from 'react'

import { useAppDispatch } from '@/store'
import { Topic } from '@/types/assistant'
import { abortCompletion } from '@/utils/abortController'

import { getMessagesByTopicId } from '../../db/queries/messages.queries'

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
    const state = store.getState()
    const topicMessages = await getMessagesByTopicId(topic.id)
    if (!topicMessages) return

    const streamingMessages = topicMessages.filter(m => m.status === 'processing' || m.status === 'pending')
    const askIds = [...new Set(streamingMessages?.map(m => m.askId).filter(id => !!id) as string[])]

    for (const askId of askIds) {
      abortCompletion(askId)
    }

    // dispatch(newMessagesActions.setTopicLoading({ topicId: topic.id, loading: false }))
  }, [topic.id, dispatch])
}
