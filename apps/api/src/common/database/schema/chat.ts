import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { user } from './auth'
import { baseColumns } from './base'

export const conversation = pgTable(
  'conversation',
  {
    ...baseColumns,
    name: text('name'),
    isGroup: boolean('is_group').notNull().default(false),
    createdBy: text('created_by')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    lastMessageId: text('last_message_id'),
  },
  (table) => [index('conversation_created_by_idx').on(table.createdBy)],
)

export const conversationParticipant = pgTable(
  'conversation_participant',
  {
    ...baseColumns,

    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversation.id, { onDelete: 'cascade' }),

    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    lastReadMessageId: text('last_read_message_id'),

    isMuted: boolean('is_muted').default(false),
  },
  (table) => [
    uniqueIndex('conversation_user_unique').on(
      table.conversationId,
      table.userId,
    ),
    index('conversation_participant_user_idx').on(table.userId),
  ],
)
export const message = pgTable(
  'message',
  {
    ...baseColumns,
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversation.id, { onDelete: 'cascade' }),
    senderId: text('sender_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    content: text('content'),
    replyToMessageId: text('reply_to_message_id'),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('message_conversation_idx').on(table.conversationId),
    index('message_sender_idx').on(table.senderId),
    index('message_created_idx').on(table.createdAt),
  ],
)

export const messageStatusEnum = pgEnum('message_status_enum', [
  'sent',
  'delivered',
  'seen',
])

export const messageStatus = pgTable(
  'message_status',
  {
    ...baseColumns,
    messageId: text('message_id')
      .notNull()
      .references(() => message.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    status: messageStatusEnum('status').notNull().default('sent'),
    deliveredAt: timestamp('delivered_at'),
    seenAt: timestamp('seen_at'),
  },
  (table) => [
    uniqueIndex('message_user_unique').on(table.messageId, table.userId),
    index('message_status_user_idx').on(table.userId),
  ],
)
export const messageAttachment = pgTable(
  'message_attachment',
  {
    ...baseColumns,
    messageId: text('message_id')
      .notNull()
      .references(() => message.id, { onDelete: 'cascade' }),
    fileUrl: text('file_url').notNull(),
    fileType: text('file_type'),
    fileName: text('file_name'),
    fileSize: text('file_size'),
  },
  (table) => [index('message_attachment_message_idx').on(table.messageId)],
)
