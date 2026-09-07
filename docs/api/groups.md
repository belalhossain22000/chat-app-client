# Groups API

The Groups API provides functionality for creating and managing group
conversations.

Group management includes:

- Creating a group
- Adding participants
- Removing participants
- Leaving a group
- Promoting participants to admins
- Renaming a group

All endpoints require authentication.

---

# POST /conversations/group

Create a new group conversation.

The authenticated user becomes the creator and an admin of the group.
The creator is automatically included as a participant.

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
POST /api/conversations/group
```

### Request Body

```json
{
  "name": "Project Team",
  "participantIds": [
    "USER_ID_1",
    "USER_ID_2",
    "USER_ID_3"
  ]
}
```

### Request Fields

| Field            | Type     | Required | Description                      |
| ---------------- | -------- | -------- | -------------------------------- |
| `name`           | string   | Yes      | Name of the group                |
| `participantIds` | string[] | Yes      | IDs of users to add to the group |

---

## Response

### Status

```text
201 Created
```

### Response Body

```json
{
  "id": "CONVERSATION_ID",
  "type": "group",
  "name": "Project Team",
  "createdBy": "CURRENT_USER_ID",
  "admins": [
    "CURRENT_USER_ID"
  ],
  "participants": [
    {
      "id": "CURRENT_USER_ID",
      "name": "Current User",
      "phone": "+15551234567"
    },
    {
      "id": "USER_ID_1",
      "name": "User One",
      "phone": "+15550000001"
    },
    {
      "id": "USER_ID_2",
      "name": "User Two",
      "phone": "+15550000002"
    }
  ]
}
```

---

## Notes

The authenticated user is automatically added to the group.

The authenticated user is also automatically assigned as an admin.

Therefore, the number of returned participants can be greater than the
number of IDs provided in `participantIds`.

---

# POST /conversations/{id}/participants

Add one or more users to an existing group conversation.

Only group admins can add participants.

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
POST /api/conversations/{id}/participants
```

### Path Parameters

| Parameter | Type   | Required | Description           |
| --------- | ------ | -------- | --------------------- |
| `id`      | string | Yes      | Group conversation ID |

### Request Body

```json
{
  "userIds": [
    "USER_ID_1",
    "USER_ID_2"
  ]
}
```

### Request Fields

| Field     | Type     | Required | Description         |
| --------- | -------- | -------- | ------------------- |
| `userIds` | string[] | Yes      | IDs of users to add |

---

## Response

### Status

```text
200 OK
```

The API returns the updated conversation object.

```json
{
  "id": "CONVERSATION_ID",
  "type": "group",
  "name": "Project Team",
  "createdBy": "USER_ID",
  "admins": [
    "ADMIN_USER_ID"
  ],
  "participants": [
    {
      "id": "USER_ID_1",
      "name": "User One",
      "phone": "+15550000001"
    }
  ]
}
```

---

## Frontend Usage

The UI should expose the "Add Members" action only to users who are
admins of the group.

After a successful request, the local conversation state should be
updated with the returned participant list.

---

# DELETE /conversations/{id}/participants/{userId}

Remove a participant from a group.

This endpoint has two behaviors:

* Admin removes another participant
* A participant removes themselves to leave the group

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
DELETE /api/conversations/{id}/participants/{userId}
```

### Path Parameters

| Parameter | Type   | Required | Description                                             |
| --------- | ------ | -------- | ------------------------------------------------------- |
| `id`      | string | Yes      | Group conversation ID                                   |
| `userId`  | string | Yes      | User ID to remove or the current user's ID when leaving |

---

## Behavior

### Removing Another Member

If the authenticated user is an admin and `userId` belongs to another
participant, the user is removed from the group.

### Leaving the Group

If `userId` is the authenticated user's own ID, the operation acts as
"Leave Group".

Any group member can leave the group.

---

## Response

### Status

```text
200 OK
```

The API returns the updated conversation object.

```json
{
  "id": "CONVERSATION_ID",
  "type": "group",
  "name": "Project Team",
  "createdBy": "USER_ID",
  "admins": [
    "ADMIN_USER_ID"
  ],
  "participants": [
    {
      "id": "USER_ID",
      "name": "User One",
      "phone": "+15550000001"
    }
  ]
}
```

---

## Frontend Behavior

The UI should distinguish between:

```text
Admin viewing another member
        ↓
"Remove Member"

Current user
        ↓
"Leave Group"
```

A confirmation dialog should be displayed before either destructive
action.

---

# POST /conversations/{id}/admins

Promote an existing group participant to admin.

Only existing admins can promote another participant.

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
POST /api/conversations/{id}/admins
```

