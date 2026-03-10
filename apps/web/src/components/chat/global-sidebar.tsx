import {
  IconChartBubbleFilled,
  IconMessage,
  IconUsers,
} from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useMatchRoute, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/data/query-keys';
import { useFriendStore } from '@/hooks/use-friend-store';
import { useUser } from '@/hooks/use-user';
import { client } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import { wsClient } from '@/lib/ws/ws-client';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export function GlobalSidebar() {
  const matchRoute = useMatchRoute();
  const isOnline = wsClient.isConnected();

  // Check if current route matches /chat or /chat/:username
  const isChatActive =
    matchRoute({ to: '/chat' }) ||
    (matchRoute({ to: '/chat/$username' }) &&
      !matchRoute({ to: '/chat/friends' }));

  const isFriendActive = matchRoute({ to: '/chat/friends' });

  const user = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const setPendingRequests = useFriendStore((s) => s.setPendingRequests);
  const pendingCount = useFriendStore((s) => s.pendingCount);

  useQuery({
    queryKey: QUERY_KEYS.PENDING_FRIENDS(),
    queryFn: async () => {
      const res = await client.api.friend.pending.get();
      if (res.data?.success) {
        setPendingRequests(res.data.data);
      }
      return res.data;
    },
    refetchInterval: 10000, // Poll every 10 seconds
    enabled: Boolean(user), // Only poll when logged in
  });

  const handleLogout = async () => {
    const res = await authClient.signOut();
    if (res.error) {
      toast.error(res.error.message);
    }
    if (res.data?.success) {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.SESSION() });
      router.invalidate();
      wsClient.close();
      toast.success('Logged out successfully');
    }
  };

  return (
    <nav
      className="flex flex-col items-center py-4 gap-4 h-full"
      aria-label="Global navigation"
    >
      {/* Top navigation icons */}
      <div className="flex flex-col items-center gap-4">
        <Link
          to="/"
          className="p-3 rounded-lg text-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          aria-label="Home"
        >
          <IconChartBubbleFilled
            size={24}
            stroke={1.5}
          />
        </Link>

        <Link
          to="/chat"
          className={`p-3 rounded-lg transition-colors ${
            isChatActive
              ? 'bg-primary/10 border-primary border text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }`}
          aria-label="Messages"
          aria-current={isChatActive ? 'page' : undefined}
        >
          <IconMessage
            size={24}
            stroke={1.5}
          />
        </Link>

        <Link
          to="/chat/friends"
          className={`relative p-3 rounded-lg transition-colors ${
            isFriendActive
              ? 'bg-primary/10 border-primary border text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }`}
          aria-label={
            pendingCount > 0
              ? `Friends, ${pendingCount} pending request${pendingCount > 1 ? 's' : ''}`
              : 'Friends'
          }
        >
          <IconUsers
            size={24}
            stroke={1.5}
          />
          {pendingCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-1 text-xs"
              aria-hidden="true"
            >
              {pendingCount > 99 ? '99+' : pendingCount}
            </Badge>
          )}
        </Link>
      </div>
      {user && (
        <div className="mt-auto">
          <Popover>
            <PopoverTrigger>
              <Avatar>
                <AvatarImage
                  src={
                    user?.image ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                  }
                />
                <AvatarFallback>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
                {isOnline ? (
                  <AvatarBadge className="bg-green-500 dark:bg-green-600" />
                ) : (
                  <AvatarBadge className="bg-red-500 dark:bg-red-600" />
                )}
              </Avatar>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="right"
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={
                      user?.image ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                    }
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-base font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    @{user.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <div className="ml-auto">
                  <Button
                    variant={'destructive'}
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </nav>
  );
}
