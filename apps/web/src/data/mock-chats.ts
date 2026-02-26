import type { Conversation, Message, User } from '@/types/chat';

export const CURRENT_USER_ID = 'current-user';

// Sample users with varied online statuses
export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'sarah_chen',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    isOnline: true,
  },
  {
    id: 'user-2',
    username: 'mike_johnson',
    name: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    isOnline: true,
  },
  {
    id: 'user-3',
    username: 'emma_wilson',
    name: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    isOnline: false,
  },
  {
    id: 'user-4',
    username: 'alex_rodriguez',
    name: 'Alex Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    isOnline: true,
  },
  {
    id: 'user-5',
    username: 'lisa_park',
    name: 'Lisa Park',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    isOnline: false,
  },
  {
    id: 'user-6',
    username: 'david_kim',
    name: 'David Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    isOnline: true,
  },
];

// Online friends (subset of users where isOnline === true)
export const mockOnlineFriends: User[] = mockUsers.filter(
  (user) => user.isOnline,
);

// Helper function to create dates relative to now
const daysAgo = (days: number, hours = 0, minutes = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  date.setMinutes(date.getMinutes() - minutes);
  return date;
};

// Sample conversations with varying unread counts and multi-day timestamps
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    user: mockUsers[0], // Sarah Chen (online)
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        content: 'Hey! How are you doing?',
        timestamp: daysAgo(2, 10, 30),
        isRead: true,
      },
      {
        id: 'msg-2',
        senderId: CURRENT_USER_ID,
        content: "I'm doing great! Just finished a big project.",
        timestamp: daysAgo(2, 10, 15),
        isRead: true,
      },
      {
        id: 'msg-3',
        senderId: 'user-1',
        content: 'That sounds awesome! What was it about?',
        timestamp: daysAgo(2, 10, 0),
        isRead: true,
      },
      {
        id: 'msg-4',
        senderId: CURRENT_USER_ID,
        content:
          'A new chat interface for our app. Really happy with how it turned out.',
        timestamp: daysAgo(2, 9, 45),
        isRead: true,
      },
      {
        id: 'msg-5',
        senderId: 'user-1',
        content: "Can't wait to see it! Are you free for lunch tomorrow?",
        timestamp: daysAgo(0, 0, 5),
        isRead: false,
      },
      {
        id: 'msg-6',
        senderId: 'user-1',
        content: 'Let me know!',
        timestamp: daysAgo(0, 0, 2),
        isRead: false,
      },
    ],
    lastMessage: 'Let me know!',
    timestamp: daysAgo(0, 0, 2),
    unreadCount: 2,
  },
  {
    id: 'conv-2',
    user: mockUsers[1], // Mike Johnson (online)
    messages: [
      {
        id: 'msg-7',
        senderId: CURRENT_USER_ID,
        content: 'Did you see the game last night?',
        timestamp: daysAgo(1, 20, 0),
        isRead: true,
      },
      {
        id: 'msg-8',
        senderId: 'user-2',
        content: 'Yes! What an incredible finish!',
        timestamp: daysAgo(1, 19, 45),
        isRead: true,
      },
      {
        id: 'msg-9',
        senderId: 'user-2',
        content: "I couldn't believe that last-second shot",
        timestamp: daysAgo(1, 19, 44),
        isRead: true,
      },
      {
        id: 'msg-10',
        senderId: CURRENT_USER_ID,
        content: 'Same here! Best game of the season',
        timestamp: daysAgo(1, 19, 30),
        isRead: true,
      },
    ],
    lastMessage: 'Same here! Best game of the season',
    timestamp: daysAgo(1, 19, 30),
    unreadCount: 0,
  },
  {
    id: 'conv-3',
    user: mockUsers[2], // Emma Wilson (offline)
    messages: [
      {
        id: 'msg-11',
        senderId: 'user-3',
        content: 'Thanks for your help with the presentation!',
        timestamp: daysAgo(3, 14, 0),
        isRead: true,
      },
      {
        id: 'msg-12',
        senderId: CURRENT_USER_ID,
        content: 'No problem! How did it go?',
        timestamp: daysAgo(3, 13, 45),
        isRead: true,
      },
      {
        id: 'msg-13',
        senderId: 'user-3',
        content: 'Really well! The client loved it',
        timestamp: daysAgo(3, 13, 30),
        isRead: true,
      },
      {
        id: 'msg-14',
        senderId: 'user-3',
        content: 'We should celebrate sometime',
        timestamp: daysAgo(0, 2, 15),
        isRead: false,
      },
    ],
    lastMessage: 'We should celebrate sometime',
    timestamp: daysAgo(0, 2, 15),
    unreadCount: 1,
  },
  {
    id: 'conv-4',
    user: mockUsers[3], // Alex Rodriguez (online)
    messages: [
      {
        id: 'msg-15',
        senderId: CURRENT_USER_ID,
        content: 'Hey Alex, do you have the meeting notes?',
        timestamp: daysAgo(0, 3, 0),
        isRead: true,
      },
      {
        id: 'msg-16',
        senderId: 'user-4',
        content: "Yes, I'll send them over in a few minutes",
        timestamp: daysAgo(0, 2, 55),
        isRead: true,
      },
      {
        id: 'msg-17',
        senderId: 'user-4',
        content: 'Just sent them to your email',
        timestamp: daysAgo(0, 2, 45),
        isRead: true,
      },
    ],
    lastMessage: 'Just sent them to your email',
    timestamp: daysAgo(0, 2, 45),
    unreadCount: 0,
  },
  {
    id: 'conv-5',
    user: mockUsers[4], // Lisa Park (offline)
    messages: [
      {
        id: 'msg-18',
        senderId: 'user-5',
        content: 'Hi! Are you coming to the team event next week?',
        timestamp: daysAgo(4, 16, 0),
        isRead: true,
      },
      {
        id: 'msg-19',
        senderId: CURRENT_USER_ID,
        content: "I'm planning to! What time does it start?",
        timestamp: daysAgo(4, 15, 45),
        isRead: true,
      },
      {
        id: 'msg-20',
        senderId: 'user-5',
        content: '6 PM at the usual place',
        timestamp: daysAgo(4, 15, 30),
        isRead: true,
      },
      {
        id: 'msg-21',
        senderId: 'user-5',
        content: 'Looking forward to seeing you there!',
        timestamp: daysAgo(4, 15, 15),
        isRead: true,
      },
      {
        id: 'msg-22',
        senderId: CURRENT_USER_ID,
        content: 'Me too! Should I bring anything?',
        timestamp: daysAgo(4, 15, 0),
        isRead: true,
      },
      {
        id: 'msg-23',
        senderId: 'user-5',
        content: 'Just yourself! We have everything covered',
        timestamp: daysAgo(4, 14, 45),
        isRead: true,
      },
      {
        id: 'msg-24',
        senderId: CURRENT_USER_ID,
        content: 'Perfect! See you then',
        timestamp: daysAgo(4, 14, 30),
        isRead: true,
      },
      {
        id: 'msg-25',
        senderId: 'user-5',
        content: 'Hey! Quick question about the project',
        timestamp: daysAgo(3, 10, 0),
        isRead: true,
      },
      {
        id: 'msg-26',
        senderId: CURRENT_USER_ID,
        content: 'Sure, what do you need?',
        timestamp: daysAgo(3, 9, 55),
        isRead: true,
      },
      {
        id: 'msg-27',
        senderId: 'user-5',
        content: 'Can you review the design mockups I sent?',
        timestamp: daysAgo(3, 9, 50),
        isRead: true,
      },
      {
        id: 'msg-28',
        senderId: CURRENT_USER_ID,
        content: "I'll take a look this afternoon",
        timestamp: daysAgo(3, 9, 45),
        isRead: true,
      },
      {
        id: 'msg-29',
        senderId: 'user-5',
        content: 'Thanks! No rush',
        timestamp: daysAgo(3, 9, 40),
        isRead: true,
      },
      {
        id: 'msg-30',
        senderId: CURRENT_USER_ID,
        content: 'Just finished reviewing the mockups',
        timestamp: daysAgo(3, 5, 0),
        isRead: true,
      },
      {
        id: 'msg-31',
        senderId: CURRENT_USER_ID,
        content: 'They look great! Just a few minor suggestions',
        timestamp: daysAgo(3, 4, 58),
        isRead: true,
      },
      {
        id: 'msg-32',
        senderId: 'user-5',
        content: 'Awesome! Send them over',
        timestamp: daysAgo(3, 4, 55),
        isRead: true,
      },
      {
        id: 'msg-33',
        senderId: CURRENT_USER_ID,
        content: 'Just emailed you the feedback',
        timestamp: daysAgo(3, 4, 50),
        isRead: true,
      },
      {
        id: 'msg-34',
        senderId: 'user-5',
        content: 'Got it! These are really helpful',
        timestamp: daysAgo(3, 4, 45),
        isRead: true,
      },
      {
        id: 'msg-35',
        senderId: 'user-5',
        content: "I'll make the changes and send an updated version",
        timestamp: daysAgo(3, 4, 40),
        isRead: true,
      },
      {
        id: 'msg-36',
        senderId: CURRENT_USER_ID,
        content: 'Sounds good!',
        timestamp: daysAgo(3, 4, 35),
        isRead: true,
      },
      {
        id: 'msg-37',
        senderId: 'user-5',
        content: 'Updated mockups are ready',
        timestamp: daysAgo(2, 14, 0),
        isRead: true,
      },
      {
        id: 'msg-38',
        senderId: CURRENT_USER_ID,
        content: 'Perfect! Let me check them out',
        timestamp: daysAgo(2, 13, 55),
        isRead: true,
      },
      {
        id: 'msg-39',
        senderId: CURRENT_USER_ID,
        content: 'These look perfect now! Great work',
        timestamp: daysAgo(2, 13, 30),
        isRead: true,
      },
      {
        id: 'msg-40',
        senderId: 'user-5',
        content: 'Thanks! Ready to move forward?',
        timestamp: daysAgo(2, 13, 25),
        isRead: true,
      },
      {
        id: 'msg-41',
        senderId: CURRENT_USER_ID,
        content: "Yes, let's do it!",
        timestamp: daysAgo(2, 13, 20),
        isRead: true,
      },
      {
        id: 'msg-42',
        senderId: 'user-5',
        content: "Great! I'll start on the implementation",
        timestamp: daysAgo(2, 13, 15),
        isRead: true,
      },
      {
        id: 'msg-43',
        senderId: CURRENT_USER_ID,
        content: 'Let me know if you need any help',
        timestamp: daysAgo(2, 13, 10),
        isRead: true,
      },
      {
        id: 'msg-44',
        senderId: 'user-5',
        content: 'Will do! Thanks',
        timestamp: daysAgo(2, 13, 5),
        isRead: true,
      },
      {
        id: 'msg-45',
        senderId: 'user-5',
        content: 'Hey! How are you doing?',
        timestamp: daysAgo(0, 3, 11),
        isRead: true,
      },
      {
        id: 'msg-46',
        senderId: CURRENT_USER_ID,
        content: "I'm doing great! Just finished a big project.",
        timestamp: daysAgo(0, 3, 10),
        isRead: true,
      },
      {
        id: 'msg-47',
        senderId: 'user-5',
        content: 'That sounds awesome! What was it about?',
        timestamp: daysAgo(0, 3, 9),
        isRead: true,
      },
      {
        id: 'msg-48',
        senderId: CURRENT_USER_ID,
        content:
          'A new chat interface for our app. Really happy with how it turned out.',
        timestamp: daysAgo(0, 3, 8),
        isRead: true,
      },
      {
        id: 'msg-49',
        senderId: 'user-5',
        content: "Can't wait to see it! Are you free for lunch tomorrow?",
        timestamp: daysAgo(0, 0, 5),
        isRead: false,
      },
      {
        id: 'msg-50',
        senderId: 'user-5',
        content: 'Let me know!',
        timestamp: daysAgo(0, 0, 2),
        isRead: false,
      },
    ],
    lastMessage: 'Let me know!',
    timestamp: daysAgo(0, 0, 2),
    unreadCount: 3,
  },
];

/**
 * Get a conversation by username
 * @param username - The username to search for
 * @returns The conversation if found, undefined otherwise
 */
export function getConversationByUsername(
  username: string,
): Conversation | undefined {
  return mockConversations.find((conv) => conv.user.username === username);
}
