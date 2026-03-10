import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import NotFound from '@/components/shared/not-found';
import { Toaster } from '@/components/ui/sonner';
import { getSession } from '@/data/get-session';
import type { User } from '@/lib/auth-client';
import appCss from '../styles.css?url';
import TanStackQueryProvider from '../utils/root-provider';

interface MyRouterContext {
  queryClient: QueryClient;
  user: User | null | undefined;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: NotFound,
  beforeLoad: async () => {
    const data = await getSession();
    return { user: data ?? null };
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'PingZo | A Chat Application for Gen Z',
      },
      {
        name: 'description',
        content: 'A Chat Application for Gen Z',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TanStackQueryProvider>{children}</TanStackQueryProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
