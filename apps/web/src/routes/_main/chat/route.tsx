import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { GlobalSidebar } from '@/components/chat/global-sidebar';

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
  return (
    <div className="flex h-screen">
      {/* Global Sidebar - 60px fixed width */}
      <div className="w-[60px] bg-sidebar border-r border-sidebar-border">
        <GlobalSidebar />
      </div>

      <main className="flex-1 bg-background">
        <Outlet />
      </main>
    </div>
  );
}
