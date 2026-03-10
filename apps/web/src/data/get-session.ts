import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { authClient } from '@/lib/auth-client';
import { QUERY_KEYS } from './query-keys';

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const headers = getRequest().headers;
      const session = await authClient.getSession({
        fetchOptions: {
          headers: headers,
        },
      });
      return session.data?.user;
    } catch (error) {
      console.error('getAuthSession error:', error);
      throw error;
    }
  },
);

export const sessionQueryOption = queryOptions({
  queryKey: QUERY_KEYS.SESSION(),
  queryFn: async () => {
    const data = await getSession();
    return data ?? null;
  },
  staleTime: Infinity,
});
