import { and, desc, eq, lt, ne, or, sql } from 'drizzle-orm'
import { db } from '../../common/database'
import {
  conversation,
  conversationParticipant,
  message,
  messageStatus,
  user,
} from '../../common/database/schema'
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from '../../common/error.type'
import { appLogger } from '../../common/lib/app.logger'
import { webSocketService } from '../ws/ws.service'

class ChatService {
  // ── Conversations ──────────────────────────────────────────────

  /**
   * Find or create a 1:1 (direct) conversation between two users.
   * Returns the existing conversation if one already exists.
   */
  async createOrGetDirectConversation(
    currentUserId: string,
    participantId: string,
  ) {
    if (currentUserId === participantId) {
      throw new BadRequestError('Cannot create a conversation with yourself')
    }

    try {
      // Check if a direct (non-group) conversation already exists between these two users
      const existing = await db
        .select({ conversationId: conversationParticipant.conversationId })
        .from(conversationParticipant)
        .where(
          and(
            eq(conversationParticipant.userId, currentUserId),
            eq(
              conversationParticipant.conversationId,
              db
                .select({ id: conversationParticipant.conversationId })
                .from(conversationParticipant)
                .innerJoin(
                  conversation,
                  and(
                    eq(conversation.id, conversationParticipant.conversationId),
                    eq(conversation.isGroup, false),
                  ),
                )
                .where(eq(conversationParticipant.userId, participantId))
                .limit(1),
            ),
          ),
        )
        .limit(1)

      if (existing.length > 0) {
        const conv = await this.getConversationById(
          existing[0].conversationId,
          currentUserId,
        )
        return conv
      }

      // Verify the target user exists
      const targetUser = await db.query.user.findFirst({
        where: (u, { eq }) => eq(u.id, participantId),
        columns: { id: true },
      })
      if (!targetUser) {
        throw new NotFoundError('User not found')
      }

      // Create new conversation + participants in a transaction
      const result = await db.transaction(async (tx) => {
        const [newConversation] = await tx
          .insert(conversation)
          .values({
            isGroup: false,
            createdBy: currentUserId,
          })
          .returning()

        await tx.insert(conversationParticipant).values([
          { conversationId: newConversation.id, userId: currentUserId },
          { conversationId: newConversation.id, userId: participantId },
        ])

        return newConversation
      })

      return await this.getConversationById(result.id, currentUserId)
    } catch (e) {
      if (
        e instanceof BadRequestError ||
        e instanceof NotFoundError ||
        e instanceof ForbiddenError
      ) {
        throw e
      }
      appLogger.error(
        { error: e },
        '[chat_service] Failed to create or get direct conversation',
      )
      throw new InternalServerError(
        'Failed to create or get direct conversation',
      )
    }
  }

  /**
   * Create a group conversation with multiple participants.
   */
  async createGroupConversation(
    currentUserId: string,
    participantIds: string[],
    name: string,
  ) {
    // Ensure the creator is included in the participant list
    const allParticipantIds = Array.from(
      new Set([currentUserId, ...participantIds]),
    )

    if (allParticipantIds.length < 3) {
      throw new BadRequestError(
        'Group conversations require at least 3 participants',
      )
    }

    try {
      // Verify all participants exist
      const existingUsers = await db
        .select({ id: user.id })
        .from(user)
        .where(or(...allParticipantIds.map((id) => eq(user.id, id))))

      if (existingUsers.length !== allParticipantIds.length) {
        throw new BadRequestError('One or more participants not found')
      }

      const result = await db.transaction(async (tx) => {
        const [newConversation] = await tx
          .insert(conversation)
          .values({
            isGroup: true,
            name,
            createdBy: currentUserId,
          })
          .returning()

        await tx.insert(conversationParticipant).values(
          allParticipantIds.map((userId) => ({
            conversationId: newConversation.id,
            userId,
          })),
        )

        return newConversation
      })

      return await this.getConversationById(result.id, currentUserId)
    } catch (e) {
      if (e instanceof BadRequestError) throw e
      appLogger.error(
        { error: e },
        '[chat_service] Failed to create group conversation',
      )
      throw new InternalServerError('Failed to create group conversation')
    }
  }

