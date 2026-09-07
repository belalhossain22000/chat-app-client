# Conversations API

Conversation-related REST API endpoints.

## Base URL

```text
https://frontend-task-chatapp.onrender.com/api
```

All conversation endpoints require authentication.

### Authentication

Protected endpoints require a JWT token:

```http
Authorization: Bearer <JWT_TOKEN>
```

The JWT token is returned from:

```http
POST /auth/login
```

---

## 1. Get Conversations

Returns the conversations available to the authenticated user.

### Endpoint

```http
GET /conversations
```

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Response

**200 OK**

```json
{
  "data": [
    {
      "id": "conversation-id",
      "type": "group",
      "lastMessage": {
        "text": "Dear HR Mam",
        "sender": "user-id",
        "createdAt": "2026-08-30T22:43:41.720Z"
      },
      "updatedAt": "2026-08-30T22:45:16.284Z",
      "name": "Aouishi Saha ma'am",
      "createdBy": "user-id",
      "admins": [
        "user-id"
      ],
      "participants": [
        {
          "id": "user-id",
          "name": "Md. Johirul Islam",
          "phone": "01824824336"
        }
      ]
    }
  ]
}
```

### Response Fields

| Field          | Type       | Description                                 |
| -------------- | ---------- | ------------------------------------------- |
| `id`           | `string`   | Unique conversation ID                      |
| `type`         | `string`   | Conversation type                           |
| `name`         | `string`   | Conversation/group name when available      |
| `lastMessage`  | `object`   | Latest message information                  |
| `updatedAt`    | `string`   | Last conversation update time               |
| `createdBy`    | `string`   | ID of the user who created the conversation |
| `admins`       | `string[]` | IDs of conversation administrators          |
| `participants` | `object[]` | Conversation participants                   |

### Last Message

```ts
interface LastMessage {
  text: string;
  sender: string;
  createdAt: string;
}
```

### Participant

```ts
interface ConversationParticipant {
  id: string;
  name: string;
  phone: string;
}
```

---

## 2. Create One-to-One Conversation

Creates a conversation with another user.

### Endpoint

```http
POST /conversations
```

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

```json
{
  "userId": "6a884af2e5d6aac975222ba7"
}
```

### Request Fields

| Field    | Type     | Required | Description                                   |
| -------- | -------- | -------- | --------------------------------------------- |
| `userId` | `string` | Yes      | ID of the user to start the conversation with |

### Response

**200 OK**

```json
{
  "id": "6a9e5b2fd386e2dcaba1333",
  "participants": [
    "6a882468e5d6aac97521e25e",
    "6a884af2e5d6aac975222ba7"
  ],
  "createdAt": "2026-09-07T06:38:42.087Z"
}
```

### Response Fields

| Field          | Type       | Description                      |
| -------------- | ---------- | -------------------------------- |
| `id`           | `string`   | Newly created conversation ID    |
| `participants` | `string[]` | IDs of conversation participants |
| `createdAt`    | `string`   | Conversation creation timestamp  |

### Frontend Flow

```text
Search user
    ↓
Select user
    ↓
POST /conversations
    ↓
Receive conversation ID
    ↓
Open conversation
    ↓
Load messages
```

---

## 3. Get Conversation Messages

Returns the message history of a conversation.

### Endpoint

```http
GET /conversations/{conversationId}/messages
```

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Path Parameters

| Parameter        | Type     | Description            |
| ---------------- | -------- | ---------------------- |
| `conversationId` | `string` | ID of the conversation |

### Query Parameters

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `limit`   | `number` | Maximum number of messages to return |
| `before`  | `string` | Cursor used to load older messages   |

### Example

```http
GET /conversations/6a9e5b2fd386e2dcaba1557/messages?limit=20
```

### Load Older Messages

```http
GET /conversations/6a9e5b2fd386e2dcaba1557/messages?limit=20&before=<cursor>
```

### Response

**200 OK**

```json
{
  "messages": [],
  "hasMore": false
}
```

When messages are available, the `messages` array contains message objects.

### Message Type

```ts
interface Message {
  id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string;
}
```

### Pagination

The API uses cursor-based pagination for loading older messages.

Initial message load:

```text
GET /conversations/{id}/messages?limit=20
```

When the user scrolls upward:

```text
User reaches older-message boundary
            ↓
Use `before` cursor
            ↓
Request older messages
            ↓
Prepend messages to the list
```

The frontend should preserve the user's scroll position when older messages are loaded.

---

## 4. Conversation Types

The API supports both one-to-one and group conversations.

### One-to-One Conversation

A conversation between two users.

```json
{
  "type": "one-to-one"
}
```

### Group Conversation

A conversation containing multiple participants.

```json
{
  "type": "group",
  "name": "Project Team"
}
```

Group creation and management endpoints are documented separately in:

```text
docs/api/groups.md
```

---

## 5. Conversation List UI Behavior

The frontend can use the conversation response to display:

* Conversation name
* Last message
* Last message timestamp
* Participant information
* Group information
* Conversation type

For messages sent by the current user, the UI can display:

```text
You: <message>
```

This can be determined by comparing:

```ts
lastMessage.sender === currentUser.id
```

---

## 6. Loading Messages

When opening a conversation, the frontend should display a loading state while messages are being fetched.

```text
Opening conversation
        ↓
Loading messages
        ↓
Display message history
```

If there are no messages:

```text
No messages yet

Be the first to say hello.
```

---

## 7. Empty Conversation List

When the authenticated user has no conversations, the frontend should display an empty state instead of an empty blank sidebar.

Example:

```text
No conversations yet

Start chatting with someone
and your conversations will appear here.

[ Start a conversation ]
[ Create group ]
```

---

## 8. Error Handling

The frontend should handle API failures gracefully.

Possible UI states include:

```text
Couldn't load conversations

Something went wrong while loading
your conversations.

[ Try again ]
```

For message loading:

```text
Couldn't load messages

Something went wrong while loading
this conversation.

[ Try again ]
```

---

## Related APIs

### Users

User search is documented in:

```text
docs/api/users.md
```

### Groups

Group creation and member management are documented in:

```text
docs/api/groups.md
```

### Messages

Message sending is documented in:

```text
docs/api/messages.md
```

### WebSocket

Real-time conversation and message events are documented in:

```text
docs/api/websocket.md
```
