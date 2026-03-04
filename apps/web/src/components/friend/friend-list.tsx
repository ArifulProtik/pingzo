import { IconUserOff } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/data/query-keys';
import { client } from '@/lib/api';
import EmptyState from '../shared/empty-state';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Spinner } from '../ui/spinner';

interface FriendListProps {}

/**
 * FriendList Component
 * Displays the user's accepted friends with automatic polling
 * Polls every 10 seconds to keep the list up-to-date
 */
const FriendList = ({}: FriendListProps) => {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.FRIEND_LIST(),
    queryFn: async () => {
      const res = await client.api.friend.list.get();
      return res.data;
    },
    refetchInterval: 10000, // Poll every 10s
  });

  if (isLoading) {
    return (
      <div
        className="flex h-full items-center justify-center"
        role="status"
        aria-label="Loading friends"
      >
        <Spinner className="size-12 text-muted-foreground" />
      </div>
    );
  }

  if (data?.success && data.data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          title="No friends yet"
          SubText="Search for users to add as friends"
          icon={IconUserOff}
          size="48"
          className="text-muted-foreground"
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-2 p-4"
      role="list"
      aria-label="Friends list"
    >
      <div
        className="text-muted-foreground text-sm mb-2"
        aria-live="polite"
      >
        {data?.data.length} {data?.data.length === 1 ? 'Friend' : 'Friends'}
      </div>
      {data?.data.map((friend) => (
        <div
          key={friend.id}
          className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
          role="listitem"
        >
          <Avatar>
            <AvatarImage
              src={
                friend.image ??
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`
              }
              alt={`${friend.name}'s avatar`}
            />
            <AvatarFallback>
              {friend.name?.slice(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{friend.name}</span>
            <span className="text-muted-foreground text-xs">
              @{friend.username}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendList;
