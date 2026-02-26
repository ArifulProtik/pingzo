import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { authClient } from '@/lib/auth-client';

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const headers = getRequest().headers;
      const session = await authClient.getSession({
        fetchOptions: {
          headers: headers,
        },
      });
      return session;
    } catch (error) {
      console.error('getAuthSession error:', error);
      throw error;
    }
  },
);
