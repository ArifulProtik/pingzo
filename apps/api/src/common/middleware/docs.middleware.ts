import { openapi } from '@elysiajs/openapi'
import type { Elysia } from 'elysia'

export const docsMiddleware = (app: Elysia) =>
  app.use(
    openapi({
      path: '/docs',
      documentation: {
        info: {
          title: 'Pingzo API',
          version: '1.0.0',
          description: 'Pingzo API - For Chat/Social Media',
        },
        tags: [
          { name: 'Auth', description: 'Authentication With better-auth' },
        ],
      },
    }),
  )
