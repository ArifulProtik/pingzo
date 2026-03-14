import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../common/middleware/auth.middleware'
import {
  createDirectConversationBody,
  createGroupConversationBody,
  markAsReadBody,
  messagesQuery,
  sendMessageBody,
} from './chat.model'
import { chatService } from './chat.service'

export const chatController = new Elysia({
  prefix: '/chat',
  detail: {
    tags: ['Chat'],
  },
})
  .use(authMiddleware)

  // ── Conversations ────────────────────────────────────────────

  .post(
    '/conversation/direct',
    async ({ user, body }) => {
      const data = await chatService.createOrGetDirectConversation(
        user.id,
        body.participantId,
      )
      return {
        success: true,
        data,
      }
    },
    {
      isAuth: true,
      body: createDirectConversationBody,
    },
  )

  .post(
    '/conversation/group',
    async ({ user, body }) => {
      const data = await chatService.createGroupConversation(
        user.id,
        body.participantIds,
        body.name,
      )
      return {
        success: true,
        data,
      }
    },
    {
      isAuth: true,
      body: createGroupConversationBody,
    },
  )

  .get(
    '/conversations',
    async ({ user }) => {
      const data = await chatService.getUserConversations(user.id)
      return {
        success: true,
        data,
      }
    },
    { isAuth: true },
  )

  .get(
    '/conversation/:id',
    async ({ user, params }) => {
      const data = await chatService.getConversationById(params.id, user.id)
      return {
        success: true,
        data,
      }
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
    },
  )

  // ── Messages ─────────────────────────────────────────────────

  .get(
    '/conversation/:id/messages',
    async ({ user, params, query }) => {
      const limit = query.limit ? Number.parseInt(query.limit, 10) : 50
      const data = await chatService.getMessages(
        params.id,
        user.id,
        query.cursor,
        limit,
      )
      return {
        success: true,
        data,
      }
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      query: messagesQuery,
    },
  )

  .post(
    '/conversation/:id/messages',
    async ({ user, params, body }) => {
      const data = await chatService.sendMessage(
        params.id,
        user.id,
        body.content,
        body.replyToMessageId,
      )
      return {
        success: true,
        data,
      }
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      body: sendMessageBody,
    },
  )

  // ── Read Receipts ────────────────────────────────────────────

  .post(
    '/conversation/:id/read',
    async ({ user, params, body }) => {
      await chatService.markAsRead(params.id, user.id, body.messageId)
      return {
        success: true,
        data: null,
      }
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      body: markAsReadBody,
    },
  )
