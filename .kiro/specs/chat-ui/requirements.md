# Requirements Document

## Introduction

The Chat UI feature provides a complete messaging interface for the PingZo web application. This feature enables users to view conversations, send messages, and manage their chat interactions through a three-column layout consisting of a global navigation sidebar, a chat conversations sidebar, and a main chat view. The implementation uses mock data and focuses exclusively on UI presentation without real-time communication or API integration.

## Glossary

- **Chat_UI**: The complete chat interface system including all visual components and navigation
- **Global_Sidebar**: The leftmost navigation column containing icon-based navigation for the entire application
- **Chat_Sidebar**: The second column displaying search, online friends, and conversation list
- **Main_Chat_View**: The primary content area displaying either an empty state or an active conversation
- **Conversation**: A chat thread between the current user and another user, containing messages and metadata
- **Message**: A single text communication within a conversation, including content, timestamp, and sender information
- **Online_Friend**: A user who is currently active on the platform
- **Message_Request**: A conversation initiated by a non-friend user requiring acceptance
- **Unread_Indicator**: A visual marker showing that a conversation contains unread messages
- **Empty_State**: The default view shown when no conversation is selected
- **Message_Bubble**: The visual container for a single message in the chat view
- **Chat_Header**: The top section of the main chat view displaying user information and action buttons
- **Message_Input**: The text entry area at the bottom of the chat view for composing messages
- **Mock_Data**: Hardcoded sample data used for demonstration purposes without backend integration

## Requirements

### Requirement 1: Global Navigation Sidebar

**User Story:** As a user, I want a persistent global navigation sidebar, so that I can quickly access different sections of the application while using chat features.

#### Acceptance Criteria

1. THE Global_Sidebar SHALL be fixed to the leftmost edge of the viewport
2. THE Global_Sidebar SHALL have a width of 60 pixels
3. THE Global_Sidebar SHALL display a home icon at the top
4. THE Global_Sidebar SHALL display a friends icon below the home icon
5. THE Global_Sidebar SHALL display a messages icon below the friends icon
6. THE Global_Sidebar SHALL display a settings icon aligned to the bottom
7. WHEN the current route matches '/chat' or '/chat/:username', THE Global_Sidebar SHALL display the messages icon in an active state
8. WHEN a user hovers over any icon, THE Global_Sidebar SHALL display a hover state using theme colors
9. THE Global_Sidebar SHALL use icons from the @tabler/icons-react library
10. THE Global_Sidebar SHALL use only theme colors defined in styles.css

### Requirement 2: Chat Conversations Sidebar

**User Story:** As a user, I want to see my recent conversations and online friends, so that I can quickly navigate to active chats.

#### Acceptance Criteria

1. THE Chat_Sidebar SHALL be positioned immediately to the right of the Global_Sidebar
2. THE Chat_Sidebar SHALL have a width between 280 and 320 pixels
3. THE Chat_Sidebar SHALL display a search input at the top
4. THE Chat_Sidebar SHALL display an "Online Friends" section below the search input
5. THE Chat_Sidebar SHALL display a "Message Requests" section with a badge count
6. THE Chat_Sidebar SHALL display a scrollable list of recent conversations
7. WHEN a user types in the search input, THE Chat_Sidebar SHALL filter the displayed conversations based on user name or last message content
8. THE Chat_Sidebar SHALL use only theme colors defined in styles.css
9. THE Chat_Sidebar SHALL remain visible on all '/chat' routes

### Requirement 3: Online Friends Display

**User Story:** As a user, I want to see which of my friends are currently online, so that I can initiate conversations with available contacts.

#### Acceptance Criteria

1. THE Chat_Sidebar SHALL display online friends in a horizontal scrollable section
2. WHEN displaying an online friend, THE Chat_Sidebar SHALL show the user's avatar
3. WHEN displaying an online friend, THE Chat_Sidebar SHALL show an online status indicator
4. WHEN a user clicks on an online friend avatar, THE Chat_UI SHALL navigate to '/chat/:username' for that user
5. THE Chat_Sidebar SHALL display online friends using mock data from the mock-chats.ts file

