import { wsClient } from './ws-client';
import { registerEventHandler } from './ws-events';

export const initWS = () => {
  wsClient.connect();
  registerEventHandler();
};