### Path Parameters

| Parameter | Type   | Required | Description           |
| --------- | ------ | -------- | --------------------- |
| `id`      | string | Yes      | Group conversation ID |

### Request Body

```json
{
  "userId": "USER_ID"
}
```

### Request Fields

| Field    | Type   | Required | Description                         |
| -------- | ------ | -------- | ----------------------------------- |
| `userId` | string | Yes      | ID of an existing group participant |

---

## Response

### Status

```text
200 OK
```

The API returns the updated conversation object.

```json
{
  "id": "CONVERSATION_ID",
  "type": "group",
  "name": "Project Team",
  "createdBy": "USER_ID",
  "admins": [
    "ADMIN_USER_ID",
    "NEW_ADMIN_USER_ID"
  ],
  "participants": [
    {
      "id": "NEW_ADMIN_USER_ID",
      "name": "User One",
      "phone": "+15550000001"
    }
  ]
}
```

---

## Frontend Behavior

The "Make Admin" action should only be available to current group
admins.

The target user must already be a participant of the group.

After promotion, the returned `admins` array should be used to update
the local conversation state.

---

# PATCH /conversations/{id}

Rename an existing group conversation.

Only group admins can rename the group.

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
PATCH /api/conversations/{id}
```

### Path Parameters

| Parameter | Type   | Required | Description           |
| --------- | ------ | -------- | --------------------- |
| `id`      | string | Yes      | Group conversation ID |

### Request Body

```json
{
  "name": "Renamed Team"
}
```

### Request Fields

| Field  | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| `name` | string | Yes      | New group name |

---

## Response

### Status

```text
200 OK
```

The API returns the updated group conversation.

```json
{
  "id": "CONVERSATION_ID",
  "type": "group",
  "name": "Renamed Team",
  "createdBy": "USER_ID",
  "admins": [
    "ADMIN_USER_ID"
  ],
  "participants": [
    {
      "id": "USER_ID",
      "name": "User One",
      "phone": "+15550000001"
    }
  ]
}
```

---

# Group Permission Model

The frontend should follow the permission model exposed by the API.

| Action                    | Member | Admin |
| ------------------------- | :----: | :---: |
| View group                |   Yes  |  Yes  |
| Send messages             |   Yes  |  Yes  |
| Leave group               |   Yes  |  Yes  |
| Add members               |   No   |  Yes  |
| Remove another member     |   No   |  Yes  |
| Make another member admin |   No   |  Yes  |
| Rename group              |   No   |  Yes  |

---

# Group Management Flow

```text
Create Group
     ↓
POST /conversations/group
     ↓
Group Created
     ↓
GET /conversations
     ↓
Open Group
     ↓
GET /conversations/{id}/messages
```

For member management:

```text
Group Info
    ↓
Check current user
    ↓
Is current user an admin?
    │
    ├── Yes
    │    ├── Add Members
    │    ├── Remove Members
    │    ├── Make Admin
    │    └── Rename Group
    │
    └── No
         └── Leave Group
```

---

# Real-Time Group Updates

Group changes can also be delivered through the WebSocket connection.

The server emits:

```text
conversation:updated
```

when a group is:

* Created
* Renamed
* Updated with new members
* Updated with changed admins

The frontend should use this event to keep the conversation list and
currently opened group information synchronized.

Detailed WebSocket behavior is documented in:

`docs/api/websocket.md`

---

# Frontend State Synchronization

After a successful group mutation, the frontend should update the
conversation data returned by the API.

For real-time updates, the frontend should also process the
`conversation:updated` Socket.IO event.

Recommended flow:

```text
REST Mutation
     ↓
API returns updated conversation
     ↓
Update / invalidate RTK Query cache
     ↓
UI updates immediately

Socket Event
     ↓
conversation:updated
     ↓
Update / invalidate conversation cache
     ↓
UI stays synchronized
```

---

# Notes

* All group management endpoints require authentication.
* Group creation automatically includes the authenticated user.
* The creator is initially an admin.
* Only admins can add members.
* Only admins can remove other members.
* Any member can leave a group by removing themselves.
* Only admins can promote participants to admins.
* Only admins can rename groups.
* Group mutations return the updated conversation object.
* The frontend should enforce the same permission model in the UI while
  treating the backend as the final authority.
* Real-time group changes are delivered through the
  `conversation:updated` WebSocket event.
* Error response structures are not formally defined in the provided
  API specification and should be handled defensively on the frontend.
