# Users API

The Users API provides user search functionality for finding users
by their name or phone number.

---

# GET /users/search

Search for users by name or phone number.

This endpoint is used when starting a new one-to-one conversation
or selecting participants for a group conversation.

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
GET /api/users/search
```

### Query Parameters

| Parameter | Type   | Required | Description                                         |
| --------- | ------ | -------- | --------------------------------------------------- |
| `q`       | string | Yes      | Search query. Can be a user's name or phone number. |

### Example

```http
GET /api/users/search?q=Ada
```

The search query is passed as the `q` query parameter.

---

## Response

### Status

```text
200 OK
```

### Response Body

The endpoint returns an array of users.

```json
[
  {
    "id": "6a883786e5d6aac97521f9db",
    "name": "Ada Lovelace",
    "phone": "+15551234567"
  },
  {
    "id": "6a8837d5e5d6aac97521faa4",
    "name": "Ada Lovelace",
    "phone": "015551234567"
  }
]
```

---

## Response Fields

Each user object contains:

| Field   | Type   | Description         |
| ------- | ------ | ------------------- |
| `id`    | string | Unique user ID      |
| `name`  | string | User's name         |
| `phone` | string | User's phone number |

---

## Example Request

```http
GET /api/users/search?q=Ada
Authorization: Bearer <token>
```

---

## Frontend Usage

This endpoint is used in the new conversation flow.

```text
User opens New Conversation
        ↓
User enters name or phone number
        ↓
GET /users/search?q=<query>
        ↓
Display matching users
        ↓
User selects a user
        ↓
Start conversation
```

It is also used when selecting participants while creating
a group conversation.

---

## Search UX

The frontend should avoid sending a request for every keystroke.

A debounced search can be used to reduce unnecessary API requests.

Example:

```text
User types:
A → Ad → Ada

Instead of:
GET ?q=A
GET ?q=Ad
GET ?q=Ada

Use:
GET ?q=Ada
```

The exact debounce duration is a frontend implementation decision.

---

## Notes

* The endpoint requires authentication.
* The search query is provided through the `q` parameter.
* Search can be performed using a user's name or phone number.
* The response is an array of user objects.
* The returned user ID can be used when starting a direct conversation
  or creating a group.
* The provided API specification does not define a formal response
  schema or error response structure.