  /**
   * List all conversations for a user, with last message, participants, and unread count.
   */
  async getUserConversations(currentUserId: string) {
    try {
      // Get all conversation IDs the user is part of
      const participations = await db
        .select({
          conversationId: conversationParticipant.conversationId,
          lastReadMessageId: conversationParticipant.lastReadMessageId,
          isMuted: conversationParticipant.isMuted,
        })
        .from(conversationParticipant)
        .where(eq(conversationParticipant.userId, currentUserId))

      if (participations.length === 0) return []

      const conversationIds = participations.map((p) => p.conversationId)

      // Get conversations with their last message
      const conversations = await db
        .select({
          id: conversation.id,
          name: conversation.name,
          isGroup: conversation.isGroup,
          createdBy: conversation.createdBy,
          lastMessageId: conversation.lastMessageId,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
        })
        .from(conversation)
        .where(or(...conversationIds.map((id) => eq(conversation.id, id))))

      // Build result with participants, last message, and unread count
      const result = await Promise.all(
        conversations.map(async (conv) => {
          const participation = participations.find(
            (p) => p.conversationId === conv.id,
          )

          // Get other participants (only for 1:1 conversations, exclude current user)
          let participants: {
            id: string
            name: string
            username: string | null
            image: string | null
          }[] = []

          if (!conv.isGroup) {
            participants = await db
              .select({
                id: user.id,
                name: user.name,
                username: user.username,
                image: user.image,
              })
              .from(conversationParticipant)
              .innerJoin(user, eq(user.id, conversationParticipant.userId))
              .where(
                and(
                  eq(conversationParticipant.conversationId, conv.id),
                  ne(conversationParticipant.userId, currentUserId),
                ),
              )
              .limit(1)
          }

          // Get last message with sender info
          let lastMessage = null
          if (conv.lastMessageId) {
            const [msg] = await db
              .select({
                id: message.id,
                content: message.content,
                senderId: message.senderId,
                createdAt: message.createdAt,
                senderName: user.name,
              })
              .from(message)
              .innerJoin(user, eq(user.id, message.senderId))
              .where(eq(message.id, conv.lastMessageId))
              .limit(1)

            lastMessage = msg || null
          }

          // Count unread messages (messages after lastReadMessageId)
          let unreadCount = 0
          if (participation?.lastReadMessageId) {
            // Get the createdAt of the last read message
            const [lastRead] = await db
              .select({ createdAt: message.createdAt })
              .from(message)
              .where(eq(message.id, participation.lastReadMessageId))
              .limit(1)

            if (lastRead) {
              const [countResult] = await db
                .select({ count: sql<number>`count(*)::int` })
                .from(message)
                .where(
                  and(
                    eq(message.conversationId, conv.id),
                    ne(message.senderId, currentUserId),
                    sql`${message.createdAt} > ${lastRead.createdAt}`,
                  ),
                )
              unreadCount = countResult?.count ?? 0
            }
          } else {
            // No lastReadMessageId means all messages from others are unread
            const [countResult] = await db
              .select({ count: sql<number>`count(*)::int` })
              .from(message)
              .where(
                and(
                  eq(message.conversationId, conv.id),
                  ne(message.senderId, currentUserId),
                ),
              )
            unreadCount = countResult?.count ?? 0
          }

          return {
            id: conv.id,
            name: conv.name,
            isGroup: conv.isGroup,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
            participants,
            lastMessage,
            unreadCount,
            isMuted: participation?.isMuted ?? false,
          }
        }),
      )

      // Sort by last message time or conversation creation time (most recent first)
      result.sort((a, b) => {
        const timeA = a.lastMessage?.createdAt ?? a.createdAt
        const timeB = b.lastMessage?.createdAt ?? b.createdAt
        return (
          new Date(timeB as Date).getTime() - new Date(timeA as Date).getTime()
        )
      })

      return result
    } catch (e) {
      if (e instanceof BadRequestError || e instanceof ForbiddenError) throw e
      appLogger.error(
        { error: e },
        '[chat_service] Failed to get user conversations',
      )
      throw new InternalServerError('Failed to get conversations')
    }
  }

