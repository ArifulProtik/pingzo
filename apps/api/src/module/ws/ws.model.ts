import type { ElysiaWS } from 'elysia/ws'
export type WSocket = ElysiaWS

export const wsChannelKeys = {
  userChannel: (userID: string) => `user:${userID}`,
}
