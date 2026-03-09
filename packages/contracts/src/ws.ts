export type WSPresence = {
  userID: string
  isOnline: boolean
}
export type WSEventMap = {
  presence: WSPresence
}

export type WSEvent<T extends keyof WSEventMap = keyof WSEventMap> = {
  type: T
  payload: WSEventMap[T]
}