### Requirement 4: Conversation List Display

**User Story:** As a user, I want to see my recent conversations with preview information, so that I can identify and select the chat I want to view.

#### Acceptance Criteria

1. WHEN displaying a conversation item, THE Chat_Sidebar SHALL show the user's avatar
2. WHEN displaying a conversation item, THE Chat_Sidebar SHALL show the user's name
3. WHEN displaying a conversation item, THE Chat_Sidebar SHALL show a truncated preview of the last message
4. WHEN displaying a conversation item, THE Chat_Sidebar SHALL show the timestamp of the last message
5. WHEN a conversation has unread messages, THE Chat_Sidebar SHALL display an unread indicator as a green dot
6. WHEN a conversation has unread messages, THE Chat_Sidebar SHALL display the unread count
7. WHEN a user clicks on a conversation item, THE Chat_UI SHALL navigate to '/chat/:username' for that conversation
8. WHEN the current route matches a conversation's username, THE Chat_Sidebar SHALL display that conversation item in an active state
9. THE Chat_Sidebar SHALL display conversations in descending order by timestamp

### Requirement 5: Empty State Display

**User Story:** As a user, I want to see a welcoming empty state when no conversation is selected, so that I understand the purpose of the chat interface.

#### Acceptance Criteria

1. WHEN the current route is '/chat', THE Main_Chat_View SHALL display an empty state
2. THE Empty_State SHALL display a welcome message
3. THE Empty_State SHALL be centered in the Main_Chat_View
4. THE Empty_State SHALL use only theme colors defined in styles.css

### Requirement 6: Chat Header Display

**User Story:** As a user, I want to see information about the person I'm chatting with, so that I can confirm I'm in the correct conversation.

#### Acceptance Criteria

1. WHEN the current route is '/chat/:username', THE Main_Chat_View SHALL display a Chat_Header
2. THE Chat_Header SHALL display the conversation user's avatar
3. THE Chat_Header SHALL display the conversation user's name
4. THE Chat_Header SHALL display the conversation user's online status
5. THE Chat_Header SHALL display a call action button
6. THE Chat_Header SHALL display a video call action button
7. THE Chat_Header SHALL display an info action button
8. WHEN a user clicks on an action button, THE Chat_Header SHALL display a hover state
9. THE Chat_Header SHALL use only theme colors defined in styles.css

### Requirement 7: Message List Display

**User Story:** As a user, I want to see the conversation history in chronological order, so that I can follow the flow of the conversation.

#### Acceptance Criteria

1. WHEN the current route is '/chat/:username', THE Main_Chat_View SHALL display a scrollable message list
2. THE Message_List SHALL display messages in chronological order from oldest to newest
3. WHEN a message is sent by the current user, THE Message_List SHALL display the message bubble aligned to the right
4. WHEN a message is sent by the other user, THE Message_List SHALL display the message bubble aligned to the left
5. WHEN displaying a message, THE Message_List SHALL show the message content
6. WHEN displaying a message, THE Message_List SHALL show the message timestamp
7. WHEN displaying a sent message, THE Message_List SHALL show read receipt indicators as checkmarks
8. WHEN messages span multiple days, THE Message_List SHALL display date separator labels
9. THE Message_List SHALL use only theme colors defined in styles.css
10. THE Message_List SHALL automatically scroll to the most recent message when the conversation loads

### Requirement 8: Message Input Interface

**User Story:** As a user, I want to compose and send messages, so that I can communicate with other users.

#### Acceptance Criteria