  /**
   * Get a single conversation by ID. Verifies the user is a participant.
   */
  async getConversationById(conversationId: string, currentUserId: string) {
    try {
      // Verify user is a participant
      const participation = await db.query.conversationParticipant.findFirst({
        where: (cp, { and, eq }) =>
          and(
            eq(cp.conversationId, conversationId),
            eq(cp.userId, currentUserId),
          ),
      })

      if (!participation) {
        throw new ForbiddenError(
          'You are not a participant of this conversation',
        )
      }

      const conv = await db.query.conversation.findFirst({
        where: (c, { eq }) => eq(c.id, conversationId),
      })

      if (!conv) {
        throw new NotFoundError('Conversation not found')
      }

      // Get participants (only for 1:1 conversations, exclude current user)
      let participants: {
        id: string
        name: string
        username: string | null
        image: string | null
      }[] = []

      if (!conv.isGroup) {
        participants = await db
          .select({
            id: user.id,
            name: user.name,
            username: user.username,
            image: user.image,
          })
          .from(conversationParticipant)
          .innerJoin(user, eq(user.id, conversationParticipant.userId))
          .where(
            and(
              eq(conversationParticipant.conversationId, conversationId),
              ne(conversationParticipant.userId, currentUserId),
            ),
          )
          .limit(1)
      }

      return {
        id: conv.id,
        name: conv.name,
        isGroup: conv.isGroup,
        createdBy: conv.createdBy,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        lastMessageId: conv.lastMessageId,
        participants,
      }
    } catch (e) {
      if (e instanceof ForbiddenError || e instanceof NotFoundError) throw e
      appLogger.error({ error: e }, '[chat_service] Failed to get conversation')
      throw new InternalServerError('Failed to get conversation')
    }
  }

  // ── Messages ───────────────────────────────────────────────────

  /**
   * Get paginated messages for a conversation (cursor-based, newest first).
   */
  async getMessages(
    conversationId: string,
    currentUserId: string,
    cursor?: string,
    limit = 50,
  ) {
    // Verify participation
    const participation = await db.query.conversationParticipant.findFirst({
      where: (cp, { and, eq }) =>
        and(
          eq(cp.conversationId, conversationId),
          eq(cp.userId, currentUserId),
        ),
    })

    if (!participation) {
      throw new ForbiddenError('You are not a participant of this conversation')
    }

    try {
      const conditions = [eq(message.conversationId, conversationId)]

      // If cursor provided, get messages older than the cursor
      if (cursor) {
        const cursorMessage = await db.query.message.findFirst({
          where: (m, { eq }) => eq(m.id, cursor),
          columns: { createdAt: true },
        })
        if (cursorMessage && cursorMessage.createdAt) {
          conditions.push(lt(message.createdAt, cursorMessage.createdAt))
        }
      }

      const messages = await db
        .select({
          id: message.id,
          content: message.content,
          senderId: message.senderId,
          replyToMessageId: message.replyToMessageId,
          createdAt: message.createdAt,
          deletedAt: message.deletedAt,
          senderName: user.name,
          senderUsername: user.username,
          senderImage: user.image,
        })
        .from(message)
        .innerJoin(user, eq(user.id, message.senderId))
        .where(and(...conditions))
        .orderBy(desc(message.createdAt))
        .limit(limit + 1) // Fetch one extra to determine if there are more

      const hasMore = messages.length > limit
      const data = hasMore ? messages.slice(0, limit) : messages
      const nextCursor = hasMore ? data[data.length - 1].id : null

      return {
        messages: data.map((m) => ({
          id: m.id,
          content: m.deletedAt ? null : m.content,
          senderId: m.senderId,
          replyToMessageId: m.replyToMessageId,
          createdAt: m.createdAt,
          isDeleted: m.deletedAt !== null,
          sender: {
            name: m.senderName,
            username: m.senderUsername,
            image: m.senderImage,
          },
        })),
        nextCursor,
        hasMore,
      }
    } catch (e) {
      if (e instanceof ForbiddenError) throw e
      appLogger.error({ error: e }, '[chat_service] Failed to get messages')
      throw new InternalServerError('Failed to get messages')
    }
  }

