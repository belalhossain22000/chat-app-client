# FlowChat - Senior Frontend Developer Engineering Standards

This project is a high-stakes Senior Frontend Developer interview/evaluation task. All code written must reflect senior-level software design, production readiness, and performance optimization.

---

## 1. Core Architecture & Folder Structure

Follow a scalable, feature-first modular architecture inside `src/`:

```text
src/
├── app/                  # Next.js App Router (pages, layouts, route handlers)
├── components/
│   ├── ui/               # Reusable primitive UI components (Button, Input, Modal, Avatar, Badge, Dropdown, etc.)
│   └── common/           # Shared composition components (ErrorBoundary, EmptyState, LoadingSpinner, etc.)
├── features/             # Domain/Feature modules
│   ├── auth/             # Login, auth guard, tokens, auth state
│   ├── chat/             # Chat window, message list, message item, chat input, typing indicators
│   ├── conversations/    # Conversation sidebar, conversation item, search bar, filters
│   └── groups/           # Group modal, member management, admin actions
├── hooks/                # Custom utility and UI hooks (useScrollToBottom, useDebounce, useMediaQuery, etc.)
├── services/             # WebSocket and external services (socket.client.ts, socket.events.ts)
├── store/                # Redux Toolkit store, slices, RTK Query API definitions, custom selectors
├── types/                # Strict TypeScript types & interfaces matching docs/api specs
└── utils/                # Pure helper functions (date formatters, cn/classnames helper, validation)
```

---

## 2. Re-render Optimization & Performance Guidelines (Critical)

1. **Selective Redux Subscriptions**:
   - Never subscribe a component to a large root state or entire conversation object if it only needs an ID, status, or unread count.
   - Use fine-grained memoized selectors (`createSelector`) or select primitives directly.

2. **Leaf State Isolation**:
   - Keep fast-changing, transient states (e.g., input field typing, search query text, hover tooltips) inside leaf components.
   - Avoid lifting input state to parent chat/conversation containers which would trigger whole-screen re-renders on every keystroke.

3. **Component Memoization (`React.memo`)**:
   - Wrap heavy list items (e.g., `MessageItem`, `ConversationListItem`, `UserSearchItem`) in `React.memo` with proper prop stability.

4. **Stable References (`useCallback` & `useMemo`)**:
   - Memoize callback handlers passed as props to memoized children to prevent breaking memoization.
   - Use `useMemo` for derived lists, filters, or sorting operations.

5. **Scroll & Resize Performance**:
   - Use passive event listeners and debounced/throttled scroll handlers or `IntersectionObserver` for message boundary detection and pagination cursors.

6. **Keys & List Rendering**:
   - Always use unique persistent IDs (`message.id`, `conversation.id`, `user.id`) as React `key`s. Never use array index as keys for dynamic lists.

---

## 3. Component Reusability & Clean Code

- **DRY & Single Responsibility**: Every component should have a single, well-defined purpose.
- **Composition over Inheritance**: Use compound component patterns or slot patterns (`children`, `renderProps`, `slots`) for maximum flexibility.
- **Variants via Utility**: Build atomic UI components with standard variants (e.g. `variant`, `size`, `isLoading`, `disabled`) using `clsx` and `tailwind-merge` (`cn` helper).
- **Forwarding Refs**: Always support `forwardRef` on primitive UI components (`Input`, `Button`) for seamless accessibility and library compatibility.

---

## 4. TypeScript Discipline

- **Zero `any`**: Strictly define all data models, payloads, socket events, and UI prop types.
- **API Spec Alignment**: Cross-reference strictly with `docs/api/*.md` (`conversations.md`, `messages.md`, `websocket.md`, `groups.md`, `users.md`, `authentication.md`).
- **Discriminated Unions**: Use discriminated unions for distinct states (e.g. `type: 'direct' | 'group'`, `status: 'idle' | 'loading' | 'success' | 'error'`).

---

## 5. UI/UX Excellence & Polish

- **Optimistic UI Updates**: Render messages and updates immediately with pending state, reconciling with server IDs and WebSocket broadcasts.
- **Defensive & Resilient UX**: Elegant skeleton loading, informative empty states, error retry actions, and non-blocking toast notifications (`sonner`).
- **Scroll Fidelity**: Retain scroll position when prepending older messages, auto-scroll to bottom only when user is near bottom, and show a "New messages" pill when scrolled up.
- **Accessible & Responsive**: Fully responsive layout (mobile drawer/sidebar toggle, desktop split view), clear focus states, and semantic HTML elements.

---

## 6. Pair Programming & Collaborative Workflow

- **Role**: Dedicated Senior / Staff Frontend Pair Programmer.
- **Active Partnership**: Work shoulder-to-shoulder with the developer, breaking down complex tasks collaboratively and discussing design tradeoffs.
- **Continuous Quality Gate**: Enforce clean code, zero unnecessary re-renders, and production-grade TypeScript on every single file.
- **Transparent Decision-Making**: Explain architectural choices (why RTK Query vs custom hooks, why leaf state isolation, why specific memoization) so the project is 100% interview-ready and defendable.

---

## 7. Rendering Strategy: Server Components (SSR/RSC) vs Client Components (CSR)

1. **Server Components by Default (RSC)**:
   - Root layouts, static marketing/landing sections, metadata/SEO, and non-interactive UI shells stay as React Server Components.
   - Zero unnecessary JavaScript sent to the client; faster initial page load and superior Time to Interactive (TTI).

2. **Client Components (`"use client"`) Only When Required**:
   - Apply `"use client"` strictly when components need:
     - React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`).
     - Redux / RTK Query hooks (`useAppSelector`, `useAppDispatch`, API query/mutation hooks).
     - Browser-only APIs (`window`, `localStorage`, `document`, WebSockets / Socket.IO).
     - DOM event listeners (`onClick`, `onChange`, `onKeyDown`).

3. **Push Client Boundaries Down to Leaves (Boundary Pushdown)**:
   - Never turn an entire route or large container into `"use client"` just because an inner button or input needs interactivity.
   - Keep page wrappers as Server Components and import granular interactive Client Components into them, or pass server-rendered content as `children` / slots.

4. **Hydration Mismatch Prevention**:
   - For client-only values (e.g., token reading, local storage, dynamic timestamps), ensure safe hydration with proper initialization patterns or `mounted` checks.


