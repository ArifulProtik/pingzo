import { IconListSearch, IconUserPlus } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/data/query-keys';
import { useDebounce } from '@/hooks/use-debounce';
import { client } from '@/lib/api';
import EmptyState from '../shared/empty-state';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';

interface SearchUserProps {}
const SearchUser = ({}: SearchUserProps) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.SEARCH_QUERY(debouncedQuery),
    queryFn: async () => {
      const res = await client.api.user.search.get({
        query: { q: debouncedQuery },
      });
      return res.data;
    },
    enabled: Boolean(debouncedQuery) && debouncedQuery.length > 3,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="border-b py-2 text-muted-foreground">Search User</div>
      <div className="flex px-2">
        <Input
          placeholder="Search user"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {data?.data?.length === 0 && (
        <div className="flex-1">
          <EmptyState
            title="No user found."
            icon={IconListSearch}
            size="40"
            className="mt-16 text-muted-foreground"
          />
        </div>
      )}

      {!data && isLoading && (
        <div className="mx-auto flex-1">
          <Spinner className="mt-16 size-12 text-muted-foreground" />
        </div>
      )}

      {data?.success && data.data.length > 0 && (
        <div className="flex flex-col gap-2 p-2">
          {data.data.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={
                      user.image ??
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                    }
                  />
                  <AvatarFallback>
                    {user.name?.slice(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="font-medium text-sm">{user.name}</span>
                  <span className="text-muted-foreground text-xs">
                    @{user.username}
                  </span>
                </div>
              </div>
              {user.isFriend ? (
                <div className="text-muted-foreground text-sm">Friend</div>
              ) : (
                <AddFriendButton userId={user.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUser;

const AddFriendButton = ({ userId }: { userId: string }) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await client.api.friend.send.post({ target_id: userId });
      if (!res.data?.success) throw new Error('Failed to send request');
      return res.data;
    },
    onSuccess: () => {
      toast.success('Friend request sent');
    },
    onError: () => {
      toast.error('Failed to send friend request');
    },
  });

  return (
    <Button
      size="sm"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending || mutation.isSuccess}
    >
      <IconUserPlus className="mr-2 size-4" />
      {mutation.isSuccess ? 'Sent' : 'Add'}
    </Button>
  );
};
