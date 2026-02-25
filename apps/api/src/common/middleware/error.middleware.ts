import type { Elysia } from 'elysia'
import {
  HttpError,
  setupOnError,
  UnprocessableEntityError,
} from '../error.type'

export const errorMiddleware = (app: Elysia) =>
  app
    .error({
      HttpError,
    })
    .onError(({ error, set, code }) => {
      switch (code) {
        case 'HttpError':
          return setupOnError(error, set)
        case 'VALIDATION':
          return setupOnError(
            new UnprocessableEntityError(error.message, error.all),
            set,
          )
        default:
          return setupOnError(error, set)
      }
    })
