# Design Document: Chat UI Feature

## Overview

The Chat UI feature implements a complete messaging interface for the PingZo web application using a three-column desktop layout. The implementation focuses exclusively on UI presentation with mock data, without real-time communication or API integration.

The interface consists of:
- **Global Sidebar** (60px): Icon-based navigation for the entire application
- **Chat Sidebar** (280-320px): Search, online friends, and conversation list
- **Main Chat View** (flexible): Empty state or active conversation display

This design prioritizes component modularity, accessibility, and adherence to existing project patterns while establishing a foundation for future responsive enhancements and backend integration.

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser Window                       │
├──────┬──────────────┬────────────────────────────────────────┤
│      │              │                                        │
│  G   │     Chat     │         Main Chat View                │
│  l   │   Sidebar    │                                        │
│  o   │              │   ┌─────────────────────────────┐     │
│  b   │  [Search]    │   │     Chat Header             │     │
│  a   │              │   ├─────────────────────────────┤     │
│  l   │  Online      │   │                             │     │
│      │  Friends     │   │     Message List            │     │
│  S   │  ─────────   │   │     (scrollable)            │     │
│  i   │              │   │                             │     │
│  d   │  Message     │   │                             │     │
│  e   │  Requests    │   ├─────────────────────────────┤     │
│  b   │  ─────────   │   │     Message Input           │     │
│  a   │              │   └─────────────────────────────┘     │
│  r   │  Conversation│                                        │
│      │  List        │   OR                                   │
│      │  (scrollable)│                                        │
│      │              │   ┌─────────────────────────────┐     │
│      │              │   │                             │     │
│      │              │   │      Empty State            │     │
│      │              │   │                             │     │
│      │              │   └─────────────────────────────┘     │
└──────┴──────────────┴────────────────────────────────────────┘
```

### Layout Implementation

The three-column layout uses CSS Flexbox:

```tsx
<div className="flex h-screen">
  <GlobalSidebar />           {/* Fixed 60px width */}
  <ChatSidebar />             {/* Fixed 280-320px width */}
  <main className="flex-1">  {/* Flexible remaining space */}
    <Outlet />                {/* Route content */}
  </main>
</div>
```

### Routing Architecture

TanStack Router file-based routing structure:

```
routes/
├── __root.tsx                    # Root layout with providers
├── _main/                        # Main layout group
│   └── chat/
│       ├── route.tsx             # Layout with sidebars + auth guard
│       ├── index.tsx             # /chat - Empty state
│       └── $username.tsx         # /chat/:username - Conversation view
```

Route hierarchy:
- `__root` → Provides query client and user context
- `_main/chat` → Auth guard + three-column layout
- `_main/chat/index` → Empty state component
- `_main/chat/$username` → Active conversation component

## Components and Interfaces

### Component Hierarchy

```
ChatLayout (route.tsx)
├── GlobalSidebar
│   └── Navigation icons (Home, Friends, Messages, Settings)
├── ChatSidebar
│   ├── Search input
│   ├── OnlineFriends
│   │   └── Avatar + online indicator (repeated)
│   ├── Message Requests section
│   └── Conversation list
│       └── ConversationItem (repeated)
│           ├── Avatar
│           ├── User info (name, last message)
│           ├── Timestamp
│           └── Unread indicator
└── Main Content (Outlet)
    ├── EmptyState (at /chat)
    └── Active Chat (at /chat/:username)
        ├── ChatHeader
        │   ├── Avatar + user info
        │   └── Action buttons (call, video, info)
        ├── MessageList
        │   └── MessageItem (repeated)
        │       ├── Message bubble
        │       ├── Timestamp
        │       └── Read receipts (for sent messages)
        └── MessageInput
            ├── Textarea
            └── Action buttons (attach, emoji, send)
