import type { WSEvent, WSEventMap } from '@repo/contracts'
import type { WSocket } from './ws.model'

class WsService {
  private sockets = new Map<string, WSocket>()
  private connections = new Map<string, string>()
  private userConnections = new Map<string, Set<string>>()

  addConnections(socket: WSocket, userID: string) {
    this.sockets.set(socket.id, socket)
    this.connections.set(socket.id, userID)
    if (!this.userConnections.has(userID)) {
      this.userConnections.set(userID, new Set())
    }
    const set = this.userConnections.get(userID)
    set?.add(socket.id)
    return set?.size === 1
  }

  removeConnections(socketID: string) {
    this.sockets.delete(socketID)
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

  async sendToUser<T extends keyof WSEventMap>(
    userID: string,
    payload: WSEvent<T>,
  ) {
    const socketIDs = this.userConnections.get(userID)
    if (!socketIDs) return
    for (const socketID of socketIDs) {
      const socket = this.sockets.get(socketID)
      socket?.send(payload)
    }
  }

  async broadCastPresence(
    sourceUserID: string,
    friendIDS: string[],
    isOnline: boolean,
  ) {
    for (const friendID of friendIDS) {
      await this.sendToUser(friendID, {
        type: 'presence',
        payload: { userID: sourceUserID, isOnline },
      })
    }
  }
}

export const webSocketService = new WsService()
