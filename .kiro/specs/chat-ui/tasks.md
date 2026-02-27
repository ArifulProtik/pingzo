# Implementation Plan: Chat UI Feature

## Overview

This plan implements a complete messaging interface for PingZo with a three-column desktop layout: Global Sidebar (60px), Chat Sidebar (300px), and Main Chat View (flexible). The implementation uses mock data and focuses on UI presentation without real-time communication or API integration.

## Tasks

- [x] 1. Set up foundation and dependencies
  - Create type definitions in `apps/web/src/types/chat.ts` for User, Message, and Conversation interfaces
  - Add Avatar component using shadcn CLI: `bunx shadcn@latest add avatar`
  - Add ScrollArea component using shadcn CLI: `bunx shadcn@latest add scroll-area`
  - Create utility functions in `apps/web/src/utils/format-timestamp.ts` for timestamp formatting
  - _Requirements: 11.1, 11.2, 11.3, 12.7, 12.8_

- [x] 2. Create mock data structure
  - Create `apps/web/src/data/mock-chats.ts` with sample users, conversations, and messages
  - Implement at least 5 sample users with varied online statuses
  - Implement at least 5 conversations with varying unread counts
  - Implement at least 20 messages distributed across conversations with multi-day timestamps
  - Implement helper function `getConversationByUsername(username: string)`
  - _Requirements: 11.4, 11.5, 11.6, 11.7, 11.8, 11.9_

- [x] 3. Set up routing structure
  - Create route layout at `apps/web/src/routes/_main/chat/route.tsx` with three-column layout
  - Create empty state route at `apps/web/src/routes/_main/chat/index.tsx`
  - Create conversation route at `apps/web/src/routes/_main/chat/$username.tsx`
  - Implement auth guard in layout route
  - _Requirements: 9.1, 9.2, 9.4, 9.5, 9.6_

- [ ] 4. Implement GlobalSidebar component
  - [x] 4.1 Create `apps/web/src/components/chat/global-sidebar.tsx`
    - Implement 60px fixed width sidebar with icon navigation
    - Add home, friends, messages, and settings icons using @tabler/icons-react
    - Implement active state detection using TanStack Router's useMatchRoute
    - Add hover states using theme colors
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 10.1_

  - [x] 4.2 Write property test for GlobalSidebar
    - **Property 24: Active Route Indicator**
    - **Validates: Requirements 1.7**

- [x] 5. Implement EmptyState component
  - Create `apps/web/src/components/chat/empty-state.tsx` with centered welcome message
  - Use message icon and muted foreground colors
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 10.9_

- [ ] 6. Implement OnlineFriends component
  - [x] 6.1 Create `apps/web/src/components/chat/online-friends.tsx`
    - Implement horizontal scrollable friend list with avatars
    - Add online status indicator (green dot) positioned on avatar
    - Implement click navigation to `/chat/:username`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 10.3_

  - [x] 6.2 Write property test for OnlineFriends
    - **Property 17: Online Friend Navigation**
    - **Validates: Requirements 3.4**

  - [x] 6.3 Write property test for OnlineFriends display
    - **Property 18: Online Friend Display Completeness**
    - **Validates: Requirements 3.2, 3.3**

- [ ] 7. Implement ConversationItem component
  - [x] 7.1 Create `apps/web/src/components/chat/conversation-item.tsx`
    - Display avatar with online indicator
    - Display user name, truncated last message preview, and formatted timestamp
    - Show unread indicator (green dot) and unread count badge when unreadCount > 0
    - Implement active state styling based on isActive prop
    - Add click handler to navigate to conversation
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 10.4_

  - [x] 7.2 Write property test for ConversationItem completeness
    - **Property 2: Conversation Item Completeness**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

  - [x] 7.3 Write property test for unread indicator
    - **Property 3: Unread Indicator Display**
    - **Validates: Requirements 4.5, 4.6**

  - [x] 7.4 Write property test for conversation navigation
    - **Property 4: Conversation Navigation**
    - **Validates: Requirements 4.7**

  - [x] 7.5 Write property test for active state
    - **Property 5: Active Conversation Highlighting**
    - **Validates: Requirements 4.8**

