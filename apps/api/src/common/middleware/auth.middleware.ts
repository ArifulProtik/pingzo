import type { User } from 'better-auth/types'
import { Elysia } from 'elysia'
import { UnauthorizedError } from '../error.type'
import { auth } from '../lib/app.auth'

export const authMiddleware = new Elysia()

  .derive({ as: 'global' }, () => {
    return {
      user: null as User | null,
    }
  })

  .macro({
    isAuth: {
      async resolve({ request }) {
        const session = await auth.api.getSession({
          headers: request.headers,
        })
        if (session) {
          return {
            user: session.user,
          }
        }
        throw new UnauthorizedError(
          'You are not authorized to access this resource. please sign in',
        )
      },
    },

    isAuthOptional: {
      async resolve({ request }) {
        const session = await auth.api.getSession({ headers: request.headers })
        if (session) {
          return {
            user: session.user,
          }
        }
        return {
          user: null,
        }
      },
    },
  })
