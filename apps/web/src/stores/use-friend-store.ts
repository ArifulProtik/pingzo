import { create } from 'zustand';

/**
 * Pending friend request data structure
 */
export interface PendingFriendRequest {
  friendship_id: string;
  user: {
    id: string;
    username: string | null;
    name: string;
    image: string | null;
  };
}

/**
 * Friend store interface
 * Manages global state for pending friend requests
 */
interface FriendStore {
  pendingCount: number;
  pendingRequests: PendingFriendRequest[];
  setPendingRequests: (requests: PendingFriendRequest[]) => void;
}

/**
 * Global store for friend-related state
 * Stores pending friend requests data to avoid duplicate API calls
 * Used by both GlobalSidebar (for badge count) and PendingFriend (for list display)
 */
export const useFriendStore = create<FriendStore>((set) => ({
  pendingCount: 0,
  pendingRequests: [],
  setPendingRequests: (requests) =>
    set({ pendingRequests: requests, pendingCount: requests.length }),
}));
