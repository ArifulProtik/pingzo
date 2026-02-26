import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/signin')({
  beforeLoad: ({ context: { user } }) => {
    if (user) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/sign-in"!</div>;
}
