# Authentication API

The ChatApp API uses JWT-based authentication.

Authentication is handled through the following endpoints:

- `POST /auth/login`
- `GET /auth/me`

---

## Authentication Flow

The authentication flow is:

```text
Login / Register
      ↓
POST /auth/login
      ↓
JWT Token
      ↓
Store Token
      ↓
Send Bearer Token
      ↓
Protected API Requests
```

A new user does not require a separate registration request.

If the phone number does not exist, the API creates a new account automatically.

If the phone number already exists, the user is logged in.

---

# POST /auth/login

Login or register a user.

## Authentication

No authentication required.

## Request

### Endpoint

```text
POST /api/auth/login
```

### Request Body

```json
{
  "phone": "+15551234567",
  "name": "Ada Lovelace"
}
```

### Request Fields

| Field   | Type   | Required | Description       |
| ------- | ------ | -------- | ----------------- |
| `phone` | string | Yes      | User phone number |
| `name`  | string | Yes      | User name         |

---

## Response

### Status

```text
200 OK
```

### Response Body

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Ada Lovelace",
    "phone": "+15551234567",
    "createdAt": "2026-08-21T01:11:52.529Z"
  }
}
```

### Response Fields

| Field            | Type   | Description              |
| ---------------- | ------ | ------------------------ |
| `token`          | string | JWT authentication token |
| `user`           | object | Authenticated user       |
| `user.id`        | string | Unique user ID           |
| `user.name`      | string | User name                |
| `user.phone`     | string | User phone number        |
| `user.createdAt` | string | User creation timestamp  |

---

## Using the JWT

The returned JWT must be sent with every protected REST API request.

### Header

```http
Authorization: Bearer <token>
```

Example:

```http
Authorization: Bearer eyJhbGciOi...
```

The same JWT is also used for the Socket.IO handshake.

---

# GET /auth/me

Returns the user associated with the current bearer token.

This endpoint is useful for restoring the authenticated session when the application starts.

## Authentication

Required.

### Header

```http
Authorization: Bearer <token>
```

## Request

### Endpoint

```text
GET /api/auth/me
```

No request body or query parameters are required.

---

## Response

### Status

```text
200 OK
```

### Response Body

```json
{
  "id": "USER_ID",
  "name": "Ada Lovelace",
  "phone": "+15551234567",
  "createdAt": "2026-08-21T01:11:52.529Z"
}
```

### Response Fields

| Field       | Type   | Description             |
| ----------- | ------ | ----------------------- |
| `id`        | string | Unique user ID          |
| `name`      | string | User name               |
| `phone`     | string | User phone number       |
| `createdAt` | string | User creation timestamp |

---

# Frontend Authentication Flow

The frontend should handle authentication in the following order:

```text
1. User submits login form
        ↓
2. POST /auth/login
        ↓
3. Receive JWT + user
        ↓
4. Persist authentication token
        ↓
5. Set authenticated user
        ↓
6. Connect to Socket.IO using the JWT
        ↓
7. Access protected APIs
```

When the application loads:

```text
Application Start
      ↓
Check stored token
      ↓
GET /auth/me
      ↓
Valid token?
   ↙       ↘
 Yes       No
 ↓          ↓
Restore    Logout /
Session    Login
```

---

# Protected Requests

All protected REST endpoints require:

```http
Authorization: Bearer <token>
```

Examples of protected resources include:

```text
GET  /users/search
GET  /conversations
POST /conversations
GET  /conversations/:id/messages
POST /messages
```

---

# Notes

* There is no separate signup endpoint.
* A new phone number automatically creates a user account during login.
* An existing phone number logs the user in.
* The login response contains both the JWT and the authenticated user.
* `/auth/me` can be used to restore the current user from an existing JWT.
* The JWT is also required during the Socket.IO handshake.

## Error Responses

The provided API documentation does not formally specify authentication error response structures.

Therefore, error response formats should be documented only after inspecting the live API behavior.
