# Messages API

The Messages API provides functionality for sending and retrieving messages in direct and group conversations.

Real-time message delivery is handled via WebSockets (`message:created`), while message creation and historical retrieval are handled via REST endpoints.

---

# POST /messages

Send a new message to an existing conversation.

## Authentication

Required.

### Header

```http
Authorization: Bearer <token>
```

---

## Request

### Endpoint

```text
POST /api/messages
```

### Request Body

```json
{
  "conversationId": "CONVERSATION_ID",
  "content": "Hello! How are you?"
}
```

### Request Fields

| Field            | Type   | Required | Description                                       |
| ---------------- | ------ | -------- | ------------------------------------------------- |
| `conversationId` | string | Yes      | ID of the target conversation (direct or group)   |
| `content`        | string | Yes      | Text content of the message                       |

---

## Response

### Status

```text
201 Created
```

### Response Body

```json
{
  "id": "MESSAGE_ID",
  "conversationId": "CONVERSATION_ID",
  "senderId": "CURRENT_USER_ID",
  "sender": {
    "id": "CURRENT_USER_ID",
    "name": "Current User",
    "phone": "+15551234567"
  },
  "content": "Hello! How are you?",
  "createdAt": "2026-09-07T13:30:00.000Z",
  "updatedAt": "2026-09-07T13:30:00.000Z"
}
```

### Response Fields

| Field            | Type   | Description                                       |
| ---------------- | ------ | ------------------------------------------------- |
| `id`             | string | Unique message ID                                 |
| `conversationId` | string | Associated conversation ID                        |
| `senderId`       | string | User ID of the sender                             |
| `sender`         | object | Sender user details                               |
| `sender.id`      | string | Unique ID of the sender                           |
| `sender.name`    | string | Sender name                                       |
| `sender.phone`   | string | Sender phone number                               |
| `content`        | string | Message text                                      |
| `createdAt`      | string | ISO timestamp when the message was sent           |
| `updatedAt`      | string | ISO timestamp when the message was last updated   |

---

## Validation Rules

The backend enforces validation on outgoing messages:

1. **Non-Empty Content**: Message content cannot be empty or contain only whitespace characters (`content.trim().length > 0`).
2. **Participant Check**: The authenticated user must be an active participant of `conversationId`. Non-participants receive `403 Forbidden`.
3. **Valid Conversation**: The provided `conversationId` must exist. Non-existent conversations return `404 Not Found`.

---

# GET /conversations/{id}/messages

Retrieve message history for a specific conversation.

## Authentication

Required.

### Header

```http
Authorization: Bearer <token>
```

---

## Request

### Endpoint

```text
GET /api/conversations/{id}/messages
```

### Path Parameters

| Parameter | Type   | Required | Description     |
| --------- | ------ | -------- | --------------- |
| `id`      | string | Yes      | Conversation ID |

### Query Parameters (Optional Pagination)

| Parameter | Type   | Required | Description                                                  |
| --------- | ------ | -------- | ------------------------------------------------------------ |
| `limit`   | number | No       | Number of messages to retrieve (e.g. `50`)                   |
| `before`  | string | No       | Message ID or timestamp cursor for fetching earlier history  |

---

## Response

### Status

```text
200 OK
```

### Response Body

Returns an array of message objects ordered chronologically:

```json
[
  {
    "id": "MESSAGE_ID_1",
    "conversationId": "CONVERSATION_ID",
    "senderId": "SENDER_USER_ID",
    "sender": {
      "id": "SENDER_USER_ID",
      "name": "Ada Lovelace",
      "phone": "+15551234567"
    },
    "content": "Good morning everyone!",
    "createdAt": "2026-09-07T10:00:00.000Z",
    "updatedAt": "2026-09-07T10:00:00.000Z"
  }
]
```

---

# Message Lifecycle & Optimistic Updates

To provide a snappy chat experience, the frontend implements an optimistic UI workflow:

```text
1. User types message & hits Send
        ↓
2. Generate local temporary ID (`tempId: crypto.randomUUID()`)
        ↓
3. Append message immediately to UI state with status: "sending"
        ↓
4. Send POST /messages
        ↓
   ┌───────────────────────┴───────────────────────┐
   ↓                                               ↓
[Success (201)]                               [Failure]
Update status to "sent"                       Update status to "failed"
Replace `tempId` with server `id`             Show retry button & error banner
```

### Message Status States

```typescript
type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
```

---

# Duplicate Message Prevention & Deduplication

In distributed or flaky network environments, duplicate messages can occur due to retries or simultaneous WebSocket and REST events.

### Frontend Deduplication Strategy

1. **By Server `id`**:
   Maintain a Set or dictionary keyed by `id`. When receiving messages via `GET /messages` or `message:created` socket event, discard if `message.id` already exists in state.

2. **Reconciling Optimistic Messages**:
   When the server emits `message:created` or returns `POST /messages`:
   - If the message was sent by the current user, replace the pending message (matching by local `tempId` or matching conversation + sender + timestamp + content) instead of appending a duplicate bubble.

```typescript
// Deduplication logic example:
const existingIndex = state.messages.findIndex(
  (m) => m.id === incomingMessage.id || (m.tempId && m.tempId === incomingMessage.tempId)
);

if (existingIndex !== -1) {
  state.messages[existingIndex] = { ...incomingMessage, status: 'sent' };
} else {
  state.messages.push({ ...incomingMessage, status: 'sent' });
}
```

---

# Real-Time Synchronization

When any user sends a message, the server broadcasts a WebSocket event to all conversation participants:

```text
Event: message:created
Payload: Full Message Object
```

Detailed WebSocket event listeners and connection lifecycle are documented in:

`docs/api/websocket.md`

---

# Notes

* All message endpoints require JWT Bearer authentication.
* Only active conversation members can send or read messages.
* Text messages are delivered instantly via WebSocket (`message:created`) and saved permanently via REST.
* Client-side optimistic rendering prevents UI lag during network latency.
* Deduplication by message ID is required to prevent duplicate renders during socket broadcast reconciliation.
