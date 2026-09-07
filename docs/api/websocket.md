# WebSocket API

ChatFlow uses Socket.IO for real-time communication. The WebSocket connection is used to receive new messages and conversation updates without requiring the client to refresh the page.

---

## Socket Server

```text
https://frontend-task-chatapp.onrender.com
```

> [!IMPORTANT]
> The Socket.IO server URL does not include `/api`.

### REST vs WebSocket

| Protocol | URL |
| -------- | --- |
| **REST API** | `https://frontend-task-chatapp.onrender.com/api` |
| **WebSocket** | `https://frontend-task-chatapp.onrender.com` |

---

## Authentication

Socket.IO authentication uses the JWT token returned from the login endpoint.

### Login

```http
POST /api/auth/login
```

After a successful login, the API returns a JWT token:

```json
{
  "token": "JWT_TOKEN"
}
```

The token is passed during the Socket.IO handshake.

### Connection Example

```ts
import { io } from "socket.io-client";

const socket = io("https://frontend-task-chatapp.onrender.com", {
  auth: {
    token: "<JWT_TOKEN>"
  }
});
```

---

## Client → Server Events

### `message:send`

Sends a new message through the Socket.IO connection.

#### Event

```text
message:send
```

#### Payload

```json
{
  "conversationId": "6a9e6041db386e2dcaba1557",
  "text": "Hello!"
}
```

#### TypeScript Type

```ts
interface SendMessagePayload {
  conversationId: string;
  text: string;
}
```

#### Example

```ts
socket.emit("message:send", { conversationId, text });
```

#### Message Validation

The frontend must prevent empty messages from being sent.

```ts
const trimmedText = text.trim();
if (!trimmedText) {
  return;
}
```

This prevents messages containing only whitespace from being submitted.

---

## Server → Client Events

### `message:new`

The server emits this event when a new message is available.

#### Event

```text
message:new
```

#### Payload

```json
{
  "id": "6a9e6187db386e2dcaba15ab",
  "conversationId": "6a9e6041db386e2dcaba1557",
  "sender": "6a882468e5d6aac97521e25e",
  "text": "Hello!",
  "createdAt": "2026-09-07T07:02:31.351Z"
}
```

#### TypeScript Type

```ts
interface MessageNewEvent {
  id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string;
}
```

#### Listening for Messages

```ts
socket.on("message:new", (message: MessageNewEvent) => {
  // Update message state
});
```

The frontend should add the incoming message to the correct conversation.

---

### `conversation:updated`

The server emits this event when a conversation is updated.

#### Event

```text
conversation:updated
```

This event can be triggered when a group conversation is:

* Created
* Renamed
* Updated
* Updated with new members
* Updated after members are removed
* Updated after admins change

#### Example Listener

```ts
socket.on("conversation:updated", (conversation) => {
  // Update conversation state or cache
});
```

The frontend should update the affected conversation without requiring a page refresh.

---

## Message Flow

A typical real-time message flow:

```text
User types message
        ↓
Validate message
        ↓
Send message
        ↓
Server processes message
        ↓
Server emits `message:new`
        ↓
Connected clients receive event
        ↓
Update message state
        ↓
Render message
```

---

## REST + Socket.IO

The application uses both REST APIs and Socket.IO.

### REST API

Used for:

* Login
* Current user
* User search
* Conversation list
* Conversation creation
* Message history
* Group creation
* Group management
* Sending messages

### Socket.IO

Used for:

* Real-time incoming messages
* Conversation updates
* Keeping the UI synchronized without refresh

---

## Duplicate Message Prevention

When sending a message, the frontend may receive the same message from both the REST API and the Socket.IO event.

Example:

```text
POST /messages
      ↓
REST response
      ↓
Message added to UI
      +
`message:new`
      ↓
Same message received
```

To prevent duplicates, messages should be identified by their unique `id`.

### Example

```ts
const exists = messages.some((message) => message.id === incomingMessage.id);
if (!exists) {
  addMessage(incomingMessage);
}
```

