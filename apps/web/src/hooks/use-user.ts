import { getRouteApi } from '@tanstack/react-router';

const rootRouteApi = getRouteApi('__root__');

export function useUser() {
  const { user } = rootRouteApi.useRouteContext();
  return user;
}
