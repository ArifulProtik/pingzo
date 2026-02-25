import type { Elysia } from 'elysia'
import { HttpError, setupOnError } from '../error.type'

export const errorMiddleware = (app: Elysia) =>
  app
    .error({
      HttpError,
    })
    .onError(({ error, set, code }) => {
      switch (code) {
        case 'HttpError':
          return setupOnError(error, set)
        default:
          return setupOnError(error, set)
      }
    })
