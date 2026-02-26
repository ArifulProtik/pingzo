import { createAuthClient } from 'better-auth/client';
import { usernameClient } from 'better-auth/client/plugins';
import { env } from '@/env';

export const authClient = createAuthClient({
  baseURL: `${env.VITE_API_BASE_URL}/api/auth`,
  plugins: [usernameClient()],
});

export type User = typeof authClient.$Infer.Session.user;
export type Session = typeof authClient.$Infer.Session;
