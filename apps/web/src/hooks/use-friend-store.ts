import { create } from 'zustand';

export interface PendingFriendRequest {
  friendship_id: string;
  user: {
    id: string;
    username: string | null;
    name: string;
    image: string | null;
  };
}

interface FriendStore {
  onlineFriendIDS: Set<string>;

  pendingRequests: PendingFriendRequest[];
  pendingCount: number;

  setOnlineFriendID: (id: string) => void;
  removeOnlineFriendID: (id: string) => void;
  setOnlineFriends: (ids: string[]) => void;
  isOnline: (id: string) => boolean;

  setPendingRequests: (requests: PendingFriendRequest[]) => void;
}

export const useFriendStore = create<FriendStore>((set, get) => ({
  onlineFriendIDS: new Set(),

  pendingRequests: [],
  pendingCount: 0,

  setOnlineFriendID: (id) =>
    set((state) => {
      const setIDS = new Set(state.onlineFriendIDS);
      setIDS.add(id);

      return { onlineFriendIDS: setIDS };
    }),

  removeOnlineFriendID: (id) =>
    set((state) => {
      const setIDS = new Set(state.onlineFriendIDS);
      setIDS.delete(id);

      return { onlineFriendIDS: setIDS };
    }),

  setOnlineFriends: (ids) =>
    set({
      onlineFriendIDS: new Set(ids),
    }),

  isOnline: (id) => get().onlineFriendIDS.has(id),

  setPendingRequests: (requests) =>
    set({
      pendingRequests: requests,
      pendingCount: requests.length,
    }),
}));
