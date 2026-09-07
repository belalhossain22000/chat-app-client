# Frontend Architecture

## Overview

This project is a real-time chat application built with Next.js,
React, TypeScript, Redux Toolkit, RTK Query, and Socket.IO.

The architecture is designed around three main concerns:

1. Server state management
2. Client/UI state management
3. Real-time communication

The goal is to keep the application modular, predictable, and easy to
maintain while avoiding unnecessary abstractions.

---

# Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework and routing |
| React | UI component architecture |
| TypeScript | Static typing |
| Redux Toolkit | Client-side state management |
| RTK Query | Server state, caching, API requests |
| Socket.IO Client | Real-time communication |
| CSS | Application styling |
| ESLint | Code quality and consistency |

---

# High-Level Architecture

```text
                        ┌─────────────────────┐
                        │      Next.js        │
                        │    React UI Layer   │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ↓                             ↓
             ┌──────────────┐             ┌──────────────┐
             │ RTK Query    │             │ Redux Slice  │
             │ Server State │             │ Client State │
             └──────┬───────┘             └──────┬───────┘
                    │                            │
                    ↓                            ↓
             ┌──────────────┐             ┌──────────────┐
             │ REST API     │             │ Socket.IO    │
             │ /api         │             │ Real-time    │
             └──────┬───────┘             └──────┬───────┘
                    │                            │
                    └────────────┬───────────────┘
                                 ↓
                         ┌───────────────┐
                         │ Chat Backend  │
                         └───────────────┘
```

---

# Application Layers

The application is divided into several logical layers.

```text
Presentation Layer
       ↓
Feature Layer
       ↓
State / Data Layer
       ↓
Communication Layer
       ↓
Backend API
```

Each layer has a specific responsibility.

---

# Presentation Layer

The presentation layer contains reusable UI components and application
layouts.

Location:

```text
src/components/
src/app/
```

Responsibilities include:

* Rendering UI
* Handling user interaction
* Displaying loading states
* Displaying empty states
* Displaying errors
* Responsive layout

Examples:

```text
components/ui/Button.tsx
components/ui/Input.tsx
components/ui/Modal.tsx
components/layout/AppShell.tsx
```

These components should remain mostly independent from API details.

---

# Feature Layer

Feature-specific functionality lives under:

```text
src/features/
```

Current features:

```text
features/
├── auth/
└── chat/
```

Each feature contains its own:

* API layer
* Components
* Hooks
* Types
* State
* Utilities

This keeps related functionality together and makes the codebase easier
to extend.

---

# Authentication Architecture

Authentication is handled by the `auth` feature.

```text
src/features/auth/
├── api/
│   └── auth.api.ts
├── components/
│   └── LoginForm.tsx
├── slice/
│   └── auth.slice.ts
└── types/
    └── auth.types.ts
```

Authentication flow:

```text
Login Form
    ↓
POST /auth/login
    ↓
Receive JWT + User
    ↓
Store authentication state
    ↓
Authenticated Application
```

The JWT is required for protected REST API requests and Socket.IO
authentication.

---

# Server State vs Client State

One of the main architectural decisions is separating server state
from client/UI state.

## Server State

Server-owned data is managed through RTK Query.

Examples:

* Users
* Conversations
* Messages
* Group participants
* Group information

```text
RTK Query
    │
    ├── Users
    ├── Conversations
    └── Messages
```

RTK Query provides:

* Request lifecycle management
* Loading states
* Error states
* Caching
* Cache invalidation
* Request deduplication

---

## Client State

Local application state is managed through Redux Toolkit slices.

Examples:

* Active conversation ID
* Socket connection status
* Unread counts
* Typing state
* UI state
* Temporary chat state

```text
Redux Toolkit
    │
    ├── Active conversation
    ├── Socket status
    ├── Unread counts
    └── UI state
```

This separation prevents server data from being duplicated unnecessarily
inside regular Redux state.

---

# Why RTK Query?

RTK Query was selected because most of the application's data is
server-owned.

Without RTK Query, the application would need to manually manage:

```text
request
loading
success
error
cache
refetch
invalidation
```

RTK Query provides these mechanisms in a consistent way.

It also works naturally with Redux Toolkit, which allows both server
state and client state to exist within the same state architecture
without treating them as the same type of data.

---

# API Layer

The API layer is located under:

```text
src/features/*/api/
```

Global API configuration:

```text
src/lib/api/baseApi.ts
```