- [ ] 8. Implement ChatSidebar component
  - [x] 8.1 Create `apps/web/src/components/chat/chat-sidebar.tsx`
    - Implement 300px fixed width sidebar
    - Add search input at top using shadcn Input component
    - Display OnlineFriends component below search
    - Display "Message Requests" section with badge count
    - Display scrollable conversation list using ScrollArea
    - Implement search filtering by username and last message content (case-insensitive)
    - Sort conversations by timestamp in descending order
    - Pass isActive prop to ConversationItem based on current route
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 10.2_

  - [x] 8.2 Write property test for search filtering
    - **Property 1: Search Filter Correctness**
    - **Validates: Requirements 2.7**

  - [x] 8.3 Write property test for conversation ordering
    - **Property 6: Conversation Ordering**
    - **Validates: Requirements 4.9**

- [x] 9. Checkpoint - Ensure layout and navigation work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement ChatHeader component
  - [x] 10.1 Create `apps/web/src/components/chat/chat-header.tsx`
    - Display user avatar with online status indicator
    - Display user name and online/offline status text
    - Add call, video call, and info action buttons with icons
    - Implement hover states for action buttons
    - Add border bottom separator
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 10.5_

  - [x] 10.2 Write property test for ChatHeader user information
    - **Property 19: Chat Header User Information**
    - **Validates: Requirements 6.2, 6.3, 6.4**

  - [x] 10.3 Write unit tests for ChatHeader action buttons
    - Test hover states and click handlers
    - Test aria-label attributes for accessibility
    - _Requirements: 6.5, 6.6, 6.7, 6.8_

- [ ] 11. Implement MessageItem component
  - [x] 11.1 Create `apps/web/src/components/chat/message-item.tsx`
    - Implement message bubble with rounded styling
    - Align right for sent messages (isSent prop), left for received
    - Display avatar for received messages when showAvatar is true
    - Display message content and timestamp
    - Show read receipt checkmarks for sent messages when isRead is true
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.7, 7.9, 10.7_

  - [x] 11.2 Write property test for sent message alignment
    - **Property 8: Sent Message Alignment**
    - **Validates: Requirements 7.3**

  - [x] 11.3 Write property test for received message alignment
    - **Property 9: Received Message Alignment**
    - **Validates: Requirements 7.4**

  - [x] 11.4 Write property test for message content display
    - **Property 10: Message Content Display**
    - **Validates: Requirements 7.5, 7.6**

  - [x] 11.5 Write property test for read receipts
    - **Property 11: Read Receipt Display**
    - **Validates: Requirements 7.7**

- [ ] 12. Implement MessageList component
  - [x] 12.1 Create `apps/web/src/components/chat/message-list.tsx`
    - Display messages in chronological order (oldest to newest)
    - Implement ScrollArea for scrollable message list
    - Insert date separator labels when messages span multiple days
    - Implement auto-scroll to bottom on mount using useEffect and scrollRef
    - Pass isSent prop to MessageItem based on senderId comparison
    - Group messages by sender to show avatar only on first message in group
    - _Requirements: 7.1, 7.2, 7.8, 7.10, 10.6_

  - [x] 12.2 Write property test for message ordering
    - **Property 7: Message Chronological Ordering**
    - **Validates: Requirements 7.2**

  - [x] 12.3 Write property test for date separators
    - **Property 12: Date Separator Insertion**
    - **Validates: Requirements 7.8**

  - [x] 12.4 Write unit tests for MessageList
    - Test auto-scroll behavior on mount
    - Test message grouping logic
    - _Requirements: 7.10_

- [ ] 13. Implement MessageInput component
  - [x] 13.1 Create `apps/web/src/components/chat/message-input.tsx`
    - Implement textarea using shadcn Textarea component
    - Add attachment, emoji, and send action buttons
    - Implement auto-expanding textarea for multiple lines
    - Disable send button when textarea is empty or whitespace-only
    - Implement Enter key to send (without Shift)
    - Implement Shift+Enter to insert line break
    - Call onSendMessage prop with message content
    - Clear textarea after sending
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.10, 8.11, 8.12, 10.8_

  - [x] 13.2 Write property test for message send and clear
    - **Property 13: Message Send and Clear**
    - **Validates: Requirements 8.7, 8.8, 8.9**

  - [x] 13.3 Write property test for Enter key send
    - **Property 14: Enter Key Send**
    - **Validates: Requirements 8.10**

  - [x] 13.4 Write property test for Shift+Enter line break
    - **Property 15: Shift+Enter Line Break**
    - **Validates: Requirements 8.11**

