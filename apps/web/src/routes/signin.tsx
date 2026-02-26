import { createFileRoute, redirect } from '@tanstack/react-router';
import SignInForm from '@/components/auth/singin-form';
import Footer from '@/components/shared/footer';
import Logo from '@/components/shared/logo';

export const Route = createFileRoute('/signin')({
  beforeLoad: ({ context: { user } }) => {
    if (user) {
      throw redirect({
        to: '/',
      });
    }
  },
  head: () => ({
    meta: [
      {
        name: 'description',
        content: 'Sign in to PingZo',
      },
      { title: 'Sign In - PingZo' },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 flex-1 justify-center">
        <div className="mx-auto">
          <Logo text="PingZo" />
        </div>
        <SignInForm />
      </div>
      <Footer />
    </div>
  );
}
