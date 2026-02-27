import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageInput } from '@/components/chat/message-input';
import { MessageList } from '@/components/chat/message-list';
import { UserInfoSidebar } from '@/components/chat/user-info-sidebar';
import { CURRENT_USER_ID, getConversationByUsername } from '@/data/mock-chats';
import type { Message } from '@/types/chat';

export const Route = createFileRoute('/_main/chat/_chatindex/$username')({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  const conversation = getConversationByUsername(username);

  // Local state to manage messages for this conversation
  const [messages, setMessages] = useState(conversation?.messages || []);
  const [showUserInfo, setShowUserInfo] = useState(false);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">Conversation not found</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      content,
      timestamp: new Date(),
      isRead: false,
    };

    // Add message to local state
    setMessages((prev) => [...prev, newMessage]);

    // Update conversation's mock data
    conversation.messages.push(newMessage);
    conversation.lastMessage = content;
    conversation.timestamp = newMessage.timestamp;
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1">
        <ChatHeader
          user={conversation.user}
          onToggleInfo={() => setShowUserInfo(!showUserInfo)}
        />
        <MessageList
          messages={messages}
          currentUserId={CURRENT_USER_ID}
          otherUser={conversation.user}
        />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
      {showUserInfo && (
        <UserInfoSidebar
          user={conversation.user}
          onClose={() => setShowUserInfo(false)}
        />
      )}
    </div>
  );
}