```

### Component Specifications

#### 1. GlobalSidebar Component

**File:** `apps/web/src/components/chat/global-sidebar.tsx`

**Purpose:** Provides persistent application-wide navigation

**Props:** None

**State:** None (uses TanStack Router's `useMatchRoute` for active state)

**Key Features:**
- Fixed 60px width
- Icon-only navigation
- Active state highlighting for current route
- Hover states using theme colors

**Interface:**
```typescript
// No props interface needed
```

**Behavior:**
- Displays 4 navigation icons vertically
- Settings icon aligned to bottom using `justify-between`
- Active state when route matches `/chat` or `/chat/:username`
- Uses `@tabler/icons-react` for all icons
- Navigates using TanStack Router's `Link` component

#### 2. ChatSidebar Component

**File:** `apps/web/src/components/chat/chat-sidebar.tsx`

**Purpose:** Displays search, online friends, and conversation list

**Props:** None (fetches data from mock-chats.ts)

**State:**
- `searchQuery: string` - Filter text for conversations

**Key Features:**
- Fixed 280-320px width (use 300px)
- Scrollable conversation list
- Real-time search filtering
- Displays online friends and message requests

**Interface:**
```typescript
// No props interface needed
// Internal state only
```

**Behavior:**
- Filters conversations by username or last message content
- Case-insensitive search
- Maintains scroll position during filtering
- Uses `ScrollArea` component for conversation list

#### 3. OnlineFriends Component

**File:** `apps/web/src/components/chat/online-friends.tsx`

**Purpose:** Displays horizontally scrollable list of online friends

**Props:**
```typescript
interface OnlineFriendsProps {
  friends: User[]
}
```

**State:** None

**Key Features:**
- Horizontal scroll with hidden scrollbar
- Avatar with online indicator (green dot)
- Click to navigate to conversation

**Behavior:**
- Renders avatars in horizontal flex container
- Online indicator positioned absolutely on avatar
- Navigates to `/chat/:username` on click

#### 4. ConversationItem Component

**File:** `apps/web/src/components/chat/conversation-item.tsx`

**Purpose:** Displays a single conversation in the list

**Props:**
```typescript
interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
}
```

**State:** None

**Key Features:**
- Avatar with online indicator
- User name and last message preview
- Timestamp and unread count
- Active state styling
- Truncated text with ellipsis

**Behavior:**
- Highlights when `isActive` is true
- Shows green dot for unread messages
- Displays unread count badge
- Truncates last message to single line
- Formats timestamp (e.g., "2m ago", "Yesterday")

#### 5. EmptyState Component

**File:** `apps/web/src/components/chat/empty-state.tsx`

**Purpose:** Displays welcome message when no conversation is selected

**Props:** None

**State:** None

**Key Features:**
- Centered content
- Icon and welcome text
- Theme-colored styling

**Interface:**
```typescript
// No props interface needed
```

**Behavior:**
- Displays centered message icon
- Shows "Select a conversation to start messaging"
- Uses muted foreground color

#### 6. ChatHeader Component

**File:** `apps/web/src/components/chat/chat-header.tsx`

**Purpose:** Displays conversation user info and action buttons

**Props:**
```typescript
interface ChatHeaderProps {
  user: User
}
```

**State:** None

**Key Features:**
- Avatar with online status
- User name and status text
- Action buttons (call, video, info)
- Border bottom separator

**Behavior:**
- Shows "Online" or "Offline" status
- Action buttons show hover states
- Uses icon buttons from shadcn

#### 7. MessageList Component

**File:** `apps/web/src/components/chat/message-list.tsx`

**Purpose:** Displays scrollable list of messages with date separators

**Props:**
```typescript
interface MessageListProps {
  messages: Message[]
  currentUserId: string
  otherUser: User
}
```

**State:**
- `scrollRef: RefObject<HTMLDivElement>` - For auto-scroll

**Key Features:**
- Auto-scroll to bottom on load
- Date separators for multi-day conversations
- Grouped messages by sender
- Read receipts for sent messages

**Behavior:**
- Scrolls to bottom using `useEffect` on mount
- Inserts date labels when day changes
- Passes `isSent` prop to MessageItem
- Uses `ScrollArea` component

#### 8. MessageItem Component

**File:** `apps/web/src/components/chat/message-item.tsx`

**Purpose:** Displays a single message bubble

**Props:**
```typescript
interface MessageItemProps {
  message: Message
  isSent: boolean
  showAvatar: boolean
  user?: User
}
```

**State:** None

**Key Features:**
- Left/right alignment based on sender
- Avatar for received messages
- Timestamp on hover
- Read receipts (checkmarks) for sent messages
- Rounded bubble styling

**Behavior:**
- Aligns right if `isSent` is true
- Shows avatar only if `showAvatar` is true (first in group)
- Displays timestamp below bubble
- Shows double checkmark if `isRead` is true

#### 9. MessageInput Component

**File:** `apps/web/src/components/chat/message-input.tsx`

**Purpose:** Provides message composition interface

**Props:**
```typescript
interface MessageInputProps {
  onSendMessage: (content: string) => void
}
```

**State:**
- `message: string` - Current textarea content

**Key Features:**
- Auto-expanding textarea
- Keyboard shortcuts (Enter to send, Shift+Enter for newline)
- Action buttons (attach, emoji, send)
- Disabled send button when empty

**Behavior:**
- Calls `onSendMessage` when send button clicked or Enter pressed
- Clears textarea after sending
- Prevents sending empty/whitespace-only messages
- Expands textarea vertically with content

## Data Models

### Type Definitions

**File:** `apps/web/src/types/chat.ts`

```typescript
export interface User {
  id: string
  username: string
  name: string
  avatar: string
  isOnline: boolean
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  isRead: boolean
}