Recommended structure:

```text
src/lib/api/
└── baseApi.ts

src/features/chat/api/
├── users.api.ts
├── conversations.api.ts
└── messages.api.ts
```

The base API is responsible for:

* REST base URL
* Authentication headers
* Common request configuration
* Shared API behavior

Feature API files define feature-specific endpoints.

---

# REST API Flow

A typical REST request follows this flow:

```text
React Component
      ↓
RTK Query Hook
      ↓
Feature API Endpoint
      ↓
baseApi
      ↓
REST API
      ↓
Backend
```

Example:

```text
ConversationList
      ↓
useGetConversationsQuery()
      ↓
conversations.api.ts
      ↓
baseApi.ts
      ↓
GET /api/conversations
```

---

# Authentication Header

Protected REST requests require:

```http
Authorization: Bearer <token>
```

The API layer should attach the current authentication token to
protected requests rather than requiring every component to manually
construct the header.

This keeps authentication concerns centralized.

---

# Socket Architecture

Socket.IO is isolated from React components.

Structure:

```text
src/features/chat/
├── socket/
│   ├── socket.client.ts
│   └── socket.events.ts
└── hooks/
    └── useSocket.ts
```

Responsibilities:

### socket.client.ts

Creates the Socket.IO connection.

### socket.events.ts

Defines centralized event names.

### useSocket.ts

Connects socket events to application state and manages lifecycle.

---

# WebSocket Flow

```text
Authenticated User
       ↓
useSocket()
       ↓
socket.client.ts
       ↓
Socket.IO Server
       ↓
Real-time Events
       ↓
Redux / RTK Query
       ↓
React UI
```

---

# Real-Time Message Architecture

Incoming messages are received through:

```text
message:new
```

Flow:

```text
Server
  ↓
message:new
  ↓
Socket Listener
  ↓
Identify conversationId
  ↓
Update relevant state/cache
  ↓
MessageList
  ↓
UI
```

The message ID is treated as the unique identifier to prevent duplicate
messages.

---

# Real-Time Conversation Architecture

Group changes are received through:

```text
conversation:updated
```

Flow:

```text
Group Mutation
      ↓
Backend
      ↓
conversation:updated
      ↓
Socket Listener
      ↓
Update Conversation State
      ↓
Conversation List / Group Info
```

This keeps group information synchronized between connected clients.

---

# Socket and REST Responsibilities

REST and Socket.IO intentionally have separate responsibilities.

## REST

Used for:

```text
Authentication
User search
Conversation retrieval
Conversation creation
Group creation
Group management
Message history
Message sending
```

## Socket.IO

Used for:

```text
Real-time incoming messages
Real-time conversation updates
```

This means the application can reconstruct its important server state
through REST APIs even after a socket reconnects.

---

# Conversation State Flow

When the chat screen loads:

```text
Chat Page
    ↓
GET /conversations
    ↓
Conversation List
```

When a conversation is selected:

```text
Select Conversation
    ↓
GET /conversations/{id}/messages
    ↓
Message List
```

When a new message arrives:

```text
message:new
    ↓
Check conversationId
    ↓
Active conversation?
    │
    ├── Yes
    │    ↓
    │  Add message
    │
    └── No
         ↓
       Update unread state
       Update conversation preview
```

---

# Message Sending Strategy

Messages are persisted through:

```text
POST /messages
```

The Socket.IO layer handles real-time delivery.

The frontend must also protect against duplicate rendering because the
same message may be encountered through both REST and Socket.IO.

Recommended rule:

```text
Message ID = Unique Identity
```

Before inserting an incoming message:

```ts
if (!existingMessageIds.has(message.id)) {
  addMessage(message);
}
```

---

# Message Pagination

Message history uses cursor-based pagination.

API:

```text
GET /conversations/{id}/messages
```

Query parameters:

```text
limit
before
```

Flow:

```text
Open Conversation
      ↓
Load latest messages
      ↓
User scrolls upward
      ↓
Request older messages
      ↓
Prepend older messages
      ↓
Preserve scroll position
```

This approach avoids loading the entire conversation history at once.

---

# Auto-Scroll Strategy

The message list should automatically scroll to the latest message
when the user is already near the bottom.

However, if the user has intentionally scrolled upward, a new incoming
message should not force the viewport to the bottom.

```text
New Message
    ↓
Is user near bottom?
    │
    ├── Yes → Scroll to latest
    │
    └── No → Preserve position
              + show new message indicator
```

