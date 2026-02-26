import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/chat')({
  beforeLoad: ({ context: { user } }) => {
    if (!user) {
      throw redirect({
        to: '/signin',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
