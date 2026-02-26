import { createFileRoute } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_main/chat/')({
  component: RouteComponent,
});

function RouteComponent() {
  const logout = async () => {
    await authClient.signOut();
  };
  return (
    <div>
      <button
        type="button"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