This ensures the same message is not rendered twice.

---

## Connection State

The frontend should track the Socket.IO connection state.

| State | Indicator |
| ----- | --------- |
| **Connected** | `● Connected` |
| **Connecting** | `○ Connecting...` |
| **Disconnected** | `● Reconnecting...` |

The application can display a subtle connection indicator when real-time communication is temporarily unavailable.

---

## Socket Lifecycle

The Socket.IO connection should be created when the authenticated user is available.

```text
User Login
    ↓
JWT available
    ↓
Initialize Socket.IO
    ↓
Authenticate connection
    ↓
Listen for events
```

When the application no longer needs the connection, event listeners should be cleaned up.

### Example

```ts
useEffect(() => {
  const handleNewMessage = (message: MessageNewEvent) => {
    // Handle incoming message
  };

  socket.on("message:new", handleNewMessage);

  return () => {
    socket.off("message:new", handleNewMessage);
  };
}, []);
```

This prevents duplicate listeners and repeated event handling.

---

## Real-Time Message UI

When a new message arrives, the frontend should determine the user's current scroll position.

```text
New message received
        ↓
Is user near the bottom?
   │
   ├── Yes
   │     ↓
   │   Show message
   │   Auto-scroll to latest
   │
   └── No
         ↓
       Don't force scroll
       Show new-message indicator
```

### Example Indicator

```text
↓ 3 new messages
```

Clicking the indicator should scroll the user to the latest messages.

This allows users to continue reading older messages without being interrupted by incoming messages.

### New Message While Scrolled Up

When the user is reading previous messages and a new message arrives:

```text
User reading old messages
            ↓
    New message arrives
            ↓
Keep current scroll position
            ↓
  Show "3 new messages"
            ↓
  User clicks indicator
            ↓
  Scroll to latest message
```

The application should never unexpectedly force the user to the bottom while they are reading older content.

---

## Conversation Updates

Group changes should be reflected in the conversation list and active conversation UI.

Example:

```text
Admin renames group
        ↓
conversation:updated
        ↓
Update cached conversation
        ↓
Update sidebar
        ↓
Update active chat header
```

The same approach applies when members or admins are changed.

---

## Socket Configuration

Recommended environment variable:

```env
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

REST API configuration:

```env
NEXT_PUBLIC_API_URL=https://frontend-task-chatapp.onrender.com/api
```

Keep the two URLs separate because the Socket.IO server does not use the `/api` prefix.

---

## Frontend Socket Architecture

The frontend socket layer is organized as:

```text
socket.client.ts
       ↓
socket.events.ts
       ↓
  useSocket.ts
       ↓
Redux / RTK Query
       ↓
Chat Components
```

### `socket.client.ts`
Responsible for creating the Socket.IO client connection.

### `socket.events.ts`
Contains Socket.IO event names and related event types.

### `useSocket.ts`
Handles the socket lifecycle inside React.

### `Redux / RTK Query`
Updates application state and cached server data after real-time events.

### `Chat Components`
Render the latest conversation and message state.

---

## Event Summary

| Direction | Event | Purpose |
| --------- | ----- | ------- |
| Client → Server | `message:send` | Send a new message |
| Server → Client | `message:new` | Notify clients about a new message |
| Server → Client | `conversation:updated` | Notify clients about conversation/group changes |

---

## Important Notes

* Socket.IO requires an authenticated JWT token.
* The JWT is sent through the Socket.IO handshake.
* The Socket.IO server URL does not include `/api`.
* Incoming messages should appear without refreshing the page.
* Messages should be deduplicated using their unique ID.
* Empty messages must not be sent.
* Conversation updates should update the UI in real time.
* Users reading older messages should not be force-scrolled to the latest message.
* Socket event listeners should be cleaned up when components unmount.

---

## Related Documentation

* [Authentication](./authentication.md)
* [Users](./users.md)
* [Conversations](./conversations.md)
* [Groups](./groups.md)
* [Messages](./messages.md)
