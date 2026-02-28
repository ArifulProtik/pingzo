import { and, DrizzleError, eq, ne, or } from 'drizzle-orm'
import { alias, unionAll } from 'drizzle-orm/pg-core'
import { db } from '@/common/database'
import { user } from '@/common/database/schema'
import { friend } from '@/common/database/schema/friend'
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from '@/common/error.type'
import { appLogger } from '@/common/lib/app.logger'
import type { acceptOrrejectBody } from './friend.model'

const getCanonicalPair = (userA: string, userB: string) =>
  userA < userB
    ? { userOneId: userA, userTwoId: userB }
    : { userOneId: userB, userTwoId: userA }

export const createFriend = async (requesterID: string, targetID: string) => {
  if (requesterID === targetID) {
    throw new BadRequestError('You cannot friend yourself')
  }

  const { userOneId, userTwoId } = getCanonicalPair(requesterID, targetID)

  const existing = await db.query.friend.findFirst({
    where: (f, { and, eq }) =>
      and(eq(f.userOneId, userOneId), eq(f.userTwoId, userTwoId)),
  })

  if (existing) {
    throw new ConflictError('Friend request already exists')
  }

  try {
    const inserted = await db
      .insert(friend)
      .values({
        userOneId,
        userTwoId,
        actionUserId: requesterID,
      })
      .returning()

    return inserted[0]
  } catch (error) {
    if (error instanceof DrizzleError) {
      appLogger.error({ error }, '[friend_service]')
      throw new InternalServerError('Database error', error)
    }
    throw error
  }
}

export const updateFriend = async (
  body: acceptOrrejectBody,
  actorID: string,
) => {
  const { userOneId, userTwoId } = getCanonicalPair(actorID, body.target_id)
  try {
    const existing = await db.query.friend.findFirst({
      where: (f, { and, eq }) =>
        and(
          eq(f.userOneId, userOneId),
          eq(f.userTwoId, userTwoId),
          eq(f.status, 'pending'),
        ),
    })
    if (!existing) throw new BadRequestError('Friend request not found')
    await db.update(friend).set({ status: body.action, actionUserId: actorID })
  } catch (e) {
    appLogger.error(
      { error: e },
      '[friend_service] Failed to update friend status',
    )
    throw new BadRequestError('Failed to update friend status')
  }
}
const friendUser = alias(user, 'friendUser')
export const getFriendList = async (userID: string) => {
  try {
    const asUserOne = db
      .select({
        id: friendUser.id,
        name: friendUser.name,
        username: friendUser.username,
        image: friendUser.image,
      })
      .from(friend)
      .innerJoin(friendUser, eq(friend.userTwoId, friendUser.id))
      .where(and(eq(friend.userOneId, userID), eq(friend.status, 'accepted')))

    const asUserTwo = db
      .select({
        id: friendUser.id,
        name: friendUser.name,
        username: friendUser.username,
        image: friendUser.image,
      })
      .from(friend)
      .innerJoin(friendUser, eq(friend.userOneId, friendUser.id))
      .where(and(eq(friend.userTwoId, userID), eq(friend.status, 'accepted')))

    const userlist = await unionAll(asUserOne, asUserTwo)
    return userlist
  } catch (e) {
    appLogger.error({ error: e }, '[friend_service] Failed to get friend list')
    throw new BadRequestError('Failed to get friend list')
  }
}

export const getIcomingFriendRequests = async (userID: string) => {
  try {
    const rows = await db
      .select({
        friend_id: friend.id,
        senderId: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
      })
      .from(friend)
      .innerJoin(user, eq(user.id, friend.actionUserId))
      .where(
        and(
          eq(friend.status, 'pending'),
          ne(friend.actionUserId, userID),
          or(eq(friend.userOneId, userID), eq(friend.userTwoId, userID)),
        ),
      )

    return rows.map((r) => ({
      friendship_id: r.friend_id,
      user: {
        id: r.senderId,
        username: r.username,
        name: r.name,
        image: r.image,
      },
    }))
  } catch (e) {
    appLogger.error(
      { error: e },
      '[friend_service] Failed to get incoming friend requests',
    )
    throw new BadRequestError('Failed to get incoming friend requests')
  }
}
