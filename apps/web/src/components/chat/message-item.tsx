import { IconCheck, IconChecks } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Message, User } from '@/types/chat';
import { formatMessageTime } from '@/utils/format-timestamp';

interface MessageItemProps {
  message: Message;
  isSent: boolean;
  showAvatar: boolean;
  user?: User;
}

export function MessageItem({
  message,
  isSent,
  showAvatar,
  user,
}: MessageItemProps) {
  return (
    <div
      className={cn(
        'flex gap-2 mb-4',
        isSent ? 'justify-end' : 'justify-start',
      )}
    >
      {!isSent && (
        <div className="flex-shrink-0">
          {showAvatar && user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.avatar}
                alt={user.name}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8" />
          )}
        </div>
      )}

      <div
        className={cn(
          'flex flex-col gap-1 max-w-[70%]',
          isSent ? 'items-end' : 'items-start',
        )}
      >
        <div
          className={cn(
            'px-4 py-2 rounded-2xl',
            isSent
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm',
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        <div className="flex items-center gap-1 px-1">
          <span className="text-xs text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </span>
          {isSent && message.isRead && (
            <IconChecks
              className="h-3 w-3 text-muted-foreground"
              aria-label="Read"
            />
          )}
          {isSent && !message.isRead && (
            <IconCheck
              className="h-3 w-3 text-muted-foreground"
              aria-label="Sent"
            />
          )}
        </div>
      </div>
    </div>
  );
}
