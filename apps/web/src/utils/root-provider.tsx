import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { User } from 'better-auth';
import type { ReactNode } from 'react';

let context:
  | {
      queryClient: QueryClient;
      user: User | null;
    }
  | undefined;

export function getContext() {
  if (context) {
    return context;
  }

  const queryClient = new QueryClient();

  context = {
    queryClient,
    user: null,
  };

  return context;
}

export default function TanStackQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { queryClient } = getContext();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
