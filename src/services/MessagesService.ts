import { loggerService } from '@/services/LoggerService'
import { ExternalToolResult } from '@/types'
import { Assistant, Model, Topic, Usage } from '@/types/assistant'
import { FileType, FileTypes } from '@/types/file'
import {
  AssistantMessageStatus,
  CitationMessageBlock,
  Message,
  MessageBlock,
  MessageBlockStatus,
  MessageBlockType,
  PlaceholderMessageBlock,
  Response
} from '@/types/message'
import { uuid } from '@/utils'
import { formatErrorMessage, isAbortError } from '@/utils/error'
import {
  createAssistantMessage,
  createBaseMessageBlock,
  createCitationBlock,
  createErrorBlock,
  createFileBlock,
  createImageBlock,
  createMainTextBlock,
  createMessage,
  createThinkingBlock,
  resetAssistantMessage
} from '@/utils/messageUtils/create'
import { getTopicQueue } from '@/utils/queue'

import { removeManyBlocks, updateOneBlock, upsertBlocks } from '../../db/queries/messageBlocks.queries'
import { getMessageById, getMessagesByTopicId, upsertMessages } from '../../db/queries/messages.queries'
import { getTopicById, updateTopicMessages } from '../../db/queries/topics.queries'
import { fetchTopicNaming } from './ApiService'
import { getDefaultModel } from './AssistantService'
import { OrchestrationService } from './OrchestrationService'
import { createStreamProcessor, StreamProcessorCallbacks } from './StreamProcessingService'
import { estimateMessagesUsage } from './TokenService'
const logger = loggerService.withContext('Messages Service')

/**
 * Creates a user message object and associated blocks based on input.
 * This is a pure function and does not dispatch to the store.
 *
 * @param params - The parameters for creating the message.
 * @returns An object containing the created message and its blocks.
 */
export function getUserMessage({
  assistant,
  topic,
  type,
  content,
  files,
  // Keep other potential params if needed by createMessage
  mentions,
  usage
}: {
  assistant: Assistant
  topic: Topic
  type?: Message['type']
  content?: string
  files?: FileType[]
  mentions?: Model[]
  usage?: Usage
}): { message: Message; blocks: MessageBlock[] } {
  const defaultModel = getDefaultModel()
  const model = assistant.model || defaultModel
  const messageId = uuid() // Generate ID here
  const blocks: MessageBlock[] = []
  const blockIds: string[] = []

  if (files?.length) {
    files.forEach(file => {
      if (file.type === FileTypes.IMAGE) {
        const imgBlock = createImageBlock(messageId, { file, status: MessageBlockStatus.SUCCESS })
        blocks.push(imgBlock)
        blockIds.push(imgBlock.id)
      } else {
        const fileBlock = createFileBlock(messageId, file, { status: MessageBlockStatus.SUCCESS })
        blocks.push(fileBlock)
        blockIds.push(fileBlock.id)
      }
    })
  }

  // 内容为空也应该创建空文本块
  if (content !== undefined) {
    // Pass messageId when creating blocks
    const textBlock = createMainTextBlock(messageId, content, {
      status: MessageBlockStatus.SUCCESS
    })
    blocks.push(textBlock)
    blockIds.push(textBlock.id)
  }

  // 直接在createMessage中传入id
  const message = createMessage(
    'user',
    topic.id, // topic.id已经是string类型
    assistant.id,
    {
      id: messageId, // 直接传入ID，避免冲突
      modelId: model?.id,
      model: model,
      blocks: blockIds,
      mentions,
      type,
      usage
    }
  )

  // 不再需要手动合并ID
  return { message, blocks }
}

/**
 * 发送消息并处理助手回复
 * @param userMessage 已创建的用户消息
 * @param userMessageBlocks 用户消息关联的消息块
 * @param assistant 助手对象
 * @param topicId 主题ID
 */