export interface Conversation {
  id: string
  user: User
  messages: Message[]
  lastMessage: string
  timestamp: Date
  unreadCount: number
}
```

### Mock Data Structure

**File:** `apps/web/src/data/mock-chats.ts`

```typescript
export const CURRENT_USER_ID = 'current-user'

export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'sarah_chen',
    name: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    isOnline: true
  },
  // ... 4 more users
]

export const mockOnlineFriends: User[] = [
  // Subset of mockUsers where isOnline === true
]

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    user: mockUsers[0],
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        content: 'Hey! How are you?',
        timestamp: new Date('2024-01-15T10:30:00'),
        isRead: true
      },
      // ... more messages
    ],
    lastMessage: 'See you tomorrow!',
    timestamp: new Date('2024-01-15T14:22:00'),
    unreadCount: 2
  },
  // ... 4 more conversations
]

// Helper functions
export function getConversationByUsername(username: string): Conversation | undefined
export function getMessagesByConversationId(conversationId: string): Message[]
```

### Data Flow

```
mock-chats.ts
    ↓
ChatSidebar
    ├→ OnlineFriends (mockOnlineFriends)
    └→ ConversationItem[] (mockConversations)
         ↓
    User clicks conversation
         ↓
    Navigate to /chat/:username
         ↓
    $username route component
         ├→ getConversationByUsername(username)
         ├→ ChatHeader (conversation.user)
         ├→ MessageList (conversation.messages)
         └→ MessageInput (onSendMessage handler)
              ↓
         Add message to conversation.messages
              ↓
         Re-render MessageList
```


## State Management

### Zustand Store (Optional)

For this initial implementation, most state can be managed locally within components using React's `useState`. However, if we need to share state across components (e.g., for optimistic updates when sending messages), we can create a Zustand store.

**File:** `apps/web/src/stores/chat-store.ts`

```typescript
import { create } from 'zustand'
import type { Conversation, Message } from '@/types/chat'

