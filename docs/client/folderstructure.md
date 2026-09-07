# Frontend Folder Structure

## Overview

The project follows a feature-based frontend architecture.

The main goal is to keep:

- UI components
- API communication
- Redux state
- Socket communication
- Hooks
- Types
- Utility functions

separated by responsibility while keeping feature-related code close together.

---

## Project Structure

```text
src/
├── app/
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── chat/
│   │   └── page.tsx
│   │
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
│   │
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth.api.ts
│   │   │
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   │
│   │   ├── slice/
│   │   │   └── auth.slice.ts
│   │   │
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   └── chat/
│       ├── api/
│       │   ├── users.api.ts
│       │   ├── conversations.api.ts
│       │   └── messages.api.ts
│       │
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
│       │
│       ├── hooks/
│       │   ├── useChat.ts
│       │   └── useSocket.ts
│       │
│       ├── socket/
│       │   ├── socket.client.ts
│       │   └── socket.events.ts
│       │
│       ├── slice/
│       │   └── chat.slice.ts
│       │
│       ├── types/
│       │   ├── chat.types.ts
│       │   ├── conversation.types.ts
│       │   ├── message.types.ts
│       │   └── user.types.ts
│       │
│       └── utils/
│           ├── chat.utils.ts
│           └── message.utils.ts
│
├── lib/
│   ├── api/
│   │   └── baseApi.ts
│   │
│   ├── redux/
│   │   ├── store.ts
│   │   └── provider.tsx
│   │
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

## Folder Responsibilities

### `app/`

Contains Next.js routes and page-level composition.

```text
app/
├── login/
├── chat/
├── layout.tsx
├── page.tsx
└── providers.tsx
```

Pages should primarily compose features rather than contain large amounts of business logic.

---

### `components/`

Contains reusable components that are not specific to a single feature.

```text
components/
├── ui/
└── layout/
```

Examples:

* Button
* Input
* Modal
* Avatar
* Spinner
* EmptyState
* AppShell

Feature-specific components should remain inside their respective feature.

---

### `features/`

Contains feature-based application modules.

```text
features/
├── auth/
└── chat/
```

Each feature owns its related UI, API, state, types and logic.

This keeps the codebase modular and easier to maintain.

---

## Auth Feature

```text
features/auth/
├── api/
│   └── auth.api.ts
│
├── components/
│   └── LoginForm.tsx
│
├── slice/
│   └── auth.slice.ts
│
└── types/
    └── auth.types.ts
```

### Responsibilities

* Authentication API
* Login UI
* Authentication state
* Authentication-related TypeScript types

---

## Chat Feature

```text
features/chat/
├── api/
│   ├── users.api.ts
│   ├── conversations.api.ts
│   └── messages.api.ts
│
├── components/
├── hooks/
├── socket/
│   ├── socket.client.ts
│   └── socket.events.ts
│
├── slice/
│   └── chat.slice.ts
│
├── types/
│   ├── chat.types.ts
│   ├── conversation.types.ts
│   ├── message.types.ts
│   └── user.types.ts
│
└── utils/
    ├── chat.utils.ts
    └── message.utils.ts
```

### Responsibilities

#### `api/`

RTK Query endpoints for REST API communication.

#### `components/`

Chat-specific UI components.

#### `hooks/`

Custom hooks that connect UI with chat functionality.

#### `socket/`

Socket.IO connection and event handling.

#### `slice/`

Redux Toolkit slices for client-side chat state.

#### `types/`

Chat-related TypeScript types.

#### `utils/`

Pure helper functions related to chat and messages.

---

## `lib/`

Contains application-level infrastructure and configuration.

```text
lib/
├── api/
│   └── baseApi.ts
│
├── redux/
│   ├── store.ts
│   └── provider.tsx
│
└── socket/
    └── socket.config.ts
```

### Responsibilities

* RTK Query base configuration
* Redux store configuration
* Redux provider
* Shared Socket.IO configuration

---

## `types/`

Contains shared TypeScript types that are not specific to a single feature.

```text
types/
└── common.types.ts
```

Feature-specific types should remain inside the relevant feature.

---

## `styles/`

Contains global styling.

```text
styles/
└── globals.css
```

---

## Architecture Principle

The project follows this responsibility flow:

```text
UI
 ↓
Feature Components
 ↓
Hooks
 ↓
RTK Query / Redux / Socket.IO
 ↓
External API
```

REST API communication is handled through RTK Query.

Client-side application state is handled through Redux Toolkit.

Real-time communication is handled through Socket.IO.

Feature-specific code remains inside its feature boundary.