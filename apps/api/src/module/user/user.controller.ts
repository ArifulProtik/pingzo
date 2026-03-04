import { Elysia, t } from 'elysia'
import { authMiddleware } from '../../common/middleware/auth.middleware'
import { searchUsers } from './user.service'

export const userController = new Elysia({
  prefix: '/user',
  detail: { tags: ['User'] },
})
  .use(authMiddleware)
  .get(
    '/search',
    async ({ query, user }) => {
      const data = await searchUsers(user.id, query.q)
      return { success: true, data }
    },
    {
      isAuth: true,
      query: t.Object({ q: t.String() }),
    },
  )
