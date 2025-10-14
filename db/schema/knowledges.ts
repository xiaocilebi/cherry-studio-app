import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createUpdateTimestamps } from './columnHelpers'

export const knowledges = sqliteTable('knowledges', {
  id: text('id').notNull().unique().primaryKey(),
  name: text('name').notNull(),
  model: text('model').notNull(),
  dimensions: integer('dimensions').notNull(),
  description: text('description'),
  version: text('version').notNull(),
  document_count: integer('document_count'),
  chunk_size: integer('chunk_size'),
  chunk_overlap: integer('chunk_overlap'),
  threshold: integer('threshold'),
  rerank_model: text('rerank_model'),
  items: text('items').notNull(),
  ...createUpdateTimestamps
})
