import { createFileRoute } from '@tanstack/react-router';
import { EmptyState } from '@/components/chat/empty-state';

export const Route = createFileRoute('/_main/chat/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <EmptyState />;
}
