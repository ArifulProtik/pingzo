import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ChatSidebar } from '@/components/chat/chat-sidebar';

export const Route = createFileRoute('/_main/chat/_chatindex')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full">
      <ChatSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
