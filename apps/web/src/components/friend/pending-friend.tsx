import { IconUserQuestion } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/data/query-keys';
import { useFriendStore } from '@/hooks/use-friend-store';
import { client } from '@/lib/api';
import EmptyState from '../shared/empty-state';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

interface PendingFriendProps {}

/**
 * PendingFriend Component
 * Displays incoming friend requests with accept/reject actions
 * Uses data from Zustand store (populated by GlobalSidebar polling)
 * This avoids duplicate API calls for the same data
 */
const PendingFriend = ({}: PendingFriendProps) => {
  // Use data from Zustand store instead of fetching independently
  // GlobalSidebar handles the polling and stores the data
  const { pendingRequests } = useFriendStore();

  if (pendingRequests.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          title="No pending requests"
          SubText="You're all caught up!"
          icon={IconUserQuestion}
          size="48"
          className="text-muted-foreground"
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-2 p-2"
      role="list"
      aria-label="Pending friend requests"
    >
      {pendingRequests.map((request) => (
        <PendingRequestCard
          key={request.friendship_id}
          request={request}
        />
      ))}
    </div>
  );
};

export default PendingFriend;

interface PendingRequestCardProps {
  request: {
    friendship_id: string;
    user: {
      id: string;
      username: string | null;
      name: string;
      image: string | null;
    };
  };
}

/**
 * PendingRequestCard Component
 * Individual card for a pending friend request with accept/reject buttons
 * Handles mutation and query invalidation on success
 */
const PendingRequestCard = ({ request }: PendingRequestCardProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (action: 'accepted' | 'rejected') => {
      const res = await client.api.friend['accept-or-reject'].post({
        target_id: request.user.id,
        action,
      });
      if (!res.data?.success) throw new Error('Failed to process request');
      return res.data;
    },
    onSuccess: (_, action) => {
      // Always invalidate pending friends list (will trigger refetch in GlobalSidebar)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_FRIENDS() });
      // Only invalidate friend list when accepting (optimization)
      if (action === 'accepted') {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIEND_LIST() });
      }
      toast.success(
        action === 'accepted'
          ? 'Friend request accepted'
          : 'Friend request rejected',
      );
    },
    onError: () => {
      toast.error('Failed to process friend request');
    },
  });

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border p-3"
      role="listitem"
    >
      <div className="flex items-center gap-2">
        <Avatar className="size-10">
          <AvatarImage
            src={
              request.user.image ??
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.user.username}`
            }
            alt={`${request.user.name}'s avatar`}
          />
          <AvatarFallback>
            {request.user.name?.slice(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-medium text-sm truncate">
            {request.user.name}
          </span>
          <span className="text-muted-foreground text-xs truncate">
            @{request.user.username}
          </span>
        </div>
      </div>
      <div
        className="flex gap-2"
        role="group"
        aria-label={`Actions for ${request.user.name}'s friend request`}
      >
        <Button
          size="sm"
          className="flex-1"
          onClick={() => mutation.mutate('accepted')}
          disabled={mutation.isPending}
          aria-label={`Accept friend request from ${request.user.name}`}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => mutation.mutate('rejected')}
          disabled={mutation.isPending}
          aria-label={`Reject friend request from ${request.user.name}`}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};