export async function sendMessage(
  userMessage: Message,
  userMessageBlocks: MessageBlock[],
  assistant: Assistant,
  topicId: Topic['id']
) {
  try {
    // mock mentions model
    // userMessage.mentions = [
    //   { id: 'deepseek-ai/DeepSeek-V3', name: 'deepseek-ai/DeepSeek-V3', provider: 'silicon', group: 'deepseek-ai' },
    //   { id: 'deepseek-ai/DeepSeek-R1', name: 'deepseek-ai/DeepSeek-R1', provider: 'silicon', group: 'deepseek-ai' }
    // ]

    if (userMessage.blocks.length === 0) {
      logger.warn('sendMessage: No blocks in the provided message.')
      return
    }

    // add message to database
    await saveMessageAndBlocksToDB(userMessage, userMessageBlocks)
    await upsertMessages(userMessage)

    const mentionedModels = userMessage.mentions

    if (mentionedModels && mentionedModels.length > 0) {
      await multiModelResponses(topicId, assistant, userMessage, mentionedModels)
    } else {
      const assistantMessage = createAssistantMessage(assistant.id, topicId, {
        askId: userMessage.id,
        model: assistant.model
      })
      await saveMessageAndBlocksToDB(assistantMessage, [])
      await upsertMessages(assistantMessage)
      await fetchAndProcessAssistantResponseImpl(topicId, assistant, assistantMessage)
    }
  } catch (error) {
    logger.error('Error in sendMessage:', error)
  }
}

export async function regenerateAssistantMessage(assistantMessage: Message, assistant: Assistant) {
  const topicId = assistantMessage.topicId

  try {
    // 1. Use selector to get all messages for the topic
    const allMessagesForTopic = await getMessagesByTopicId(topicId)

    // 2. Find the original user query (Restored Logic)
    const originalUserQuery = allMessagesForTopic.find(m => m.id === assistantMessage.askId)

    if (!originalUserQuery) {
      logger.error(
        `[regenerateAssistantResponseThunk] Original user query (askId: ${assistantMessage.askId}) not found for assistant message ${assistantMessage.id}. Cannot regenerate.`
      )
      return
    }

    // 3. Verify the assistant message itself exists in entities
    const messageToResetEntity = await getMessageById(assistantMessage.id)

    if (!messageToResetEntity) {
      // No need to check topicId again as selector implicitly handles it
      logger.error(
        `[regenerateAssistantResponseThunk] Assistant message ${assistantMessage.id} not found in entities despite being in the topic list. State might be inconsistent.`
      )
      return
    }

    // 4. Get Block IDs to delete
    const blockIdsToDelete = [...(messageToResetEntity.blocks || [])]

    // 5. Reset the message entity in Database
    const resetAssistantMsg = resetAssistantMessage(
      messageToResetEntity,
      // Grouped message (mentioned model message) should not reset model and modelId, always use the original model
      assistantMessage.modelId
        ? {
            status: AssistantMessageStatus.PENDING,
            updatedAt: new Date().toISOString()
          }
        : {
            status: AssistantMessageStatus.PENDING,
            updatedAt: new Date().toISOString(),
            model: assistant.model
          }
    )

    await upsertMessages(resetAssistantMsg)
    // 6. Remove old blocks from Database
    await cleanupMultipleBlocks(blockIdsToDelete)

    // // 7. Update DB: Save the reset message state within the topic and delete old blocks
    // // Fetch the current state *after* Database updates to get the latest message list
    // // Use the selector to get the final ordered list of messages for the topic
    // const finalMessagesToSave = await getMessagesByTopicId(topicId)

    // 7. Add fetch/process call to the queue
    const queue = getTopicQueue(topicId)
    const assistantConfigForRegen = {
      ...assistant,
      ...(resetAssistantMsg.model ? { model: resetAssistantMsg.model } : {})
    }

    // Add the fetch/process call to the queue
    queue.add(
      async () => await fetchAndProcessAssistantResponseImpl(topicId, assistantConfigForRegen, resetAssistantMsg)
    )
  } catch (error) {
    logger.error('Error in regenerateAssistantMessage:', error)
  }
}

