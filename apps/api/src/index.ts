import { config } from './common/config'
import { closeDatabase, pingDatabase } from './common/database'
import { appLogger } from './common/lib/app.logger'
import { server } from './server'

let isShuttingDown = false

const shutdown = async (signal: string) => {
  if (isShuttingDown) return
  isShuttingDown = true

  appLogger.info(`[SERVER] Received ${signal}. Starting graceful shutdown...`)

  const forceShutdown = setTimeout(() => {
    appLogger.error('[SERVER] Graceful shutdown timed out. Forcing exit.')
    process.exit(1)
  }, 10000)

  try {
    await Promise.all([server.stop(), closeDatabase()])

    clearTimeout(forceShutdown)

    appLogger.info('[SERVER] Shutdown completed successfully')
    process.exit(0)
  } catch (error) {
    appLogger.error({ error }, '[SERVER] Error during shutdown')
    process.exit(2)
  }
}

process.on('unhandledRejection', (reason) => {
  appLogger.error({ reason }, '[PROCESS] Unhandled Rejection')
})

process.on('uncaughtException', (error) => {
  appLogger.fatal({ error }, '[PROCESS] Uncaught Exception')
  process.exit(1)
})

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

const start = async () => {
  try {
    await pingDatabase()
    appLogger.info('[DB] Database connection successful')

    server.listen({ port: config.PORT })

    appLogger.info(`[SERVER] Server is running on port ${config.PORT}`)
    appLogger.info(`[ENV] Environment: ${config.NODE_ENV}`)
    appLogger.info(
      `[API] API docs available at ${config.HOST}:${config.PORT}/api/docs`,
    )
  } catch (error) {
    appLogger.error({ error }, '[STARTUP] Failed to start application')
    process.exit(1)
  }
}

start()
