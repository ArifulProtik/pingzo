import { sql } from 'drizzle-orm'
import {
  check,
  index,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { user } from './auth'
import { baseColumns } from './base'

export const friendshipStatusEnum = pgEnum('friendship_status', [
  'pending',
  'accepted',
  'rejected',
  'blocked',
])

export const friend = pgTable(
  'friend',
  {
    ...baseColumns,
    userOneId: text('user_one_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    userTwoId: text('user_two_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    actionUserId: text('action_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }), // The user who initiated the action ex: reuest, block, rejected

    status: friendshipStatusEnum('status').notNull().default('pending'),
  },
  (table) => [
    uniqueIndex('friendships_unique_pair').on(table.userOneId, table.userTwoId),
    check('friendships_no_self', sql`${table.userOneId} <> ${table.userTwoId}`),
    index('friendships_user_one_status_idx').on(table.userOneId, table.status),
    index('friendships_user_two_status_idx').on(table.userTwoId, table.status),
    index('friendships_action_user_idx').on(table.actionUserId),
    index('friendships_status_idx').on(table.status),
  ],
)
