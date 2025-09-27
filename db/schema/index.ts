import { relations } from 'drizzle-orm'

import { assistants } from './assistants'
import { topics } from './topics'

export * from './assistants'
export * from './backupProviders'
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