This is particularly important for long conversations.

---

# Component Architecture

The main chat UI is composed as follows:

```text
ChatLayout
│
├── ConversationList
│   └── ConversationItem
│
└── ChatWindow
    │
    ├── ChatHeader
    │
    ├── MessageList
    │   └── MessageBubble
    │
    └── MessageInput
```

Additional chat interactions:

```text
UserSearch
NewChatModal
CreateGroupModal
GroupInfoModal
GroupMembers
```

This keeps the main chat screen focused while moving complex
interactions into dedicated components.

---

# Chat Window Responsibilities

`ChatWindow` is responsible for composing the active conversation UI.

It should not contain all business logic.

Its responsibilities are primarily:

* Determine active conversation
* Compose header/message/input sections
* Connect feature hooks
* Display conversation-specific state

Message fetching, socket behavior, and API communication should remain
in dedicated hooks/API layers where appropriate.

---

# MessageList Responsibilities

`MessageList` is responsible for:

* Rendering messages
* Message grouping where appropriate
* Timestamp display
* Loading state
* Empty state
* Pagination trigger
* Scroll behavior

It should not directly contain REST request implementation.

---

# MessageInput Responsibilities

`MessageInput` is responsible for:

* Managing input value
* Validating empty messages
* Submit interaction
* Sending state
* Keyboard interaction

The actual API mutation is handled through the feature API layer.

---

# Group Management Architecture

Group management is isolated into dedicated UI components.

```text
GroupInfoModal
      ↓
GroupMembers
      ↓
Group Actions
      │
      ├── Add Member
      ├── Remove Member
      ├── Leave Group
      ├── Make Admin
      └── Rename Group
```

The UI checks the current user's admin status to determine which
actions should be available.

However, the backend remains the final authority for permissions.

---

# Folder Architecture

```text
src/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── chat/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Spinner.tsx
│   │   └── EmptyState.tsx
│   │
│   └── layout/
│       └── AppShell.tsx
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth.api.ts
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   ├── slice/
│   │   │   └── auth.slice.ts
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   └── chat/
│       ├── api/
│       │   ├── users.api.ts
│       │   ├── conversations.api.ts
│       │   └── messages.api.ts
│       ├── components/
│       │   ├── ChatLayout.tsx
│       │   ├── ConversationList.tsx
│       │   ├── ConversationItem.tsx
│       │   ├── ChatWindow.tsx
│       │   ├── ChatHeader.tsx
│       │   ├── MessageList.tsx
│       │   ├── MessageBubble.tsx
│       │   ├── MessageInput.tsx
│       │   ├── TypingIndicator.tsx
│       │   ├── UserSearch.tsx
│       │   ├── NewChatModal.tsx
│       │   ├── CreateGroupModal.tsx
│       │   ├── GroupInfoModal.tsx
│       │   └── GroupMembers.tsx
│       ├── hooks/
│       │   ├── useChat.ts
│       │   └── useSocket.ts
│       ├── socket/
│       │   ├── socket.client.ts
│       │   └── socket.events.ts
│       ├── slice/
│       │   └── chat.slice.ts
│       ├── types/
│       │   ├── chat.types.ts
│       │   ├── conversation.types.ts
│       │   ├── message.types.ts
│       │   └── user.types.ts
│       └── utils/
│           ├── chat.utils.ts
│           └── message.utils.ts
│
├── lib/
│   ├── api/
│   │   └── baseApi.ts
│   ├── redux/
│   │   ├── store.ts
│   │   └── provider.tsx
│   └── socket/
│       └── socket.config.ts
│
├── types/
│   └── common.types.ts
│
└── styles/
    └── globals.css
```

---

# Dependency Direction

The project should maintain a predictable dependency direction.

```text
UI Components
      ↓
Feature Hooks
      ↓
RTK Query / Redux
      ↓
API / Socket Layer
      ↓
Backend
```

Lower-level communication modules should not import UI components.

This reduces circular dependencies and keeps the architecture easier to
reason about.

---

# Error Handling Strategy

Errors are handled at the appropriate layer.

## API Errors

RTK Query exposes request errors to components.

The UI converts these into user-friendly states.

```text
API Error
   ↓
RTK Query
   ↓
Component
   ↓
Error UI
```

## Socket Errors

Socket lifecycle errors are handled by the socket layer.

