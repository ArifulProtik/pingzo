import { IconInfoCircle, IconPhone, IconVideo } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { User } from '@/types/chat';

interface ChatHeaderProps {
  user: User;
  onToggleInfo: () => void;
}

export function ChatHeader({ user, onToggleInfo }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.avatar}
              alt={user.name}
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {user.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-chart-1 border-2 border-background rounded-full" />
          )}
        </div>

        <div>
          <h2 className="font-semibold text-sm">{user.name}</h2>
          <p className="text-xs text-muted-foreground">
            {user.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Start voice call"
          className="hover:bg-accent"
        >
          <IconPhone className="h-10 w-10" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Start video call"
          className="hover:bg-accent"
        >
          <IconVideo className="h-10 w-10" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleInfo}
          aria-label="Toggle conversation info"
          className="hover:bg-accent"
        >
          <IconInfoCircle className="h-10 w-10" />
        </Button>
      </div>
    </div>
  );
}
