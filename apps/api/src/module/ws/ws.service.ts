import type { WSEvent, WSEventMap } from '@repo/contracts'
import { wsChannelKeys } from './ws.model'

// type Server = {
//   publish: (channel: string, data: unknown) => void
// }

class WsService {
  private server: { publish(topic: string, data: string): void } | null = null
  private connections = new Map<string, string>()
  private userConnections = new Map<string, Set<string>>()

  setServer(server: { publish(topic: string, data: string): void }) {
    this.server = server
  }

  addConnection(socketID: string, userID: string) {
    this.connections.set(socketID, userID)
    if (!this.userConnections.has(userID)) {
      this.userConnections.set(userID, new Set())
    }
    const set = this.userConnections.get(userID)
    set?.add(socketID)
    return set?.size === 1
  }

  removeConnection(socketID: string) {
    const userID = this.connections.get(socketID)
    if (!userID) return false
    const set = this.userConnections.get(userID)
    set?.delete(socketID)
    const wentOffline = !set?.size
    if (wentOffline) this.userConnections.delete(userID)
    this.connections.delete(socketID)
    return wentOffline
  }

  isOnline(userID: string) {
    return this.userConnections.has(userID)
  }

  publish<T extends keyof WSEventMap>(channel: string, payload: WSEvent<T>) {
    this.server?.publish(channel, JSON.stringify(payload))
  }

  broadcastToUser<T extends keyof WSEventMap>(
    userID: string,
    payload: WSEvent<T>,
  ) {
    this.publish(wsChannelKeys.userChannel(userID), payload)
  }

  broadCastPresence(
    sourceUserID: string,
    friendIDS: string[],
    isOnline: boolean,
  ) {
    for (const friendID of friendIDS) {
      this.broadcastToUser(friendID, {
        type: 'presence',
        payload: { userID: sourceUserID, isOnline },
      })
    }
  }
}

export const webSocketService = new WsService()
