import { IconCheck } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ConversationParticipant, Message } from '@/types/chat';
import { formatMessageTime } from '@/utils/format-timestamp';

interface MessageItemProps {
  message: Message;
  isSent: boolean;
  showAvatar: boolean;
  user?: ConversationParticipant;
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
                src={user.image || undefined}
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
            {formatMessageTime(new Date(message.createdAt))}
          </span>
          {/* Read receipts are handled at the conversation level now, we could pass a isRead prop based on lastReadMessageId */}
          {isSent && (
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