- [ ] 14. Wire conversation view together
  - [x] 14.1 Implement $username route component
    - Get username from route params using TanStack Router
    - Fetch conversation using getConversationByUsername helper
    - Display error message for invalid username
    - Render ChatHeader with conversation user
    - Render MessageList with conversation messages and current user ID
    - Render MessageInput with onSendMessage handler
    - Implement onSendMessage to add message to conversation's mock data
    - Update conversation's lastMessage and timestamp when message sent
    - _Requirements: 8.7, 8.8, 8.9, 9.2, 9.3_

  - [x] 14.2 Write property test for invalid username error
    - **Property 16: Invalid Username Error**
    - **Validates: Requirements 9.3**

  - [x] 14.3 Write unit tests for conversation view
    - Test message sending flow end-to-end
    - Test conversation data updates
    - _Requirements: 8.7, 8.8, 8.9_

- [x] 15. Checkpoint - Ensure messaging functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Add accessibility attributes
  - [x] 16.1 Add aria-label to all icon-only buttons
    - Global sidebar navigation icons
    - Chat header action buttons (call, video, info)
    - Message input action buttons (attach, emoji, send)
    - _Requirements: 14.4_

  - [x] 16.2 Add alt text to all avatar images
    - Use user name as alt text
    - _Requirements: 14.7_

  - [x] 16.3 Add aria-live region for new messages
    - Implement in MessageList component
    - _Requirements: 14.5_

  - [x] 16.4 Ensure keyboard navigation works
    - Test Tab/Shift+Tab focus order
    - Test Enter key on conversation items
    - Verify focus visibility with theme ring colors
    - _Requirements: 14.1, 14.2, 14.3, 14.6_

  - [x] 16.5 Write property test for keyboard navigation order
    - **Property 20: Keyboard Navigation Order**
    - **Validates: Requirements 14.1, 14.2**

  - [x] 16.6 Write property test for conversation Enter key navigation
    - **Property 21: Conversation Enter Key Navigation**
    - **Validates: Requirements 14.3**

  - [x] 16.7 Write property test for icon button accessibility
    - **Property 22: Icon Button Accessibility**
    - **Validates: Requirements 14.4**

  - [x] 16.8 Write property test for avatar alt text
    - **Property 23: Avatar Alt Text**
    - **Validates: Requirements 14.7**

- [x] 17. Code style compliance and linting
  - Run `bun run lint:fix` to fix any linting issues
  - Verify 2 spaces indentation, single quotes, and multiline JSX attributes
  - Ensure imports with more than 2 items are split into multiple lines
  - Verify camelCase for utilities, PascalCase for components/types, SCREAMING_SNAKE_CASE for constants
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8_

- [ ] 18. Final testing and polish
  - [x] 18.1 Run all property-based tests
    - Verify all 24 correctness properties pass
    - Ensure minimum 100 iterations per property test

  - [x] 18.2 Run all unit tests
    - Verify component rendering tests pass
    - Verify interaction tests pass
    - Verify mock data structure tests pass

  - [x] 18.3 Manual testing checklist
    - Test search filtering with various queries
    - Test conversation navigation and active states
    - Test message sending and display
    - Test keyboard navigation (Tab, Enter, Shift+Enter)
    - Test empty state display at /chat
    - Test error handling for invalid username
    - Verify all hover states work correctly
    - Verify timestamps format correctly
    - Verify unread indicators display correctly

  - [x] 18.4 Fix any bugs discovered during testing
    - Address any failing tests
    - Fix any visual inconsistencies
    - Resolve any accessibility issues

- [x] 19. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties using @fast-check/vitest
- Unit tests validate specific examples, edge cases, and component interactions
- The implementation follows the 6-phase plan from the design document
- All components use theme colors from styles.css (no custom colors)
- All components follow project code style: 2 spaces, single quotes, multiline JSX