interface ChatState {
  conversations: Conversation[]
  addMessage: (conversationId: string, message: Message) => void
  markAsRead: (conversationId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: mockConversations,
  
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message.content,
              timestamp: message.timestamp,
            }
          : conv
      ),
    })),
  
  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      ),
    })),
}))
```

### Component State Summary

| Component | State | Purpose |
|-----------|-------|---------|
| ChatSidebar | `searchQuery: string` | Filter conversations |
| MessageList | `scrollRef: RefObject` | Auto-scroll to bottom |
| MessageInput | `message: string` | Textarea content |
| $username route | `conversation: Conversation \| undefined` | Current conversation data |

## File Structure

```
apps/web/src/
├── components/
│   ├── chat/
│   │   ├── global-sidebar.tsx          # Global navigation (60px)
│   │   ├── chat-sidebar.tsx            # Conversations list (300px)
│   │   ├── online-friends.tsx          # Horizontal friend list
│   │   ├── conversation-item.tsx       # Single conversation row
│   │   ├── empty-state.tsx             # No conversation selected
│   │   ├── chat-header.tsx             # User info + actions
│   │   ├── message-list.tsx            # Scrollable messages
│   │   ├── message-item.tsx            # Single message bubble
│   │   └── message-input.tsx           # Compose + send
│   └── ui/
│       ├── avatar.tsx                  # NEW: Add via shadcn CLI
│       ├── scroll-area.tsx             # NEW: Add via shadcn CLI
│       └── [existing components]
├── data/
│   └── mock-chats.ts                   # Mock users, conversations, messages
├── stores/
│   └── chat-store.ts                   # Optional: Zustand store for shared state
├── types/
│   └── chat.ts                         # User, Message, Conversation types
├── utils/
│   └── format-timestamp.ts             # Format message timestamps
└── routes/
    └── _main/
        └── chat/
            ├── route.tsx               # Layout with sidebars
            ├── index.tsx               # Empty state at /chat
            └── $username.tsx           # Conversation at /chat/:username
