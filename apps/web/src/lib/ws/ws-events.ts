import type { WSEventMap } from '@repo/contracts';
import { QUERY_KEYS } from '@/data/query-keys';
import { useFriendStore } from '@/hooks/use-friend-store';
import { getContext } from '@/utils/root-provider';
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
  message: (payload) => {
    const { queryClient } = getContext();
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS() });
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MESSAGES(payload.conversationId),
    });
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
