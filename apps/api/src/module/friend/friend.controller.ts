import { Elysia } from 'elysia'
import { authMiddleware } from '../../common/middleware/auth.middleware'
import { acceptOrrejectBody, sendRequestBody } from './friend.model'
import { friendService } from './friend.service'

export const friendController = new Elysia({
  prefix: '/friend',
  detail: {
    tags: ['Friend'],
  },
})
  .use(authMiddleware)
  .post(
    '/send',
    async ({ user, body }) => {
      const friend = await friendService.createFriend(user.id, body.target_id)
      return {
        success: true,
        data: friend,
      }
    },
    {
      isAuth: true,
      body: sendRequestBody,
    },
  )
  .post(
    '/accept-or-reject',
    async ({ body, user }) => {
      await friendService.updateFriend(body, user.id)
      return {
        success: true,
        data: null,
      }
    },
    {
      isAuth: true,
      body: acceptOrrejectBody,
    },
  )
  .get(
    '/list',
    async ({ user }) => {
      const data = await friendService.getFriendList(user.id)
      return {
        success: true,
        data,
      }
    },
    { isAuth: true },
  )
  .get(
    '/pending',
    async ({ user }) => {
      const data = await friendService.getIcomingFriendRequests(user.id)
      return {
        success: true,
        data,
      }
    },
    { isAuth: true },
  )
