import { type Static, t } from 'elysia'

// ── Create / Get Direct Conversation ───────────────────────────────
export const createDirectConversationBody = t.Object({
  participantId: t.String(),
})

export type CreateDirectConversationBody = Static<
  typeof createDirectConversationBody
>

// ── Create Group Conversation ──────────────────────────────────────
export const createGroupConversationBody = t.Object({
  participantIds: t.Array(t.String(), { minItems: 2 }),
  name: t.String({ minLength: 1 }),
})

export type CreateGroupConversationBody = Static<
  typeof createGroupConversationBody
>

// ── Send Message ───────────────────────────────────────────────────
export const sendMessageBody = t.Object({
  content: t.String({ minLength: 1 }),
  replyToMessageId: t.Optional(t.String()),
})

export type SendMessageBody = Static<typeof sendMessageBody>

// ── Mark As Read ───────────────────────────────────────────────────
export const markAsReadBody = t.Object({
  messageId: t.String(),
})

export type MarkAsReadBody = Static<typeof markAsReadBody>

// ── Messages Query Params (cursor-based pagination) ────────────────
export const messagesQuery = t.Object({
  cursor: t.Optional(t.String()),
  limit: t.Optional(t.String({ default: '50' })),
})

export type MessagesQuery = Static<typeof messagesQuery>
