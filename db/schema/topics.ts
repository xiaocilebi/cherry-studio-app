import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { assistants } from './assistants'

export const topics = sqliteTable(
  'topics',
  {
    id: text('id').notNull().unique().primaryKey(),
    assistant_id: text('assistant_id')
      .notNull()
      .references(() => assistants.id),
    name: text('name').notNull(),
    created_at: text('created_at').notNull(),
    updated_at: text('updated_at').notNull(),
    messages: text('messages').notNull().default('[]'),
    pinned: integer('pinned', { mode: 'boolean' }),
    prompt: text('prompt'),
    is_name_manually_edited: integer('is_name_manually_edited', { mode: 'boolean' })
  },
  table => [
    index('idx_topics_assistant_id').on(table.assistant_id),
    index('idx_topics_created_at').on(table.created_at),
    index('idx_topics_assistant_id_created_at').on(table.assistant_id, table.created_at)
  ]
)
