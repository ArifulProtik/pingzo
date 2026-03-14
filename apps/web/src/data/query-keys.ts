/**
 * Query keys for TanStack Query
 * Centralized query key management for cache invalidation
 */
export const QUERY_KEYS = {
  SESSION: () => ['SESSION'],
  SEARCH_QUERY: (query: string) => ['SEARCH', query],
  FRIEND_LIST: () => ['FRIEND_LIST'],
  PENDING_FRIENDS: () => ['PENDING_FRIENDS'],
  CONVERSATIONS: () => ['CONVERSATIONS'],
  CONVERSATION: (conversationId: string) => ['CONVERSATION', conversationId],
  MESSAGES: (conversationId: string) => ['MESSAGES', conversationId],
};
