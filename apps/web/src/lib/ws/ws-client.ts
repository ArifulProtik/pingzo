import type { WSEvent, WSEventMap } from '@repo/contracts';

type Handler<T extends keyof WSEventMap> = (payload: WSEventMap[T]) => void;
type AnyHandler = (payload: WSEventMap[keyof WSEventMap]) => void;

class WSClient {
  private ws?: WebSocket;
  private handlers = new Map<keyof WSEventMap, Set<AnyHandler>>();
  // @ts-ignore TS6133: 'reconnectTimer' is declared but its value is never read.
  private reconnectTimer?: number;
  private reconnectAttempts = 0;
  private closeSignal = false;
  constructor(private url: string) {}

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const data: WSEvent = JSON.parse(event.data);
      this.dispatch(data);
    };
    this.ws.onclose = () => {
      console.log('WS disconnected');
      if (!this.closeSignal) {
        this.reconnect();
      }
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }
  close() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.closeSignal = true;
    this.ws?.close();
    this.ws = undefined;
  }
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
  private reconnect() {
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000); // Exponential backoff with a maximum of 30 seconds
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }
  private dispatch(event: WSEvent) {
    const listener = this.handlers.get(event.type);
    if (!listener) return;
    for (const handler of listener) handler(event.payload);
  }
  on<T extends keyof WSEventMap>(type: T, handler: Handler<T>) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    const set = this.handlers.get(type);
    set?.add(handler as AnyHandler);
    return () => set?.delete(handler as AnyHandler);
  }
  send<T extends keyof WSEventMap>(event: WSEvent<T>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    }
  }
}
export const wsClient = new WSClient('ws://localhost:3000/api/ws');
