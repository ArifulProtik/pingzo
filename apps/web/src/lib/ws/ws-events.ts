import type { WSEventMap } from '@repo/contracts';
import { useFriendStore } from '@/hooks/use-friend-store';
import { wsClient } from './ws-client';

type WSEventHandlers = {
  [K in keyof WSEventMap]?: (payload: WSEventMap[K]) => void;
};

const eventHandlers: WSEventHandlers = {
  presence: ({ userID, isOnline }) => {
    const store = useFriendStore.getState();
    if (!isOnline) {
      store.removeOnlineFriendID(userID);
      return;
    }
    store.setOnlineFriendID(userID);
  },
};

let registered = false;

export const registerEventHandler = () => {
  if (registered) return;
  registered = true;

  (Object.keys(eventHandlers) as (keyof WSEventMap)[]).forEach((type) => {
    const handler = eventHandlers[type];
    if (!handler) return;

    wsClient.on(type, handler as (payload: WSEventMap[typeof type]) => void);
  });
};
