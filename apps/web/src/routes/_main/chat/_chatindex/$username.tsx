import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageInput } from '@/components/chat/message-input';
import { MessageList } from '@/components/chat/message-list';
import { UserInfoSidebar } from '@/components/chat/user-info-sidebar';
import { QUERY_KEYS } from '@/data/query-keys';
import { useUser } from '@/hooks/use-user';
import { client } from '@/lib/api';

export const Route = createFileRoute('/_main/chat/_chatindex/$username')({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  const queryClient = useQueryClient();
  const currentUser = useUser();
  const [showUserInfo, setShowUserInfo] = useState(false);

  // 1. Fetch user by username
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['USER_BY_USERNAME', username],
    queryFn: async () => {
      const res = await client.api.user.username({ username }).get();
      if (res.error) throw new Error(String(res.error.value));
      return res.data.data;
    },
    enabled: !!username,
  });

  const otherUser = userData;

  // 2. Fetch or create direct conversation with this user
  const { data: conversationData, isLoading: isConvLoading } = useQuery({
    queryKey: ['DIRECT_CONVERSATION', otherUser?.id],
    queryFn: async () => {
      if (!otherUser?.id) return null;
      // We use the POST endpoint which finds or creates the 1:1 chat
      const res = await client.api.chat.conversation.direct.post({
        participantId: otherUser.id,
      });
      if (res.error) throw new Error(String(res.error.value));
      return res.data.data;
    },
    enabled: !!otherUser?.id,
  });

  const conversationId = conversationData?.id;

  // 3. Fetch messages for this conversation
  const { data: messagesData, isLoading: isMessagesLoading } = useQuery({
    queryKey: QUERY_KEYS.MESSAGES(conversationId || ''),
    queryFn: async () => {
      if (!conversationId) return { messages: [] };
      const res = await client.api.chat
        .conversation({ id: conversationId })
        .messages.get({
          query: { limit: '50' }, // Could implement infinite scroll later
        });
      if (res.error) throw new Error(String(res.error.value));
      // Reverse to show oldest first at top, newest at bottom
      return { messages: res.data.data.messages.reverse() };
    },
    enabled: !!conversationId,
  });

  const messages = messagesData?.messages || [];

  // 4. Send Message Mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) throw new Error('No conversation ID');
      const res = await client.api.chat
        .conversation({ id: conversationId })
        .messages.post({ content });
      if (res.error) throw new Error(String(res.error.value));
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MESSAGES(conversationId || ''),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS() });
    },
  });

  const handleSendMessage = (content: string) => {
    sendMessageMutation.mutate(content);
  };

  const isLoading = isUserLoading || isConvLoading || isMessagesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  // Fallback to otherUser if conversation doesn't have participants populated properly yet
  const participantUser = conversationData?.participants?.[0] || otherUser;

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1">
        <ChatHeader
          user={participantUser as any}
          onToggleInfo={() => setShowUserInfo(!showUserInfo)}
        />
        <MessageList
          messages={messages as any}
          currentUserId={currentUser?.id || ''}
          otherUser={participantUser as any}
        />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
      {showUserInfo && (
        <UserInfoSidebar
          user={participantUser as any}
          onClose={() => setShowUserInfo(false)}
        />
      )}
    </div>
  );
}