  /**
   * Send a message in a conversation. Creates message status rows for other
   * participants and broadcasts via WebSocket.
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    replyToMessageId?: string,
  ) {
    // Verify participation
    const participation = await db.query.conversationParticipant.findFirst({
      where: (cp, { and, eq }) =>
        and(eq(cp.conversationId, conversationId), eq(cp.userId, senderId)),
    })

    if (!participation) {
      throw new ForbiddenError('You are not a participant of this conversation')
    }

    try {
      // If replying, verify the reply target exists in this conversation
      if (replyToMessageId) {
        const replyTarget = await db.query.message.findFirst({
          where: (m, { and, eq }) =>
            and(
              eq(m.id, replyToMessageId),
              eq(m.conversationId, conversationId),
            ),
          columns: { id: true },
        })
        if (!replyTarget) {
          throw new BadRequestError('Reply target message not found')
        }
      }

      // Get other participants for status rows + WS broadcast
      const otherParticipants = await db
        .select({ userId: conversationParticipant.userId })
        .from(conversationParticipant)
        .where(
          and(
            eq(conversationParticipant.conversationId, conversationId),
            ne(conversationParticipant.userId, senderId),
          ),
        )

      const result = await db.transaction(async (tx) => {
        // Insert the message
        const [newMessage] = await tx
          .insert(message)
          .values({
            conversationId,
            senderId,
            content,
            replyToMessageId: replyToMessageId || null,
          })
          .returning()

        // Update conversation's lastMessageId
        await tx
          .update(conversation)
          .set({ lastMessageId: newMessage.id })
          .where(eq(conversation.id, conversationId))

        // Create message status rows for other participants
        if (otherParticipants.length > 0) {
          await tx.insert(messageStatus).values(
            otherParticipants.map((p) => ({
              messageId: newMessage.id,
              userId: p.userId,
              status: 'sent' as const,
            })),
          )
        }

        return newMessage
      })

      // Broadcast the new message to all other participants via WebSocket
      for (const participant of otherParticipants) {
        webSocketService.broadcastToUser(participant.userId, {
          type: 'message',
          payload: {
            messageId: result.id,
            conversationId: result.conversationId,
            senderId: result.senderId,
            content: result.content,
            replyToMessageId: result.replyToMessageId,
            createdAt:
              result.createdAt?.toISOString() ?? new Date().toISOString(),
          },
        })
      }

      return {
        id: result.id,
        conversationId: result.conversationId,
        senderId: result.senderId,
        content: result.content,
        replyToMessageId: result.replyToMessageId,
        createdAt: result.createdAt,
      }
    } catch (e) {
      if (e instanceof ForbiddenError || e instanceof BadRequestError) throw e
      appLogger.error({ error: e }, '[chat_service] Failed to send message')
      throw new InternalServerError('Failed to send message')
    }
  }

  // ── Read Receipts ──────────────────────────────────────────────

  /**
   * Mark a conversation as read up to a given message ID.
   * Updates the participant's lastReadMessageId and all messageStatus rows to 'seen'.
   */
  async markAsRead(
    conversationId: string,
    currentUserId: string,
    messageId: string,
  ) {
    // Verify participation
    const participation = await db.query.conversationParticipant.findFirst({
      where: (cp, { and, eq }) =>
        and(
          eq(cp.conversationId, conversationId),
          eq(cp.userId, currentUserId),
        ),
    })

    if (!participation) {
      throw new ForbiddenError('You are not a participant of this conversation')
    }

    try {
      // Verify the message belongs to this conversation
      const targetMessage = await db.query.message.findFirst({
        where: (m, { and, eq }) =>
          and(eq(m.id, messageId), eq(m.conversationId, conversationId)),
        columns: { id: true, createdAt: true },
      })

      if (!targetMessage) {
        throw new BadRequestError('Message not found in this conversation')
      }

      await db.transaction(async (tx) => {
        // Update participant's lastReadMessageId
        await tx
          .update(conversationParticipant)
          .set({ lastReadMessageId: messageId })
          .where(
            and(
              eq(conversationParticipant.conversationId, conversationId),
              eq(conversationParticipant.userId, currentUserId),
            ),
          )

        // Update all message statuses for this user in this conversation
        // where the message was created at or before the target message
        await tx
          .update(messageStatus)
          .set({
            status: 'seen',
            seenAt: new Date(),
          })
          .where(
            and(
              eq(messageStatus.userId, currentUserId),
              ne(messageStatus.status, 'seen'),
              eq(
                messageStatus.messageId,
                sql`ANY(
                  SELECT ${message.id} FROM ${message}
                  WHERE ${message.conversationId} = ${conversationId}
                  AND ${message.createdAt} <= ${targetMessage.createdAt}
                )`,
              ),
            ),
          )
      })

      return null
    } catch (e) {
      if (e instanceof ForbiddenError || e instanceof BadRequestError) throw e
      appLogger.error({ error: e }, '[chat_service] Failed to mark as read')
      throw new InternalServerError('Failed to mark as read')
    }
  }
}

export const chatService = new ChatService()
