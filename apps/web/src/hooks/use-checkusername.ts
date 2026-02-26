import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';

export function useUsernameAvailability(username?: string) {
  return useQuery({
    queryKey: ['username-availability', username],
    queryFn: async () => {
      if (!username) return null;

      const { data, error } = await authClient.isUsernameAvailable({
        username,
      });

      if (error) {
        throw error;
      }

      return data?.available ?? false;
    },
    enabled: !!username && username.length >= 3,
    staleTime: 1000 * 60 * 5, // 5 min cache
    gcTime: 1000 * 60 * 10,
    retry: false,
  });
}
