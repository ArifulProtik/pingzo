import { IconSearch } from '@tabler/icons-react';
import { useMatchRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { QUERY_KEYS } from '@/data/query-keys';
import { client } from '@/lib/api';
import { ConversationItem } from './conversation-item';
import { OnlineFriends } from './online-friends';
import { useFriendStore } from '@/hooks/use-friend-store';

export function ChatSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const matchRoute = useMatchRoute();
  
  const onlineFriendIds = useFriendStore((state) => state.onlineFriendIDS);

  // Fetch all user conversations
  const { data: conversationsData } = useQuery({
    queryKey: QUERY_KEYS.CONVERSATIONS(),
    queryFn: async () => {
      const res = await client.api.chat.conversations.get();
      if (res.error) throw new Error(res.error.value as string);
      return res.data.data;
    },
  });

  const conversations = conversationsData || [];

  // Filter conversations by search query (case-insensitive)
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    
    // Using participants for search (assuming 1:1 for now)
    const otherUser = conversation.participants[0];
    if (!otherUser) return false;

    const matchesUsername = otherUser.name.toLowerCase().includes(query) || 
                           (otherUser.username?.toLowerCase() || '').includes(query);
                           
    const matchesMessage = conversation.lastMessage?.content
      ?.toLowerCase()
      .includes(query) || false;

    return matchesUsername || matchesMessage;
  });

  // Since backend already sorts by timestamp, we don't strictly need to sort,
  // but let's ensure it's sorted here just in case filtering altered something.
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    const timeA = new Date(a.lastMessage?.createdAt || a.createdAt).getTime();
    const timeB = new Date(b.lastMessage?.createdAt || b.createdAt).getTime();
    return timeB - timeA;
  });

  // Extract online friends from the conversations (for simple sidebar display)
  // In a real app we might fetch the full friend list to show all online friends,
  // but here we just take the participants we know about
  const onlineFriends = conversations
    .flatMap(c => c.participants)
    .filter(p => onlineFriendIds.has(p.id))
    // Deduplicate by id
    .filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

  return (
    <aside className="flex flex-col h-full border-r border-border bg-card">
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

      <div className="px-4 pb-2">
        <h2 className="text-sm font-medium mb-2">Online Friends</h2>
        <OnlineFriends friends={onlineFriends as any} />
      </div>

      <Separator />

      <span className="text-base font-medium px-4 py-2">Conversations</span>
      <ScrollArea className="flex-1">
        {sortedConversations.length === 0 && searchQuery && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No conversations found
          </div>
        )}
        {sortedConversations.map((conversation) => {
          const otherUser = conversation.participants[0];
          
          const isActive = Boolean(
            matchRoute({
              to: '/chat/$username',
              params: { username: otherUser?.username || '' },
            }),
          );

          return (
            <ConversationItem
              key={conversation.id}
              conversation={conversation as any}
              isActive={isActive}
            />
          );
        })}
      </ScrollArea>
    </aside>
  );
}