1. WHEN the current route is '/chat/:username', THE Main_Chat_View SHALL display a Message_Input at the bottom
2. THE Message_Input SHALL contain a textarea for message composition
3. THE Message_Input SHALL display an attachment button
4. THE Message_Input SHALL display an emoji button
5. THE Message_Input SHALL display a send button
6. WHEN a user types in the textarea, THE Message_Input SHALL expand vertically to accommodate multiple lines
7. WHEN a user clicks the send button, THE Chat_UI SHALL add the message to the conversation's mock data
8. WHEN a user clicks the send button, THE Chat_UI SHALL clear the textarea
9. WHEN a user clicks the send button, THE Message_List SHALL display the new message
10. WHEN a user presses Enter without Shift, THE Message_Input SHALL trigger the send action
11. WHEN a user presses Shift+Enter, THE Message_Input SHALL insert a line break
12. THE Message_Input SHALL use only theme colors defined in styles.css

### Requirement 9: Routing Structure

**User Story:** As a user, I want the chat interface to use proper URL routing, so that I can bookmark conversations and use browser navigation.

#### Acceptance Criteria

1. THE Chat_UI SHALL define a route at '/chat' that displays the empty state
2. THE Chat_UI SHALL define a route at '/chat/:username' that displays the conversation for the specified username
3. WHEN a user navigates to '/chat/:username' with an invalid username, THE Chat_UI SHALL display an error message
4. THE Chat_UI SHALL use TanStack Router file-based routing
5. THE Chat_UI SHALL create a layout route that includes both the Global_Sidebar and Chat_Sidebar
6. THE Chat_UI SHALL use the _main route group for layout composition

### Requirement 10: Component Architecture

**User Story:** As a developer, I want components to follow the single responsibility principle, so that the codebase is maintainable and testable.

#### Acceptance Criteria

1. THE Chat_UI SHALL implement a GlobalSidebar component in global-sidebar.tsx
2. THE Chat_UI SHALL implement a ChatSidebar component in chat-sidebar.tsx
3. THE Chat_UI SHALL implement an OnlineFriends component in online-friends.tsx
4. THE Chat_UI SHALL implement a ConversationItem component in conversation-item.tsx
5. THE Chat_UI SHALL implement a ChatHeader component in chat-header.tsx
6. THE Chat_UI SHALL implement a MessageList component in message-list.tsx
7. THE Chat_UI SHALL implement a MessageItem component in message-item.tsx
8. THE Chat_UI SHALL implement a MessageInput component in message-input.tsx
9. THE Chat_UI SHALL implement an EmptyState component in empty-state.tsx
10. THE Chat_UI SHALL place all chat components in the apps/web/src/components/chat/ directory

### Requirement 11: Mock Data Structure

**User Story:** As a developer, I want well-structured mock data, so that the UI can be developed and tested without backend dependencies.

#### Acceptance Criteria

1. THE Chat_UI SHALL define a User type with id, username, name, avatar, and isOnline properties
2. THE Chat_UI SHALL define a Message type with id, senderId, content, timestamp, and isRead properties
3. THE Chat_UI SHALL define a Conversation type with id, user, lastMessage, timestamp, and unreadCount properties
4. THE Chat_UI SHALL create mock data in apps/web/src/data/mock-chats.ts
5. THE Mock_Data SHALL include at least 5 sample users
6. THE Mock_Data SHALL include at least 3 online friends
7. THE Mock_Data SHALL include at least 5 conversations with varying unread counts
8. THE Mock_Data SHALL include at least 20 messages distributed across conversations
9. THE Mock_Data SHALL include messages with timestamps spanning multiple days

### Requirement 12: Shadcn UI Component Integration

**User Story:** As a developer, I want to use Shadcn UI components consistently, so that the interface maintains visual coherence with the rest of the application.

#### Acceptance Criteria