export async function saveMessageAndBlocksToDB(message: Message, blocks: MessageBlock[], messageIndex: number = -1) {
  try {
    if (blocks.length > 0) {
      await upsertBlocks(blocks)
    }

    // get topic from database
    const topic = await getTopicById(message.topicId)
    logger.info('saveMessageAndBlocksToDB topic:', topic)

    if (topic) {
      const _messageIndex = topic.messages.findIndex(m => m.id === message.id)
      const updatedMessages = [...topic.messages]

      if (_messageIndex !== -1) {
        updatedMessages[_messageIndex] = message
      } else {
        if (messageIndex !== -1) {
          updatedMessages.splice(messageIndex, 0, message)
        } else {
          updatedMessages.push(message)
        }
      }

      await updateTopicMessages(topic.id, updatedMessages)
    } else {
      logger.error(`[saveMessageAndBlocksToDB] Topic ${message.topicId} not found.`)
    }
  } catch (error) {
    logger.error('Error saving message blocks:', error)
  }
}

// Internal function extracted from sendMessage to handle fetching and processing assistant response
export async function fetchAndProcessAssistantResponseImpl(
  topicId: string,
  assistant: Assistant,
  assistantMessage: Message
) {
  const assistantMsgId = assistantMessage.id
  let callbacks: StreamProcessorCallbacks = {}

  try {
    // todo set topic loading
    let accumulatedContent = ''
    let accumulatedThinking = ''
    // 专注于管理UI焦点和块切换
    let lastBlockId: string | null = null
    let lastBlockType: MessageBlockType | null = null
    // 专注于块内部的生命周期处理
    let initialPlaceholderBlockId: string | null = null
    let citationBlockId: string | null = null
    let mainTextBlockId: string | null = null
    let thinkingBlockId: string | null = null
    const imageBlockId: string | null = null
    const toolBlockId: string | null = null
    const hasWebSearch = false
    const toolCallIdToBlockIdMap = new Map<string, string>()

    const handleBlockTransition = async (newBlock: MessageBlock, newBlockType: MessageBlockType) => {
      lastBlockId = newBlock.id
      lastBlockType = newBlockType

      if (newBlockType !== MessageBlockType.MAIN_TEXT) {
        accumulatedContent = ''
      }

      if (newBlockType !== MessageBlockType.THINKING) {
        accumulatedThinking = ''
      }

      // add new block to database
      await upsertBlocks(newBlock)

      // change message status
      const toBeUpdatedMessage = await getMessageById(newBlock.messageId)

      if (!toBeUpdatedMessage) {
        logger.error(`[upsertBlockReference] Message ${newBlock.messageId} not found.`)
        return
      }

      // Update Message Status based on Block Status
      if (newBlock.status === MessageBlockStatus.ERROR) {
        toBeUpdatedMessage.status = AssistantMessageStatus.ERROR
      } else if (
        newBlock.status === MessageBlockStatus.SUCCESS &&
        toBeUpdatedMessage.status !== AssistantMessageStatus.PROCESSING &&
        toBeUpdatedMessage.status !== AssistantMessageStatus.SUCCESS &&
        toBeUpdatedMessage.status !== AssistantMessageStatus.ERROR
      ) {
        toBeUpdatedMessage.status = AssistantMessageStatus.SUCCESS
      } else if (
        newBlock.status === MessageBlockStatus.PROCESSING ||
        newBlock.status === MessageBlockStatus.STREAMING
      ) {
        toBeUpdatedMessage.status = AssistantMessageStatus.PROCESSING
      }

      const updatedMessage = await upsertMessages(toBeUpdatedMessage)

      if (!updatedMessage) {
        logger.error(`[handleBlockTransition] Failed to update message ${toBeUpdatedMessage.id} in state.`)
        return
      }
    }

    const allMessagesForTopic = await getMessagesByTopicId(topicId)
    let messagesForContext: Message[] = []
    const userMessageId = assistantMessage.askId
    const userMessageIndex = allMessagesForTopic.findIndex(m => m?.id === userMessageId)

    if (userMessageIndex === -1) {
      logger.error(
        `[fetchAndProcessAssistantResponseImpl] Triggering user message ${userMessageId} (askId of ${assistantMsgId}) not found. Falling back.`
      )
      const assistantMessageIndexFallback = allMessagesForTopic.findIndex(m => m?.id === assistantMsgId)
      messagesForContext = (
        assistantMessageIndexFallback !== -1
          ? allMessagesForTopic.slice(0, assistantMessageIndexFallback)
          : allMessagesForTopic
      ).filter(m => m && !m.status?.includes('ing'))
    } else {
      const contextSlice = allMessagesForTopic.slice(0, userMessageIndex + 1)
      messagesForContext = contextSlice.filter(m => m && !m.status?.includes('ing'))
    }

    callbacks = {
      onLLMResponseCreated: async () => {
        const baseBlock = createBaseMessageBlock(assistantMsgId, MessageBlockType.UNKNOWN, {
          status: MessageBlockStatus.PROCESSING
        })
        initialPlaceholderBlockId = baseBlock.id
        await handleBlockTransition(baseBlock as PlaceholderMessageBlock, MessageBlockType.UNKNOWN)
      },
      onTextChunk: async text => {
        accumulatedContent += text

        if (mainTextBlockId) {
          const blockChanges: Partial<MessageBlock> = {
            content: accumulatedContent,
            status: MessageBlockStatus.STREAMING
          }
          await updateOneBlock({ id: mainTextBlockId, changes: blockChanges })
        } else if (initialPlaceholderBlockId) {
          // 将占位块转换为主文本块
          const initialChanges: Partial<MessageBlock> = {
            type: MessageBlockType.MAIN_TEXT,
            content: accumulatedContent,
            status: MessageBlockStatus.STREAMING,
            citationReferences: citationBlockId ? [{ citationBlockId }] : []
          }
          mainTextBlockId = initialPlaceholderBlockId
          // 清理占位块
          initialPlaceholderBlockId = null
          lastBlockType = MessageBlockType.MAIN_TEXT
          await updateOneBlock({ id: mainTextBlockId, changes: initialChanges })
        } else {
          const newBlock = createMainTextBlock(assistantMsgId, accumulatedContent, {
            status: MessageBlockStatus.STREAMING,
            citationReferences: citationBlockId ? [{ citationBlockId }] : []
          })
          mainTextBlockId = newBlock.id // 立即设置ID，防止竞态条件
          await handleBlockTransition(newBlock, MessageBlockType.MAIN_TEXT)
        }
      },
      onTextComplete: async finalText => {
        if (mainTextBlockId) {
          const changes = {
            content: finalText,
            status: MessageBlockStatus.SUCCESS
          }
          await updateOneBlock({ id: mainTextBlockId, changes })
          mainTextBlockId = null
        } else {
          logger.warn(
            `[onTextComplete] Received text.complete but last block was not MAIN_TEXT (was ${lastBlockType}) or lastBlockId  is null.`
          )
        }

        // if (citationBlockId && !hasWebSearch) {
        //   const changes: Partial<CitationMessageBlock> = {
        //     status: MessageBlockStatus.SUCCESS
        //   }
        //   dispatch(updateOneBlock({ id: citationBlockId, changes }))
        //   saveUpdatedBlockToDB(citationBlockId, assistantMsgId, topicId, getState)
        //   citationBlockId = null
        // }
      },
      onThinkingChunk: async (text, thinking_millsec) => {
        accumulatedThinking += text

        if (thinkingBlockId) {
          const blockChanges: Partial<MessageBlock> = {
            content: accumulatedThinking,
            status: MessageBlockStatus.STREAMING,
            thinking_millsec: thinking_millsec
          }
          await updateOneBlock({ id: thinkingBlockId, changes: blockChanges })
        } else if (initialPlaceholderBlockId) {
          // First chunk for this block: Update type and status immediately
          lastBlockType = MessageBlockType.THINKING
          const initialChanges: Partial<MessageBlock> = {
            type: MessageBlockType.THINKING,
            content: accumulatedThinking,
            status: MessageBlockStatus.STREAMING
          }
          thinkingBlockId = initialPlaceholderBlockId
          initialPlaceholderBlockId = null
          await updateOneBlock({ id: thinkingBlockId, changes: initialChanges })
        } else {
          const newBlock = createThinkingBlock(assistantMsgId, accumulatedThinking, {
            status: MessageBlockStatus.STREAMING,
            thinking_millsec: 0
          })
          thinkingBlockId = newBlock.id // 立即设置ID，防止竞态条件
          await handleBlockTransition(newBlock, MessageBlockType.THINKING)
        }
      },
      onThinkingComplete: async (finalText, final_thinking_millsec) => {
        if (thinkingBlockId) {
          const changes = {
            type: MessageBlockType.THINKING,
            content: finalText,
            status: MessageBlockStatus.SUCCESS,
            thinking_millsec: final_thinking_millsec
          }
          await updateOneBlock({ id: thinkingBlockId, changes })
        } else {
          logger.warn(
            `[onThinkingComplete] Received thinking.complete but last block was not THINKING (was ${lastBlockType}) or lastBlockId  is null.`
          )
        }

        thinkingBlockId = null
      },
      onExternalToolInProgress: async () => {
        logger.info('[onExternalToolInProgress] External tool is in progress...')
        const citationBlock = createCitationBlock(assistantMsgId, {}, { status: MessageBlockStatus.PROCESSING })
        citationBlockId = citationBlock.id
        await handleBlockTransition(citationBlock, MessageBlockType.CITATION)
      },
      onExternalToolComplete: async (externalToolResult: ExternalToolResult) => {
        if (citationBlockId) {
          const changes: Partial<CitationMessageBlock> = {
            response: externalToolResult.webSearch,
            knowledge: externalToolResult.knowledge,
            status: MessageBlockStatus.SUCCESS
          }
          await updateOneBlock({ id: citationBlockId, changes })
        } else {
          logger.error('[onExternalToolComplete] citationBlockId is null. Cannot update.')
        }
      },

      onError: async error => {
        logger.error(error, { depth: null })
        const isErrorTypeAbort = isAbortError(error)
        let pauseErrorLanguagePlaceholder = ''

        if (isErrorTypeAbort) {
          pauseErrorLanguagePlaceholder = 'pause_placeholder'
        }

        const serializableError = {
          name: error.name,
          message: pauseErrorLanguagePlaceholder || error.message || formatErrorMessage(error),
          originalMessage: error.message,
          stack: error.stack,
          status: error.status || error.code,
          requestId: error.request_id
        }

        // if (!isOnHomePage()) {
        //   await notificationService.send({
        //     id: uuid(),
        //     type: 'error',
        //     title: t('notification.assistant'),
        //     message: serializableError.message,
        //     silent: false,
        //     timestamp: Date.now(),
        //     source: 'assistant'
        //   })
        // }

        const possibleBlockId =
          mainTextBlockId || thinkingBlockId || toolBlockId || imageBlockId || citationBlockId || lastBlockId

        if (possibleBlockId) {
          // 更改上一个block的状态为ERROR
          const changes: Partial<MessageBlock> = {
            status: isErrorTypeAbort ? MessageBlockStatus.PAUSED : MessageBlockStatus.ERROR
          }
          await updateOneBlock({ id: possibleBlockId, changes })
        }

        const errorBlock = createErrorBlock(assistantMsgId, serializableError, { status: MessageBlockStatus.SUCCESS })
        await handleBlockTransition(errorBlock, MessageBlockType.ERROR)
        const errorStatus = isErrorTypeAbort ? AssistantMessageStatus.SUCCESS : AssistantMessageStatus.ERROR

        const toBeUpdatedMessage = await getMessageById(assistantMsgId)

        if (!toBeUpdatedMessage) {
          logger.error(`[upsertBlockReference] Message ${assistantMsgId} not found.`)
          return
        }

        toBeUpdatedMessage.status = errorStatus

        const updatedMessage = await upsertMessages(toBeUpdatedMessage)

        if (!updatedMessage) {
          logger.error(`[onError] Failed to update message ${toBeUpdatedMessage.id} in state.`)
          return
        }

        // EventEmitter.emit(EVENT_NAMES.MESSAGE_COMPLETE, {
        //   id: assistantMsgId,
        //   topicId,
        //   status: isErrorTypeAbort ? 'pause' : 'error',
        //   error: error.message
        // })
      },
      onComplete: async (status: AssistantMessageStatus, response?: Response) => {
        const finalAssistantMsg = await getMessageById(assistantMsgId)

        if (!finalAssistantMsg) {
          logger.error(`[onComplete] Assistant message ${assistantMsgId} not found.`)
          return
        }

        if (status === 'success' && finalAssistantMsg) {
          const userMsgId = finalAssistantMsg.askId
          const orderedMsgs = await getMessagesByTopicId(topicId)
          const userMsgIndex = orderedMsgs.findIndex(m => m.id === userMsgId)
          const contextForUsage = userMsgIndex !== -1 ? orderedMsgs.slice(0, userMsgIndex + 1) : []
          const finalContextWithAssistant = [...contextForUsage, finalAssistantMsg]

          const possibleBlockId =
            mainTextBlockId || thinkingBlockId || toolBlockId || imageBlockId || citationBlockId || lastBlockId

          if (possibleBlockId) {
            const changes: Partial<MessageBlock> = {
              status: MessageBlockStatus.SUCCESS
            }
            await updateOneBlock({ id: possibleBlockId, changes })
          }

          // 更新topic的name
          await fetchTopicNaming(topicId)

          if (
            response &&
            (response.usage?.total_tokens === 0 ||
              response?.usage?.prompt_tokens === 0 ||
              response?.usage?.completion_tokens === 0)
          ) {
            response.usage = await estimateMessagesUsage({ assistant, messages: finalContextWithAssistant })
          }

          // todo set topic loading
          // dispatch(newMessagesActions.setTopicLoading({ topicId, loading: false }))
        }

        if (response && response.metrics) {
          if (response.metrics.completion_tokens === 0 && response.usage?.completion_tokens) {
            response = {
              ...response,
              metrics: {
                ...response.metrics,
                completion_tokens: response.usage.completion_tokens
              }
            }
          }
        }

        const messageUpdates: Partial<Message> = { status, metrics: response?.metrics, usage: response?.usage }

        await upsertMessages({ ...finalAssistantMsg, ...messageUpdates })
      }
    }
    const streamProcessorCallbacks = createStreamProcessor(callbacks)

    const orchestrationService = new OrchestrationService()
    await orchestrationService.handleUserMessage(
      {
        messages: messagesForContext,
        assistant,
        options: {
          timeout: 30000
        }
      },
      streamProcessorCallbacks
    )
  } catch (error) {
    logger.error('Error in fetchAndProcessAssistantResponseImpl:', error)
  }
}

