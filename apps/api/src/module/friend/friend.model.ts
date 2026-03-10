import { type Static, t } from 'elysia'

export const sendRequestBody = t.Object({
  target_id: t.String(),
})

export const acceptOrrejectBody = t.Object({
  target_id: t.String(),
  action: t.Union([
    t.Literal('accepted'),
    t.Literal('rejected'),
    t.Literal('blocked'),
  ]),
})

export type acceptOrrejectBody = Static<typeof acceptOrrejectBody>
