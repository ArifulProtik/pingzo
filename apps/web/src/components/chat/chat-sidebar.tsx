import { IconSearch } from '@tabler/icons-react';
import { useMatchRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { mockConversations, mockOnlineFriends } from '@/data/mock-chats';
import { ConversationItem } from './conversation-item';
import { OnlineFriends } from './online-friends';

export function ChatSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const matchRoute = useMatchRoute();

  // Filter conversations by search query (case-insensitive)
  const filteredConversations = mockConversations.filter((conversation) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const matchesUsername = conversation.user.name
      .toLowerCase()
      .includes(query);
    const matchesMessage = conversation.lastMessage
      .toLowerCase()
      .includes(query);

    return matchesUsername || matchesMessage;
  });

  // Sort conversations by timestamp in descending order (most recent first)
  const sortedConversations = [...filteredConversations].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );

  return (
    <aside className="flex flex-col h-full border-r border-border bg-card">
      {/* Search input */}
      <div className="p-4">
        <div className="relative">
          <IconSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
            stroke={1.5}
          />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Online Friends section */}
      <div className="px-4 pb-2">
        <h2 className="text-sm font-medium mb-2">Online Friends</h2>
        <OnlineFriends friends={mockOnlineFriends} />
      </div>

      <Separator />

      {/* Message Requests section */}
      <div className="px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors cursor-pointer">
        <span className="text-sm font-medium">Message Requests</span>
        <Badge
          variant="secondary"
          className="h-5 min-w-5 px-1.5"
        >
          2
        </Badge>
      </div>

      <Separator />

      {/* Conversations list */}
      <ScrollArea className="flex-1">
        {sortedConversations.length === 0 && searchQuery && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No conversations found
          </div>
        )}
        {sortedConversations.map((conversation) => {
          // Check if this conversation is active based on current route
          const isActive = Boolean(
            matchRoute({
              to: '/chat/$username',
              params: { username: conversation.user.username },
            }),
          );

          return (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={isActive}
            />
          );
        })}
      </ScrollArea>
    </aside>
  );
}