```text
Socket Error
   ↓
useSocket
   ↓
Redux socket status
   ↓
Connection indicator
```

---

# Loading and Empty States

Loading and empty states are treated as normal application states.

Examples:

```text
Conversation List
├── Loading
├── Loaded
├── Empty
└── Error
```

```text
Message List
├── Loading
├── Loaded
├── Empty
└── Error
```

This avoids relying on blank UI areas to communicate application state.

---

# Responsive Architecture

The chat application is designed for both desktop and mobile layouts.

Desktop:

```text
┌─────────────────────────────────────────────┐
│ Conversation List │     Chat Window         │
│                   │                         │
│ Conversation      │     Messages            │
│ Conversation      │     Messages            │
│ Conversation      │                         │
│                   │     Message Input       │
└─────────────────────────────────────────────┘
```

Mobile:

```text
┌───────────────────────┐
│ Conversation List     │
│                       │
│ Conversation          │
│ Conversation          │
│ Conversation          │
└───────────────────────┘

            ↓

┌───────────────────────┐
│ Chat Header           │
│                       │
│ Messages              │
│ Messages              │
│                       │
│ Message Input         │
└───────────────────────┘
```

The chat interface should prioritize the message experience on smaller
screens.

---

# Performance Considerations

The application is designed to avoid unnecessary work.

Key considerations:

* RTK Query caching
* Debounced user search
* Cursor-based message pagination
* Single shared Socket.IO connection
* Event listener cleanup
* Message deduplication
* Avoiding unnecessary global state
* Avoiding forced auto-scroll
* Component-level rendering boundaries

For large conversations, only the required message history should be
loaded rather than requesting the entire conversation.

---

# Security Considerations

Authentication and authorization are ultimately enforced by the
backend.

The frontend should still follow secure practices:

* Do not expose JWT tokens in UI.
* Do not log authentication tokens.
* Send authentication headers only through the API layer.
* Send JWT through the Socket.IO authentication mechanism.
* Disconnect sockets on logout.
* Treat frontend permission checks as UI behavior, not security
  boundaries.
* Do not trust user-provided IDs or permissions without backend
  validation.

---

# API Inconsistency Handling

During API exploration, the documented API surface and live API
behavior may not always be identical.

For example, an endpoint documented in Swagger may not behave exactly as
expected against the deployed server.

The frontend therefore avoids making non-essential functionality depend
on undocumented endpoints.

API behavior observed during development should be documented separately
where relevant.

---

# Architectural Trade-offs

## RTK Query Instead of Manual Fetching

### Benefit

* Less boilerplate
* Built-in caching
* Request lifecycle handling
* Centralized API configuration

### Trade-off

Developers need to understand RTK Query's cache and invalidation model.

---

## Redux Toolkit for Client State

### Benefit

* Predictable state updates
* Centralized UI state
* Easy debugging
* Works naturally with RTK Query

### Trade-off

Some very local UI state does not need Redux and should remain inside
React components.

---

## Socket.IO Instead of Polling

### Benefit

* Real-time updates
* Lower unnecessary request traffic
* Better chat experience

### Trade-off

Requires connection lifecycle management, reconnect handling, and
event synchronization.

---

## Feature-Based Architecture

### Benefit

* Related code stays together
* Easier maintenance
* Easier feature expansion
* Clear ownership of API/components/types

### Trade-off

For a very small application, this structure introduces more files than
a simple component-based structure.

For this assessment, the additional organization is justified because
the application contains authentication, conversations, groups,
messages, and real-time communication.

---

# Future Improvements

If additional development time were available, possible improvements
would include:

* Optimistic message sending
* Message delivery/read states
* Typing indicators if supported by the backend
* Online/offline presence
* Better message virtualization for very large conversations
* More robust reconnect synchronization
* Automated component and integration tests
* End-to-end testing
* Improved accessibility auditing
* More advanced notification handling
* Offline message queueing

These improvements would depend on backend support where required.

---

# Architecture Summary

The architecture intentionally keeps responsibilities separated:

```text
                    React / Next.js
                           │
              ┌────────────┴────────────┐
              │                         │
          RTK Query                Redux Toolkit
              │                         │
        Server State               Client State
              │                         │
              └────────────┬────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
              REST API           Socket.IO
                 │                   │
                 └─────────┬─────────┘
                           │
                      Chat Backend
```

The result is a frontend architecture that is modular, typed,
real-time capable, and suitable for extending beyond the scope of the
assessment.
