import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/')({
  beforeLoad: ({ context: { user } }) => {
    if (!user) {
      throw redirect({
        to: '/signin',
      });
    }
    throw redirect({
      to: '/chat',
    });
  },
  component: App,
});

function App() {
  return <h1 className="">Home</h1>;
}
