# Development Notes — Challenges, API Issues & Decisions

Working notes for the Part 3 write-up. Updated as the build progresses.

---

## 1. API Issues Found (probing the live backend)

The provided Swagger / `docs/api/*` and the deployed API at
`https://frontend-task-chatapp.onrender.com/api` disagree in several places.
Everything below was verified with live `curl` calls, not assumed.

### 1.1 `_id` instead of `id` — everywhere

Every entity (`user`, `conversation`, `message`) is returned with MongoDB's
`_id`, never `id`. Nested objects too (`participant._id`, `sender._id` where
present).

**Handled:** `src/lib/api/mapId.ts` — a recursive normaliser that rewrites
`_id → id` on any object/array. Applied in every endpoint's `transformResponse`.

### 1.2 Conversation list — direct vs group have different shapes

`GET /conversations` → `{ data: [...] }`, but each item's shape depends on type:

| field | direct | group |
| --- | --- | --- |
| `type` | `"direct"` (docs said `"one-to-one"`) | `"group"` |
| the other user | `participant: { _id, name, phone }` (**singular**) | — |
| all members | — | `participants: [{ _id, name, phone }]` (array, includes self) |
| `name`, `admins`, `createdBy` | absent | present |
| empty last message | `lastMessage: {}` (not `null`) | `lastMessage: {}` |

`POST /conversations` (1:1 create) returns a *thin* object:
`{ _id, participants: ["<id>", "<id>"], createdAt }` — participants as id
strings, no `type`, no names.

**Handled:** `src/features/chat/utils/normalizeConversation.ts` collapses both
into one `Conversation` type (`participants: User[]`, `lastMessage?` cleaned).

### 1.3 `POST /messages` — body field is `text`, not `content`

Docs say `{ conversationId, content }`. Live API rejects that with
`{"error":{"code":"VALIDATION_ERROR","details":[{"path":"text","message":"Required"}]}}`.
The working body is `{ conversationId, text }` — same as the socket
`message:send` payload.

### 1.4 Message object shape (live)

```jsonc
{ "_id": "...", "conversation": "...", "sender": "<userId string>",
  "text": "...", "createdAt": "..." }
```

No `senderId`, no `sender` object, no `updatedAt`. The sender's name has to be
looked up from the conversation's `participants`.

### 1.5 Message history is newest-first, cursor is a message id

`GET /conversations/:id/messages?limit=&before=` returns
`{ messages: [...], hasMore }` with **newest message first**. The UI needs
oldest→newest, so we reverse on normalise.

