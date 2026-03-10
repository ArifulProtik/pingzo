import { text, timestamp } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const baseColumns = {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}