```

## Styling Approach

### Theme Colors Usage

All components use CSS variables defined in `styles.css`:

- **Background colors**: `bg-background`, `bg-card`, `bg-muted`, `bg-sidebar`
- **Text colors**: `text-foreground`, `text-muted-foreground`, `text-sidebar-foreground`
- **Border colors**: `border-border`, `border-sidebar-border`
- **Interactive states**: `hover:bg-accent`, `focus:ring-ring`
- **Primary actions**: `bg-primary`, `text-primary-foreground`
- **Online indicators**: `bg-chart-1` (green from theme)

### Shadcn Component Usage

| Component | Usage |
|-----------|-------|
| Button | Icon buttons in header, send button |
| Input | Search input in chat sidebar |
| Textarea | Message composition |
| Avatar | User profile pictures |
| Badge | Unread count, message requests count |
| Card | Conversation items (optional) |
| Separator | Dividers between sections |
| ScrollArea | Conversation list, message list |

### Responsive Considerations

Initial implementation targets desktop (1024px+):
- Three-column layout using flexbox
- Fixed widths for sidebars
- Flexible main content area
- No mobile breakpoints in v1

Future responsive enhancements:
- Hide Global Sidebar on tablet (<1024px)
- Overlay Chat Sidebar on mobile (<768px)
- Full-width main view on small screens

## Utility Functions

### formatTimestamp

**File:** `apps/web/src/utils/format-timestamp.ts`

```typescript
export function formatTimestamp(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function formatDateSeparator(date: Date): string {
  const now = new Date()
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / 86400000
  )

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}
```

### getConversationByUsername

**File:** `apps/web/src/data/mock-chats.ts`

```typescript
export function getConversationByUsername(
  username: string
): Conversation | undefined {
  return mockConversations.find(
    (conv) => conv.user.username === username
  )
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:

**Redundancy Group 1: Conversation Item Display**
- Properties 4.1-4.4 (avatar, name, last message, timestamp) can be combined into a single comprehensive property that validates all required information is present

**Redundancy Group 2: Message Display**
- Properties 7.5-7.6 (content and timestamp) can be combined with 7.3-7.4 (alignment) into properties that validate complete message rendering

**Redundancy Group 3: Component Presence**
- Multiple "SHALL display X" criteria are examples rather than properties and should be tested as unit tests, not property-based tests

**Redundancy Group 4: Online Friend Display**
- Properties 3.2-3.3 (avatar and status indicator) can be combined into a single property

The following properties eliminate redundancy while maintaining comprehensive coverage:

### Property 1: Search Filter Correctness

*For any* search query and list of conversations, all displayed conversations should have either the user's name or last message content containing the search query (case-insensitive).

**Validates: Requirements 2.7**

### Property 2: Conversation Item Completeness

*For any* conversation, the rendered conversation item should contain the user's avatar, name, last message preview, and timestamp.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 3: Unread Indicator Display

*For any* conversation with unreadCount > 0, the rendered conversation item should display both an unread indicator and the unread count.

**Validates: Requirements 4.5, 4.6**

### Property 4: Conversation Navigation

*For any* conversation, clicking on the conversation item should navigate to `/chat/:username` where username matches the conversation user's username.

**Validates: Requirements 4.7**

### Property 5: Active Conversation Highlighting

*For any* conversation whose username matches the current route parameter, that conversation item should be displayed in an active state.

**Validates: Requirements 4.8**

### Property 6: Conversation Ordering

*For any* list of conversations, they should be displayed in descending order by timestamp (most recent first).

**Validates: Requirements 4.9**

### Property 7: Message Chronological Ordering

*For any* list of messages in a conversation, they should be displayed in chronological order from oldest to newest (ascending by timestamp).

**Validates: Requirements 7.2**

### Property 8: Sent Message Alignment

*For any* message where senderId matches the current user ID, the message bubble should be aligned to the right.

**Validates: Requirements 7.3**

### Property 9: Received Message Alignment

*For any* message where senderId does not match the current user ID, the message bubble should be aligned to the left.

**Validates: Requirements 7.4**

### Property 10: Message Content Display

*For any* message, the rendered message item should contain both the message content and a timestamp.

**Validates: Requirements 7.5, 7.6**

### Property 11: Read Receipt Display

*For any* message sent by the current user where isRead is true, the rendered message should display read receipt indicators (checkmarks).

**Validates: Requirements 7.7**

### Property 12: Date Separator Insertion

*For any* list of messages spanning multiple calendar days, date separator labels should be inserted between messages from different days.

**Validates: Requirements 7.8**

### Property 13: Message Send and Clear

*For any* non-empty message content, when the send action is triggered, the message should be added to the conversation and the textarea should be cleared.

**Validates: Requirements 8.7, 8.8, 8.9**

### Property 14: Enter Key Send

*For any* message input state, pressing Enter without Shift should trigger the send action.

**Validates: Requirements 8.10**

### Property 15: Shift+Enter Line Break

*For any* message input state, pressing Shift+Enter should insert a line break without triggering the send action.

**Validates: Requirements 8.11**

### Property 16: Invalid Username Error

*For any* username that does not exist in the mock data, navigating to `/chat/:username` should display an error message.

**Validates: Requirements 9.3**

### Property 17: Online Friend Navigation

*For any* online friend, clicking on their avatar should navigate to `/chat/:username` where username matches that friend's username.

**Validates: Requirements 3.4**

### Property 18: Online Friend Display Completeness

*For any* online friend, the rendered element should contain both an avatar and an online status indicator.

**Validates: Requirements 3.2, 3.3**

### Property 19: Chat Header User Information

*For any* user in a conversation, the chat header should display the user's avatar, name, and online status.

**Validates: Requirements 6.2, 6.3, 6.4**

### Property 20: Keyboard Navigation Order

*For any* interactive element in the chat UI, pressing Tab should move focus to the next element in logical order (top to bottom, left to right).

**Validates: Requirements 14.1, 14.2**

### Property 21: Conversation Enter Key Navigation

*For any* focused conversation item, pressing Enter should navigate to that conversation.

**Validates: Requirements 14.3**

### Property 22: Icon Button Accessibility

*For any* icon-only button in the chat UI, it should have an aria-label attribute.

**Validates: Requirements 14.4**

### Property 23: Avatar Alt Text

*For any* avatar image in the chat UI, it should have alt text describing the user.

**Validates: Requirements 14.7**

### Property 24: Active Route Indicator

*For any* route matching '/chat' or '/chat/:username', the messages icon in the global sidebar should be displayed in an active state.

**Validates: Requirements 1.7**

## Error Handling

### Invalid Username

When a user navigates to `/chat/:username` with a username that doesn't exist:

```typescript
// In $username.tsx route component
const { username } = Route.useParams()
const conversation = getConversationByUsername(username)

if (!conversation) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-muted-foreground">
          Conversation not found
        </p>
      </div>
    </div>
  )
}
```

### Empty Message Prevention

The send button should be disabled when the textarea is empty or contains only whitespace:

```typescript
const trimmedMessage = message.trim()
const canSend = trimmedMessage.length > 0

<Button
  disabled={!canSend}
  onClick={handleSend}
>
  <IconSend />
</Button>
```

### Search with No Results

When search query returns no matching conversations:

```typescript
{filteredConversations.length === 0 && searchQuery && (
  <div className="p-4 text-center text-muted-foreground text-sm">
    No conversations found
  </div>
)}
```

### Network Errors (Future)

While this implementation uses mock data, the architecture should support future error handling:

- Display error boundaries for component failures
- Show retry buttons for failed message sends
- Indicate connection status in the UI
- Queue messages for retry when offline

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests** focus on:
- Specific component rendering (e.g., "GlobalSidebar displays 4 icons")
- Edge cases (e.g., empty conversation list, single message)
- User interactions (e.g., clicking send button)
- Integration between components
- Mock data structure validation

**Property-Based Tests** focus on:
- Universal behaviors across all inputs (e.g., search filtering)
- Ordering and sorting correctness
- Navigation and routing behavior
- Accessibility requirements
- State management consistency

### Property-Based Testing Configuration

**Library:** Use `@fast-check/vitest` for property-based testing in TypeScript

**Installation:**
```bash
cd apps/web
bun add -d @fast-check/vitest
```

**Configuration:**
- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: `Feature: chat-ui, Property {number}: {property_text}`

**Example Property Test:**

```typescript
import { test } from 'vitest'
import { fc, it } from '@fast-check/vitest'

// Feature: chat-ui, Property 1: Search Filter Correctness
it.prop([fc.string(), fc.array(conversationArbitrary)])(
  'filters conversations by search query',
  (searchQuery, conversations) => {
    const filtered = filterConversations(conversations, searchQuery)
    
    for (const conv of filtered) {
      const matchesName = conv.user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesMessage = conv.lastMessage
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      
      expect(matchesName || matchesMessage).toBe(true)
    }
  }
)
```

### Unit Testing Strategy

**Test Files:**
- `global-sidebar.test.tsx` - Icon rendering, active states
- `chat-sidebar.test.tsx` - Search functionality, conversation list
- `online-friends.test.tsx` - Friend display, click navigation
- `conversation-item.test.tsx` - Avatar, unread indicators, timestamps
- `empty-state.test.tsx` - Content rendering
- `chat-header.test.tsx` - User info, action buttons
- `message-list.test.tsx` - Message rendering, date separators
- `message-item.test.tsx` - Bubble alignment, read receipts
- `message-input.test.tsx` - Send functionality, keyboard shortcuts
- `mock-chats.test.ts` - Data structure validation

**Example Unit Test:**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ConversationItem } from './conversation-item'

