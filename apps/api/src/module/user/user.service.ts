import { and, eq, ilike, ne, or, sql } from 'drizzle-orm'
import { db } from '../../common/database'
import { friend, user } from '../../common/database/schema'
import { InternalServerError } from '../../common/error.type'
import { appLogger } from '../../common/lib/app.logger'

export const searchUsers = async (currentUserID: string, search: string) => {
  try {
    return await db
      .select({
        id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
        isFriend: sql<boolean>`
        ${friend.id} IS NOT NULL
      `,
      })
      .from(user)
      .leftJoin(
        friend,
        and(
          eq(friend.status, 'accepted'),
          or(
            and(
              eq(friend.userOneId, currentUserID),
              eq(friend.userTwoId, user.id),
            ),
            and(
              eq(friend.userTwoId, currentUserID),
              eq(friend.userOneId, user.id),
            ),
          ),
        ),
      )
      .where(
        and(
          or(
            ilike(user.name, `%${search}%`),
            ilike(user.username, `%${search}%`),
          ),
          ne(user.id, currentUserID),
        ),
      )
  } catch (e) {
    appLogger.error({ error: e }, '[user_service] Failed to search users')
    throw new InternalServerError('Failed to search users')
  }
}
