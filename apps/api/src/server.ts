import cors from '@elysiajs/cors'
import Elysia from 'elysia'
import { config } from './common/config'
import { docsMiddleware } from './common/middleware/docs.middleware'
import { requestLogger } from './common/middleware/requestLogger.middleware'
import { authModule } from './module/auth/auth.controller'

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
  .use(docsMiddleware)
  .get('/health', () => ({
    status: 'Ok',
  }))
  .use(authModule)
