import { Elysia } from 'elysia'
import { authMiddleware } from 'src/common/middleware/auth.middleware'
import { friendService } from '../friend/friend.service'
import { webSocketService } from './ws.service'

export const wsController = new Elysia({
  websocket: { idleTimeout: 30000 },
})
  .use(authMiddleware)
  .ws('/ws', {
    isAuth: true,
    async pong() {},
    async open(ws) {
      const userID = ws.data.user.id
      const becameOnline = webSocketService.addConnections(ws, userID)
      if (!becameOnline) return
      const friendIDS = await friendService.getFrienduserIDs(userID)
      if (friendIDS.length > 0) {
        await webSocketService.broadCastPresence(userID, friendIDS, true)
      }
    },
    async close(ws) {
      const userID = ws.data.user.id
      const wentOffline = webSocketService.removeConnections(ws.id)
      if (!wentOffline) return
      const friendIDS = await friendService.getFrienduserIDs(userID)
      if (friendIDS.length > 0) {
        await webSocketService.broadCastPresence(userID, friendIDS, false)
      }
    },
  })