describe('ConversationItem', () => {
  it('displays unread indicator when unreadCount > 0', () => {
    const conversation = {
      id: '1',
      user: mockUsers[0],
      messages: [],
      lastMessage: 'Hello',
      timestamp: new Date(),
      unreadCount: 3
    }
    
    render(<ConversationItem conversation={conversation} isActive={false} />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument() // unread dot
  })
})
```

### Test Coverage Goals

- **Component Coverage**: 80%+ line coverage for all chat components
- **Property Coverage**: All 24 correctness properties implemented as tests
- **Integration Coverage**: Route navigation, state updates, user interactions
- **Accessibility Coverage**: Keyboard navigation, ARIA attributes, focus management

### Testing Priorities

1. **High Priority** (Must test before deployment):
   - Search filtering (Property 1)
   - Message send and display (Properties 13-15)
   - Navigation (Properties 4, 17, 21)
   - Conversation ordering (Property 6)

2. **Medium Priority** (Should test):
   - Display completeness (Properties 2, 10, 18, 19)
   - Active states (Properties 5, 24)
   - Accessibility (Properties 20, 22, 23)

3. **Low Priority** (Nice to have):
   - Date separators (Property 12)
   - Read receipts (Property 11)
   - Error handling (Property 16)

## Implementation Phases

### Phase 1: Foundation (Days 1-2)

1. Create type definitions (`types/chat.ts`)
2. Create mock data (`data/mock-chats.ts`)
3. Add shadcn components (Avatar, ScrollArea)
4. Create utility functions (`utils/format-timestamp.ts`)
5. Set up route structure (`routes/_main/chat/`)

### Phase 2: Layout & Navigation (Days 3-4)

1. Implement GlobalSidebar component
2. Implement ChatSidebar component (without search)
3. Implement EmptyState component
4. Set up three-column layout in route.tsx
5. Test navigation between routes

### Phase 3: Conversation List (Days 5-6)

1. Implement ConversationItem component
2. Implement OnlineFriends component
3. Add search functionality to ChatSidebar
4. Test conversation filtering and ordering
5. Implement active state highlighting

### Phase 4: Message Display (Days 7-8)

1. Implement ChatHeader component
2. Implement MessageList component
3. Implement MessageItem component
4. Add date separators
5. Implement auto-scroll behavior

### Phase 5: Message Input (Days 9-10)

1. Implement MessageInput component
2. Add send functionality
3. Implement keyboard shortcuts
4. Add optimistic updates (optional Zustand store)
5. Test message flow end-to-end

### Phase 6: Polish & Testing (Days 11-12)

1. Add accessibility attributes
2. Implement error handling
3. Write unit tests for all components
4. Write property-based tests
5. Fix bugs and refine styling

## Future Enhancements

### Backend Integration

- Replace mock data with API calls using TanStack Query
- Implement real-time updates with WebSocket
- Add message persistence
- Implement user authentication integration

### Features

- Message reactions (emoji)
- File attachments
- Voice messages
- Message editing and deletion
- Typing indicators
- Message search
- Conversation archiving
- Group chats

### Responsive Design

- Mobile-optimized layout
- Sidebar overlay on small screens
- Touch gestures for navigation
- Bottom navigation bar

### Accessibility

- Screen reader announcements for new messages
- High contrast mode support
- Keyboard shortcuts documentation
- Focus trap in modals

### Performance

- Virtual scrolling for large message lists
- Image lazy loading
- Message pagination
- Conversation list virtualization



## User Info Sidebar Component

### Component Specification

**File:** `apps/web/src/components/chat/user-info-sidebar.tsx`

**Purpose:** Displays detailed user information and shared media in a toggleable sidebar

**Props:**
```typescript
interface UserInfoSidebarProps {
  user: User
  onClose: () => void
}
```

**State:** None

**Key Features:**
- 320px fixed width sidebar
- Large user avatar with online indicator
- User name and status display
- Call and video call action buttons
- Shared media section with grid layout
- Close button to hide sidebar

**Behavior:**
- Appears on the right side of the conversation view
- Slides in/out when toggled
- Displays user profile information
- Shows placeholder thumbnails for shared media
- Closes when close button is clicked

### Layout Integration

The conversation route layout is updated to support the sidebar:

```tsx
<div className="flex h-full">
  <div className="flex flex-col flex-1">
    <ChatHeader user={user} onToggleInfo={toggleSidebar} />
    <MessageList messages={messages} />
    <MessageInput onSendMessage={handleSend} />
  </div>
  {showUserInfo && (
    <UserInfoSidebar user={user} onClose={closeSidebar} />
  )}
</div>
```

### State Management

The conversation route manages the sidebar visibility:

```typescript
const [showUserInfo, setShowUserInfo] = useState(false)

const toggleSidebar = () => setShowUserInfo(!showUserInfo)
const closeSidebar = () => setShowUserInfo(false)
```

### Styling

- Uses `w-[320px]` for fixed width
- Uses `border-l border-border` for left border
- Uses `bg-card` for background
- Uses flexbox for vertical layout
- Uses grid layout for shared media thumbnails
