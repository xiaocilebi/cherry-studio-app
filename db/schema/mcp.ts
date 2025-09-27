import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const mcp = sqliteTable('mcp', {
  id: text('id').notNull().unique().primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  description: text('description'),
  isActive: integer('enabled', { mode: 'boolean' }),
})
