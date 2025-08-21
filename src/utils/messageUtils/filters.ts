// May need Block types if refactoring to use them
// import type { MessageBlock, MainTextMessageBlock } from '@renderer/types/newMessageTypes';

import { isEmpty } from 'lodash'

import { type GroupedMessage, MainTextMessageBlock, type Message, MessageBlockType } from '@/types/message' // Assuming correct Message type import

import { getBlockById } from '../../../db/queries/messageBlocks.queries'
// Assuming getGroupedMessages is also moved here or imported
// import { getGroupedMessages } from './path/to/getGroupedMessages';

/**
 * Filters out messages of type '@' or 'clear' and messages without main text content.
 */
export const filterMessages = async (messages: Message[]) => {
  const filteredMessages: Message[] = []

  for (const message of messages) {
    if (!message.blocks) {
      continue
    }

    const blocks = await Promise.all(message.blocks.map(blockId => getBlockById(blockId)))
    const mainTextBlock = blocks.find(block => block?.type === MessageBlockType.MAIN_TEXT && !isEmpty(block.content))

    if (!isEmpty((mainTextBlock as any)?.content?.trim())) {
      filteredMessages.push(message)
    }
  }

  return filteredMessages
}

/**
 * Filters messages to include only those after the last 'clear' type message.
 */
export function filterContextMessages(messages: Message[]): Message[] {
  const clearIndex = messages.findLastIndex(message => message.type === 'clear')

  if (clearIndex === -1) {
    return messages
  }

  return messages.slice(clearIndex + 1)
}

/**
 * Filters messages to start from the first message with role 'user'.
 */
export function filterUserRoleStartMessages(messages: Message[]): Message[] {
  const firstUserMessageIndex = messages.findIndex(message => message.role === 'user')

  if (firstUserMessageIndex === -1) {
    // Return empty array if no user message found, or original? Original returned messages.
    return messages
  }

  return messages.slice(firstUserMessageIndex)
}

/**
 * Filters out messages considered "empty" based on block content.
 */
export function filterEmptyMessages(messages: Message[]): Message[] {
  return messages.filter(async message => {
    let hasContent = false

    for (const blockId of message.blocks) {
      const block = await getBlockById(blockId)
      if (!block) continue

      if (block.type === MessageBlockType.MAIN_TEXT && !isEmpty((block as any).content?.trim())) {
        // Type assertion needed
        hasContent = true
        break
      }

      if (
        [
          MessageBlockType.IMAGE,
          MessageBlockType.FILE,
          MessageBlockType.CODE,
          MessageBlockType.TOOL,
          MessageBlockType.CITATION
        ].includes(block.type)
      ) {
        hasContent = true
        break
      }
    }

    return hasContent
  })
}

/**
 * Groups messages by user message ID or assistant askId.
 */
export function getGroupedMessages(messages: Message[]): { [key: string]: GroupedMessage[] } {
  const groups: { [key: string]: GroupedMessage[] } = {}
  messages.forEach((message, index) => {
    // Use askId if available (should be on assistant messages), otherwise group user messages individually
    const key = message.role === 'assistant' && message.askId ? 'assistant' + message.askId : message.role + message.id

    if (key && !groups[key]) {
      groups[key] = []
    }

    groups[key].push({ ...message, index }) // Add message with its original index
    // Sort by index within group to maintain original order
    groups[key].sort((a, b) => b.index - a.index)
  })
  return groups
}

/**
 * Filters messages based on the 'useful' flag and message role sequences.
 */
export function filterUsefulMessages(messages: Message[]): Message[] {
  let _messages = [...messages]
  const groupedMessages = getGroupedMessages(messages)

  Object.entries(groupedMessages).forEach(([key, groupedMsgs]) => {
    if (key.startsWith('assistant')) {
      const usefulMessage = groupedMsgs.find(m => m.useful === true)

      if (usefulMessage) {
        // Remove all messages in the group except the useful one
        groupedMsgs.forEach(m => {
          if (m.id !== usefulMessage.id) {
            _messages = _messages.filter(o => o.id !== m.id)
          }
        })
      } else if (groupedMsgs.length > 0) {
        // Keep only the last message if none are marked useful
        const messagesToRemove = groupedMsgs.slice(0, -1)
        messagesToRemove.forEach(m => {
          _messages = _messages.filter(o => o.id !== m.id)
        })
      }
    }
  })

  // Remove trailing assistant messages
  while (_messages.length > 0 && _messages[_messages.length - 1].role === 'assistant') {
    _messages.pop()
  }

  // Filter adjacent user messages, keeping only the last one
  _messages = _messages.filter((message, index, origin) => {
    return !(message.role === 'user' && index + 1 < origin.length && origin[index + 1].role === 'user')
  })

  return _messages
}

export async function filterMainTextMessages(messages: Message[]): Promise<Message[]> {
  const inclusionChecks = messages.map(async message => {
    if (!message.blocks?.length) {
      return false
    }

    const blocks = await Promise.all(message.blocks.map(blockId => getBlockById(blockId)))

    return blocks.some(
      block => block?.type === MessageBlockType.MAIN_TEXT && !isEmpty((block as MainTextMessageBlock).content?.trim())
    )
  })

  const results = await Promise.all(inclusionChecks)

  return messages.filter((_, index) => results[index])
}

// Note: getGroupedMessages might also need to be moved or imported.
// It depends on message.askId which should still exist on the Message type.
// export function getGroupedMessages(messages: Message[]): { [key: string]: (Message & { index: number })[] } {
//   const groups: { [key: string]: (Message & { index: number })[] } = {}
//   messages.forEach((message, index) => {
//     const key = message.askId ? 'assistant' + message.askId : 'user' + message.id
//     if (key && !groups[key]) {
//       groups[key] = []
//     }
//     groups[key].unshift({ ...message, index }) // Keep unshift if order matters for useful filter
//   })
//   return groups
// }