// --- Helper Function for Multi-Model Dispatch ---
// 多模型创建和发送请求的逻辑，用于用户消息多模型发送和重发
export async function multiModelResponses(
  topicId: string,
  assistant: Assistant,
  triggeringMessage: Message, // userMessage or messageToResend
  mentionedModels: Model[]
) {
  logger.info('multiModelResponses')
  const assistantMessageStubs: Message[] = []
  const tasksToQueue: { assistantConfig: Assistant; messageStub: Message }[] = []

  for (const mentionedModel of mentionedModels) {
    const assistantForThisMention = { ...assistant, model: mentionedModel }
    const assistantMessage = createAssistantMessage(assistant.id, topicId, {
      askId: triggeringMessage.id,
      model: mentionedModel,
      modelId: mentionedModel.id
    })
    await upsertMessages(assistantMessage)
    assistantMessageStubs.push(assistantMessage)
    tasksToQueue.push({ assistantConfig: assistantForThisMention, messageStub: assistantMessage })
  }

  const queue = getTopicQueue(topicId)

  for (const task of tasksToQueue) {
    queue.add(async () => {
      await fetchAndProcessAssistantResponseImpl(topicId, task.assistantConfig, task.messageStub)
    })
  }
}
// --- End Helper Function ---

/**
 * 批量清理多个消息块。
 */
export async function cleanupMultipleBlocks(blockIds: string[]) {
  // blockIds.forEach(id => {
  //   cancelThrottledBlockUpdate(id)
  // })

  // const getBlocksFiles = async (blockIds: string[]) => {
  //   const blocks = await Promise.all(blockIds.map(id => getBlockById(id)))

  //   const files = blocks
  //     .filter((block): block is MessageBlock => block !== null)
  //     .filter(block => block.type === MessageBlockType.FILE || block.type === MessageBlockType.IMAGE)
  //     .map(block => block.file)
  //     .filter((file): file is FileType => file !== undefined)
  //   return isEmpty(files) ? [] : files
  // }

  // const cleanupFiles = async (files: FileType[]) => {
  //   await Promise.all(files.map(file => FileManager.deleteFile(file.id, false)))
  // }

  // getBlocksFiles(blockIds).then(cleanupFiles)

  if (blockIds.length > 0) {
    await removeManyBlocks(blockIds)
  }
}