The `before` cursor must be a message **`_id`**, not a timestamp — passing an
ISO date returns `Cast to ObjectId failed ... SERVER_ERROR` (the docs said "id
or timestamp"). `before` is also **inclusive**: the cursor message reappears in
the older page. The `merge` step dedupes by id and stops paging when a page
brings nothing new.

### 1.6 Whitespace-only messages are accepted

`POST /messages` with `text: "   "` returns `201`. The brief requires empty
messages to be non-sendable, so the guard is enforced on the client
(`MessageInput` trims before enabling Send).

### 1.7 `/users/search` treats `q` as a raw regex

Passing a query with a regex metacharacter (`+`, `(`, `[`, `*`…) returns a
`500`: `Regular expression is invalid: quantifier does not follow a repeatable
item`. Typing a phone number with a `+` (which the phone field produces) broke
search entirely. The query is also **case-sensitive** (`ada`, `Ada`, `ADA` each return different
results) and appears prefix-anchored (a mid-string fragment of a phone number
doesn't match).

Fixed client-side in `users.api.ts` (`toSearchRegex`): escape regex
metacharacters, then prefix `(?i)` so the backend's regex match is
case-insensitive. The prefix-anchoring can't be worked around from the client.

### 1.8b Phone numbers aren't normalised → duplicate accounts

`POST /auth/login` stores whatever string it's given. `01940075782` and
`+8801940075782` are treated as two different users. The login form's
`composePhone` now only prepends the dial code when the user hasn't already
typed a `+`, `00`, or a leading `0`, so a full local/international number is
sent as-is.

### 1.7b No documented error shape

Errors come back as `{ error: { message, code, details? } }` but this isn't in
the spec. `src/lib/api/parseApiError.ts` checks `message` / `error` / `detail`
and falls back to HTTP-status text.

### 1.8 Socket `message:new` shape & double-delivery

The socket payload is `{ id, conversation, sender, text, createdAt }` — `id`
(not `_id`), the key is `conversation` (not `conversationId`), and `createdAt`
is **epoch milliseconds**, not an ISO string. `socketMessageToChat` normalises
all three.

The **sender receives their own `message:new`**, and a REST `POST /messages`
*also* fans out a `message:new` to every participant. So the client sends via
REST only (optimistic insert → reconcile with the response) and treats every
socket `message:new` as an echo that's deduped by `id`. Emitting
`message:send` in addition would double-post.

### 1.9 New phone auto-registers on login

`POST /auth/login` with an unknown phone silently creates the account and
returns `200` (not `201`). Matches the brief; noted for completeness.

---

## 2. Features in the Designs with No API Support

Kept the UI honest — where the backend can't back a feature, it's omitted
rather than faked.

| Design shows | Status | Reason |
| --- | --- | --- |
| Online / offline presence dots | Decorative only | No presence endpoint or socket event |
| "X is typing…" | Omitted | No typing socket event (`message:new` / `conversation:updated` only) |
| Read receipts (✓✓) | Omitted | No read-state API |
| Shared files / links side panel | Omitted | No API for it |
| Profile "About me", avatar upload, edit profile | Read-only profile | No profile-write endpoint |
| Group photo & description (`create group` / `edit group` designs) | Omitted | `POST /conversations/group` takes only `{ name, participantIds }`; no update-description endpoint |
| Demote an admin | Omitted | Only `POST /conversations/:id/admins` (promote) exists — no demote |
| Set status / Settings (user menu) | Removed from menu | No API |
| Pinned messages | Omitted | No API |
| Call buttons | Omitted | Out of scope |

---

## 3. Engineering Challenges & How They Were Handled

### 3.1 Two loading models, one skeleton system

Auth-gate restore, route transitions, list/message/panel loads all need a
loading state. Rather than spinners, every one is a **skeleton shaped like the
real content** (`ChatShellSkeleton`, `ConversationListSkeleton`,
`MessageListSkeleton`, `UserListSkeleton`, `DetailsPanelSkeleton`). No
`animate-spin` anywhere; buttons show pulsing dots.

### 3.2 Server state vs client state boundary

- **RTK Query** owns everything server-owned: conversations, messages, user
  search, `/auth/me`. Caching, dedup, tag invalidation come for free.
- **Redux slices** own only UI state: `activeConversationId`, socket status,
  unread counts, details-panel open, conversation filter.
- No server data is copied into plain Redux.

### 3.3 Message cache as a single per-conversation entry

`getMessages` uses `serializeQueryArgs: conversationId` + `merge`, so paging
(`before` cursor) prepends older messages into one cache entry. This makes both
optimistic sends and (upcoming) socket events a simple `updateQueryData` patch
instead of a refetch.

### 3.4 Optimistic send + reconciliation

On send: insert a `ChatMessage` with `id: ""`, a local `tempId`, and
`status: "sending"`. On `201`, replace it by matching `tempId` and swap in the
server `id`. On failure, mark `status: "failed"` and keep it in place with a
Retry action. Dedup is always by `id`; `tempId` only bridges the optimistic gap
(`upsertMessage` in `normalizeMessage.ts`).

### 3.5 Route-driven conversation selection

`/chat/[conversationId]` is the source of truth; the slice's
`activeConversationId` is synced *from* the route, not the other way round.
Gives shareable URLs, working back-button, and a natural mobile list↔thread
navigation (`max-md:hidden` toggle on the two panels).

### 3.6 Edge middleware + client guard

JWT lives in `localStorage` (needed for the socket handshake) and is mirrored
to a non-httpOnly cookie so `proxy.ts` can gate `/chat` at the edge.
`AuthGate` is the client-side backstop (cookie disabled, token expiry) and runs
`/auth/me` to validate the session, showing the shell skeleton meanwhile.

---

## 4. "One-Step-Ahead" Extras (bonus)

- **Local avatar presets** — the API has no avatar upload, so users pick a
  colour that's persisted in `localStorage` and reflected live everywhere via a
  `useSyncExternalStore` hook (cross-tab + in-tab).
- **"New messages" pill + non-intrusive auto-scroll** — the list follows new
  messages only when you're already at the bottom; otherwise a count pill
  appears and scroll position is kept (also when prepending older pages).
- **Optimistic send with in-place retry** — a failed message stays where it is
  with a "Message failed to send / Retry" banner; no lost text.
- **Landing-page AI assistant** — a floating widget backed by
  `POST /api/assistant`, which calls Google Gemini (`gemini-flash-latest`)
  server-side. The API key lives in `GEMINI_API_KEY` (no `NEXT_PUBLIC_`), so it
  never reaches the browser. A tight system prompt scopes it to ChatFlow
  questions only. Abuse guard: in-memory per-IP rate limit
  (`src/app/api/assistant/rateLimit.ts`) — 10/min, 40/hour, `429` + `Retry-After`
  when exceeded; history capped at 12 messages, input at 2000 chars. In-memory
  is per serverless instance; a shared store (Redis/Upstash) would be the
  production choice.
- **PWA** — `manifest.webmanifest` + a hand-written service worker
  (`public/sw.js`, network-first for navigations, cache-first for assets, never
  touches `/api` or the socket) so the app installs on any device, plus a mobile
  bottom tab bar and FAB.
- **In-chat AI assistant** — a ✨ panel in the chat header with three modes,
  backed by `POST /api/chat-assist` (Gemini, server-side key, same rate limit):
  *Summarize* the thread, *Draft a reply* (drops into the composer), *Ask about
  this chat*. Plus **smart reply chips** above the composer (Gmail-style) that
  appear when the last message isn't yours — tap to send. A one-line notice
  tells the user the transcript is sent to Gemini.
- **Attachments — images, video, voice, files** — the message API is text-only,
  so attachments are uploaded to **DigitalOcean Spaces** (S3-compatible) through
  `POST /api/upload` and encoded as a compact `[[att:kind|url|name|size|meta]]`
  token inside the message text, parsed back out for rendering. Images are
  optimised server-side with **sharp** (auto-rotate from EXIF, cap 1600px,
  re-encode as WebP); every upload gets a `randomUUID` key so re-uploading the
  same file never collides. Downloads stream through `POST /api/download` with
  `Content-Disposition: attachment` (in-page, no navigation; the route only
  proxies the configured Spaces origin). Voice notes record via `MediaRecorder`
  and render with a **custom waveform player** (Web Audio API peak extraction,
  click-to-seek), not the native `<audio>` control.
- **Custom emoji picker popover** (`emoji-picker-react`, lazy-loaded on first
  open, native emoji, caret-aware insertion).
- **Landing page polish** — Lenis smooth scrolling (lazy-loaded, paused while the
  mobile menu is open), scroll-reveal without layout shift, a floating
  back-to-top, and all hero/section imagery served as pre-optimised WebP.

---

## 5. What I'd Do With More Time

- Message virtualization for very long threads (the API has no conversation-list
  pagination either — would add windowing there too).
- Real waveforms for voice notes need CORS enabled on the Spaces bucket;
  without it the player falls back to seeded bars.
- Server-side video poster/thumbnail generation (needs ffmpeg, awkward on
  serverless).
- Move the AI rate-limiter to a shared store (Upstash/Redis) so it survives
  cold starts and scales across instances.
- Proper reconnect reconciliation (refetch missed messages after a socket drop).
- Automated tests — component tests plus a small integration pass on the chat
  panel (send / receive / retry / scroll).
