import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../common/middleware/auth.middleware'
import { userService } from './user.service'

export const userController = new Elysia({
  prefix: '/user',
  detail: { tags: ['User'] },
})
  .use(authMiddleware)
  .get(
    '/search',
    async ({ query, user }) => {
      const data = await userService.searchUsers(user.id, query.q)
      return { success: true, data }
    },
    {
      isAuth: true,
      query: t.Object({ q: t.String() }),
    },
  )
  .get(
    '/username/:username',
    async ({ params, user }) => {
      const data = await userService.getUserByUsername(user.id, params.username)
      return { success: true, data }
    },
    {
      isAuth: true,
      params: t.Object({ username: t.String() }),
    },
  )
