import cors from '@elysiajs/cors'
import Elysia from 'elysia'
import { config } from './common/config'
import { docsMiddleware } from './common/middleware/docs.middleware'
import { errorMiddleware } from './common/middleware/error.middleware'
import { requestLogger } from './common/middleware/requestLogger.middleware'
import { authModule } from './module/auth/auth.controller'
import { chatController } from './module/chat/chat.controller'
import { friendController } from './module/friend/friend.controller'
import { userController } from './module/user/user.controller'
import { wsController } from './module/ws/ws.controller'

export const server = new Elysia({
  prefix: '/api',
})
  .use(requestLogger)
  .use(
    cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
    }),
  )
  .use(errorMiddleware)
  .use(docsMiddleware)
  .get('/health', () => ({
    status: 'Ok',
  }))
  .use(authModule)
  .use(friendController)
  .use(chatController)
  .use(userController)
  .use(wsController)

export type App = typeof server
