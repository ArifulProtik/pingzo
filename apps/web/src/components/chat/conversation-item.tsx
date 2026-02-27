import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types/chat';
import { formatTimestamp } from '@/utils/format-timestamp';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

export function ConversationItem({
  conversation,
  isActive,
}: ConversationItemProps) {
  const { user, lastMessage, timestamp, unreadCount } = conversation;

  return (
    <Link
      to="/chat/$username"
      params={{ username: user.username }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors',
        isActive && 'bg-accent',
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
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

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-medium text-sm truncate">{user.name}</h3>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatTimestamp(timestamp)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
      </div>

      {unreadCount > 0 && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="h-2 w-2 bg-chart-1 rounded-full"
            role="status"
            aria-label="Unread messages"
          />
          <Badge
            variant="default"
            className="h-5 min-w-5 px-1.5"
          >
            {unreadCount}
          </Badge>
        </div>
      )}
    </Link>
  );
}
