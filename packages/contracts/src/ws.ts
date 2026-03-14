export type WSPresence = {
  userID: string
  isOnline: boolean
}
export type WSMessage = {
  messageId: string
  conversationId: string
  senderId: string
  content: string | null
  replyToMessageId: string | null
  createdAt: string
}
export type WSEventMap = {
  presence: WSPresence
  message: WSMessage
}

export type WSEvent<T extends keyof WSEventMap = keyof WSEventMap> = {
  type: T
  payload: WSEventMap[T]
}
