import {
  IconChartBubbleFilled,
  IconMessage,
  IconUsers,
} from '@tabler/icons-react';
import { Link, useMatchRoute, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export function GlobalSidebar() {
  const matchRoute = useMatchRoute();

  // Check if current route matches /chat or /chat/:username
  const isChatActive =
    matchRoute({ to: '/chat' }) || matchRoute({ to: '/chat/$username' });

  const user = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const res = await authClient.signOut();
    if (res.error) {
      toast.error(res.error.message);
    }
    if (res.data?.success) {
      router.invalidate();
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

        <button
          type="button"
          className="p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          aria-label="Friends"
        >
          <IconUsers
            size={24}
            stroke={1.5}
          />
        </button>
      </div>

      {/* Settings icon aligned to bottom */}
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
              <AvatarFallback>U</AvatarFallback>
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
    </nav>
  );
}
