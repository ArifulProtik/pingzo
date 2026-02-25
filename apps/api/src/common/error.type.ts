import type { Context } from 'elysia'
import { appLogger } from './lib/app.logger'

export type ErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY'
  | 'TOO_MANY_REQUESTS'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'BAD_GATEWAY'

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: ErrorCode,
    message: string,
    public details?: unknown,
  ) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)

    this.name = new.target.name

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(400, 'BAD_REQUEST', message, details)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(401, 'UNAUTHORIZED', message, details)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', details?: unknown) {
    super(403, 'FORBIDDEN', message, details)
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Resource Not Found', details?: unknown) {
    super(404, 'NOT_FOUND', message, details)
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict', details?: unknown) {
    super(409, 'CONFLICT', message, details)
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = 'Unprocessable Entity', details?: unknown) {
    super(422, 'UNPROCESSABLE_ENTITY', message, details)
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message = 'Too Many Requests', details?: unknown) {
    super(429, 'TOO_MANY_REQUESTS', message, details)
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error', details?: unknown) {
    super(500, 'INTERNAL_SERVER_ERROR', message, details)
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message = 'Service Unavailable', details?: unknown) {
    super(503, 'SERVICE_UNAVAILABLE', message, details)
  }
}

export class BadGatewayError extends HttpError {
  constructor(message = 'Bad Gateway', details?: unknown) {
    super(502, 'BAD_GATEWAY', message, details)
  }
}

export const setupOnError = (error: unknown, set: Context['set']) => {
  if (error instanceof HttpError) {
    set.status = error.statusCode

    return {
      success: false,
      error: error.errorCode,
      message: error.message,
      details: error.details ?? undefined,
    }
  }

  if (error instanceof Error) {
    appLogger.error({ error }, '[UNHANDLED ERROR]')
  } else {
    appLogger.error({ error }, '[UNKNOWN THROW]')
  }

  set.status = 500

  return {
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : error instanceof Error
          ? error.message
          : 'Internal Server Error',
  }
}
