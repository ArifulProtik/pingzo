import { IconUserOff } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { memo, useEffect } from 'react';
import { QUERY_KEYS } from '@/data/query-keys';
import { useFriendStore } from '@/hooks/use-friend-store';
import { client } from '@/lib/api';

import EmptyState from '../shared/empty-state';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Spinner } from '../ui/spinner';

interface Friend {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
}

const FriendRow = memo(({ friend }: { friend: Friend }) => {
  const isOnline = useFriendStore((s) => s.onlineFriendIDS.has(friend.id));

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
      <div className="relative">
        <Avatar size="lg">
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
          {isOnline ? (
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          ) : (
            <AvatarBadge className="bg-gray-400 dark:bg-gray-600" />
          )}
        </Avatar>
      </div>

      <div className="flex flex-col text-left">
        <span className="font-medium text-sm">{friend.name}</span>
        <span className="text-muted-foreground text-xs">
          @{friend.username}
        </span>
      </div>
    </div>
  );
});

FriendRow.displayName = 'FriendRow';

const FriendList = () => {
  const setOnlineFriends = useFriendStore((s) => s.setOnlineFriends);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.FRIEND_LIST(),
    queryFn: async () => {
      const res = await client.api.friend.list.get();
      return res.data;
    },
  });

  useEffect(() => {
    if (data?.success) {
      const friendIDS = data.data.filter((f) => f.isOnline).map((f) => f.id);
      setOnlineFriends(friendIDS);
    }
  }, [data, setOnlineFriends]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
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
    <div className="flex flex-col gap-2 p-4">
      {data?.data.map((friend) => (
        <FriendRow
          key={friend.id}
          friend={friend}
        />
      ))}
    </div>
  );
};

export default FriendList;
