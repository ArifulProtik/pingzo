export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  messages: Message[];
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}
