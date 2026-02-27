import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message, User } from '@/types/chat';
import { formatDateSeparator } from '@/utils/format-timestamp';
import { MessageItem } from './message-item';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  otherUser: User;
}

export function MessageList({
  messages,
  currentUserId,
  otherUser,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom instantly on mount, smoothly on new messages
  useEffect(() => {
    if (endRef.current) {
      // On first load, scroll instantly without animation
      const isFirstLoad =
        messages.length > 0 && !scrollRef.current?.dataset.initialized;

      if (isFirstLoad && scrollRef.current) {
        scrollRef.current.dataset.initialized = 'true';
        endRef.current.scrollIntoView({ behavior: 'instant' });
      } else {
        // For new messages, scroll smoothly
        endRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  // Group messages by sender and insert date separators
  const renderMessages = () => {
    const elements: React.ReactElement[] = [];
    let lastDate: string | null = null;
    let lastSenderId: string | null = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp);
      const currentDate = messageDate.toDateString();

      // Insert date separator if day changed
      if (lastDate !== currentDate) {
        elements.push(
          <div
            key={`date-${currentDate}`}
            className="flex justify-center my-4"
          >
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {formatDateSeparator(messageDate)}
            </span>
          </div>,
        );
        lastDate = currentDate;
        lastSenderId = null; // Reset sender grouping on new day
      }

      const isSent = message.senderId === currentUserId;
      const showAvatar = message.senderId !== lastSenderId;

      elements.push(
        <MessageItem
          key={message.id}
          message={message}
          isSent={isSent}
          showAvatar={showAvatar}
          user={isSent ? undefined : otherUser}
        />,
      );

      lastSenderId = message.senderId;
    });

    return elements;
  };

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div
          ref={scrollRef}
          className="px-4 py-4"
        >
          {renderMessages()}
          <div ref={endRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
