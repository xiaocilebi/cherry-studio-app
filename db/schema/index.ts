import { relations } from 'drizzle-orm'

import { assistants } from './assistants'
import { messageBlocks } from './messageBlocks'
import { messages } from './messages'
import { topics } from './topics'

export * from './assistants'
export * from './files'
export * from './knowledges'
export * from './messageBlocks'
export * from './messages'
export * from './providers'
export * from './topics'
export * from './websearchProviders'
export * from './mcp'

export const assistantsRelations = relations(assistants, ({ many }) => ({
  topics: many(topics)
}))

export const topicsRelations = relations(topics, ({ one }) => ({
  assistant: one(assistants, {
    fields: [topics.assistant_id],
    references: [assistants.id]
  })
}))

export const messagesRelations = relations(messages, ({ many }) => ({
  blocks: many(messageBlocks)
}))

export const messageBlocksRelations = relations(messageBlocks, ({ one }) => ({
  message: one(messages, {
    fields: [messageBlocks.message_id],
    references: [messages.id]
  })
}))
