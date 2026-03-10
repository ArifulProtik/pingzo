import { treaty } from '@elysiajs/eden';
import type { App } from '@repo/contracts';

const isBrowser = typeof window !== 'undefined';

const getBaseUrl = () => {
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:3000';
};

export const client = treaty<App>(getBaseUrl(), {
  fetch: {
    credentials: 'include',
  },
  onRequest: async () => {
    if (!isBrowser) {
      const { getRequestHeaders } = await import(
        '@tanstack/react-start/server'
      );
      return {
        headers: getRequestHeaders(),
      };
    }
  },
});
