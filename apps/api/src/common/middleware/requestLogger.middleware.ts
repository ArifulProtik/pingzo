import type { Elysia } from 'elysia'
import logixlysia from 'logixlysia'

export const requestLogger = (app: Elysia) =>
  app.use(
    logixlysia({
      config: {
        showStartupMessage: true,
        timestamp: {
          translateTime: 'yyyy-MM-dd HH:mm:ss.SSS',
        },
        ip: true,
        customLogFormat:
          '🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip}',
      },
    }),
  )
