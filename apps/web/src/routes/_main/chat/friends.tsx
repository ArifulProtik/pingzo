import { createFileRoute } from '@tanstack/react-router';
import FriendsPage from '@/components/friend/friend-page';

export const Route = createFileRoute('/_main/chat/friends')({
  component: RouteComponent,
});

function RouteComponent() {
  return <FriendsPage />;
}