1. THE Chat_UI SHALL use the existing Button component from components/ui/button.tsx
2. THE Chat_UI SHALL use the existing Input component from components/ui/input.tsx
3. THE Chat_UI SHALL use the existing Card component from components/ui/card.tsx
4. THE Chat_UI SHALL use the existing Badge component from components/ui/badge.tsx
5. THE Chat_UI SHALL use the existing Separator component from components/ui/separator.tsx
6. THE Chat_UI SHALL use the existing Textarea component from components/ui/textarea.tsx
7. THE Chat_UI SHALL add the Avatar component using the shadcn CLI
8. THE Chat_UI SHALL add the ScrollArea component using the shadcn CLI
9. THE Chat_UI SHALL NOT customize or modify any shadcn component styles

### Requirement 13: Code Style Compliance

**User Story:** As a developer, I want the code to follow project conventions, so that it integrates seamlessly with the existing codebase.

#### Acceptance Criteria

1. THE Chat_UI SHALL use 2 spaces for indentation in all TypeScript and TSX files
2. THE Chat_UI SHALL use single quotes for string literals
3. THE Chat_UI SHALL place JSX attributes on multiple lines when there are more than one attribute
4. WHEN importing more than 2 items from a module, THE Chat_UI SHALL split imports into multiple lines
5. THE Chat_UI SHALL use camelCase for utility function names
6. THE Chat_UI SHALL use PascalCase for component names and type names
7. THE Chat_UI SHALL use SCREAMING_SNAKE_CASE for constant names
8. THE Chat_UI SHALL pass Biome linting with the apps/web/biome.json configuration

### Requirement 14: Accessibility Requirements

**User Story:** As a user with accessibility needs, I want the chat interface to be keyboard navigable and screen reader friendly, so that I can use the application effectively.

#### Acceptance Criteria

1. WHEN a user presses Tab, THE Chat_UI SHALL move focus to the next interactive element in logical order
2. WHEN a user presses Shift+Tab, THE Chat_UI SHALL move focus to the previous interactive element
3. WHEN a user presses Enter on a focused conversation item, THE Chat_UI SHALL navigate to that conversation
4. THE Chat_UI SHALL provide aria-label attributes for icon-only buttons
5. THE Chat_UI SHALL provide aria-live regions for new messages
6. THE Chat_UI SHALL maintain focus visibility using theme ring colors
7. THE Chat_UI SHALL provide alt text for user avatars

### Requirement 15: Responsive Layout Foundation

**User Story:** As a developer, I want the layout to be structured for future responsive enhancements, so that mobile support can be added later without major refactoring.

#### Acceptance Criteria

1. THE Chat_UI SHALL use flexbox or grid layout for the three-column structure
2. THE Chat_UI SHALL define layout breakpoints using Tailwind CSS classes
3. THE Chat_UI SHALL prioritize desktop viewport sizes (1024px and above) for initial implementation
4. THE Chat_UI SHALL structure components to allow sidebar hiding on smaller viewports in future iterations


### Requirement 16: User Info Sidebar

**User Story:** As a user, I want to view detailed information about the person I'm chatting with, so that I can access their profile, shared media, and additional contact options.

#### Acceptance Criteria

1. WHEN a user clicks the info button in the Chat_Header, THE Chat_UI SHALL display a User_Info_Sidebar on the right side of the conversation view
2. THE User_Info_Sidebar SHALL have a width of 320 pixels
3. THE User_Info_Sidebar SHALL display a close button at the top right
4. WHEN a user clicks the close button, THE User_Info_Sidebar SHALL hide
5. THE User_Info_Sidebar SHALL display the user's large avatar (96px) with online status indicator
6. THE User_Info_Sidebar SHALL display the user's name and online/offline status
7. THE User_Info_Sidebar SHALL display call and video call action buttons
8. THE User_Info_Sidebar SHALL display a "Shared Media" section with placeholder thumbnails
9. THE User_Info_Sidebar SHALL display a "View All" button for shared media
10. THE User_Info_Sidebar SHALL use only theme colors defined in styles.css
11. WHEN the User_Info_Sidebar is open, THE Main_Chat_View SHALL adjust its width to accommodate the sidebar
12. THE User_Info_Sidebar SHALL have a border on the left side to separate it from the main chat view
