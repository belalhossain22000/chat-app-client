# ChatFlow

A real-time chat application built for the Senior Frontend Engineer take-home
assignment. One-to-one and group conversations, live delivery over WebSocket,
optimistic sending, and a chat panel built for focus — plus a creative landing
page that showcases it.

- **Chat app:** `/chat` (redirects to `/login` when signed out)
- **Landing page:** `/`

| | |
| --- | --- |
| **Live — Chat app** | _add your Vercel URL_ `/chat` |
| **Live — Landing page** | _add your Vercel URL_ `/` |
| **Repository** | https://github.com/belalhossain22000/chat-app-client |

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router, RSC) + **React 19** + TypeScript |
| Styling | **Tailwind CSS v4** with a token-based palette (`@theme` in `globals.css`) |
| Server state | **RTK Query** (`@reduxjs/toolkit`) — caching, dedup, tag invalidation |
| Client/UI state | **Redux Toolkit** slices (`auth`, `chat`) |
| Real-time | **socket.io-client** |
| Icons / toasts | `lucide-react`, `sonner` |
| Dates | `date-fns` |
| Extras | `emoji-picker-react`, `lenis` (landing smooth scroll), `sharp` + `@aws-sdk/client-s3` (attachments), Google Gemini (assistant) |

No CSS framework beyond Tailwind, no component library — the `components/ui/`
folder is a small hand-rolled design system.

---

## Getting started

**Requirements:** Node 20+.

```bash
git clone <repo-url>
cd FlowChat
npm install
cp .env.example .env      # fill in the values (see below)
npm run dev               # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

### Environment variables

Copy `.env.example` to `.env`. The chat feature only needs the first three.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | ✅ | REST base, **includes** `/api` |
| `NEXT_PUBLIC_SOCKET_URL` | ✅ | Socket.IO server, **excludes** `/api` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public origin, used for SEO/OpenGraph metadata |
| `GEMINI_API_KEY` | optional | Enables the AI assistant + smart replies (server-only, no `NEXT_PUBLIC_`). Without it those features return a graceful "not configured". |
| `DO_SPACE_ENDPOINT` | optional | DigitalOcean Spaces endpoint, e.g. `https://sfo3.digitaloceanspaces.com` |
| `DO_SPACE_ORIGIN_ENDPOINT` | optional | Public/CDN base for uploaded files |
| `DO_SPACE_BUCKET` / `DO_SPACE_ACCESS_KEY` / `DO_SPACE_SECRET_KEY` | optional | Spaces credentials for image/video/voice/file attachments |

If the Spaces vars are absent the attachment UI still renders but uploads return
a "not configured" message.

---

## Project structure

Feature-based. Related UI, API, state, types and utilities live together; shared
infrastructure is in `lib/`, shared primitives in `components/`.

```
src/
├── app/                     # routes only (compose features)
│   ├── page.tsx             # "/" landing (Server Component)
│   ├── login/               # "/login"
│   ├── chat/                # "/chat", "/chat/[conversationId]", layout, error, loading
│   └── api/                 # assistant, chat-assist, upload, download (Route Handlers)
├── components/
│   ├── ui/                  # Button, Input, Modal, Avatar, Skeleton, EmojiPicker, …
│   ├── layout/              # AppShell, SiteHeader, SiteFooter
│   └── pwa/                 # ServiceWorkerRegister
├── features/
│   ├── auth/                # login form, auth slice, token storage, edge/client guards
│   ├── chat/                # the chat panel — api/, components/, hooks/, socket/, slice/, types/, utils/
│   ├── profile/             # read-only profile + local avatar preset
│   ├── landing/             # landing sections + smooth scroll / reveal / back-to-top
│   └── pwa/                 # install prompt
├── lib/
│   ├── api/                 # baseApi (RTK Query), error middleware, parseApiError, mapId
│   ├── redux/               # store, provider, typed hooks
│   ├── env.ts               # typed, fail-fast env access
│   ├── gemini.ts            # shared server-side Gemini caller
│   └── spaces.ts            # DigitalOcean Spaces (S3) client
├── proxy.ts                 # edge auth gate for /chat (Next 16 proxy convention)
└── types/                   # shared types

docs/
├── api/                     # my own API documentation (Part 1 deliverable)
├── architecture/            # architecture write-up
├── client/                  # folder-structure rationale
├── workflow/                # implementation roadmap
└── NOTES.md                 # working notes behind the Part 3 write-up
```

**Server vs Client Components:** everything defaults to a Server Component. The
`"use client"` boundary is pushed to interactive leaves only (anything using
hooks, Redux, browser APIs or events). The landing page, its imagery, all UI
primitives and the page/layout shells render on the server; `/chat` is
client-driven because it's a live socket surface.

---

# Part 3 — Thought-process write-up

## Part 1 — architecture, libraries & trade-offs

**Next.js App Router + RSC.** The stack was fixed to React/Next. Using the App
Router lets the landing page and every static shell be a Server Component (great
for SEO and first paint) while the chat surface stays a client island. Route
handlers under `app/api/*` give a natural place for the few server-only things
this project needs (Gemini calls with a hidden key, S3 uploads, a download
proxy).

**RTK Query for server state, Redux slices for UI state.** Most of the app's
data is server-owned (conversations, messages, user search, the current user),
so RTK Query removes a lot of boilerplate — request lifecycle, caching, request
dedup, and tag-based invalidation come for free. The Redux slices hold only UI
state: `activeConversationId`, socket status, unread counts, which filter is
selected, whether the details panel is open. No server data is duplicated into
plain Redux.

*Trade-off:* RTK Query's cache/invalidation model has a learning curve, and its
`serializeQueryArgs` + `merge` API is a little fiddly. It paid off for messages
(see below).

**Messages as one cache entry per conversation.** `getMessages` uses
`serializeQueryArgs: conversationId` and a `merge` function, so cursor-paged
older messages are prepended into a single cache entry. That makes both
optimistic sends and incoming socket events a simple `updateQueryData` patch
rather than a refetch, and keeps dedup logic (always by message `id`) in one
place.

**Optimistic send + reconciliation.** On send, a `ChatMessage` with `id: ""`, a
local `tempId` and `status: "sending"` is inserted immediately. On `201` it's
replaced by matching `tempId` and the server `id` is swapped in. On failure it
stays put with `status: "failed"` and a Retry action — no lost text. Because the
backend also broadcasts a `message:new` to the sender, and a REST POST triggers
that broadcast too, the client sends over **REST only** and treats every socket
event as an echo to be deduped by `id`. Emitting `message:send` as well would
double-post.

**Real-time.** A single shared Socket.IO connection, created once auth is
available, lives in a `useSocket` hook mounted by `SocketProvider`. It routes
`message:new` into the message cache (dedup + reconcile), bumps unread counts,
and re-orders the conversation list; `conversation:updated` invalidates the list.
Listeners are cleaned up on unmount; the socket is disconnected on logout.

**Auth.** The JWT lives in `localStorage` (the socket handshake needs it in JS)
and is mirrored to a non-httpOnly cookie so `proxy.ts` can gate `/chat` at
the edge. `AuthGate` is the client-side backstop for cookie-disabled cases and
token expiry — it runs `/auth/me` to validate the session and shows the shell
skeleton meanwhile. A `401` from any request tears the session down centrally
(token, cache, socket) and redirects.

**Auto-scroll** (`useChatScroll`): the list follows new messages only when the
user is already near the bottom, or when the message is their own. If they've
scrolled up, a "N new messages" pill appears instead and scroll position is
preserved — including when older pages are prepended.

**Loading / empty / error.** Every loading state is a **skeleton shaped like the
real content** (`ChatShellSkeleton`, `ConversationListSkeleton`,
`MessageListSkeleton`, …) — no spinners anywhere; even pending buttons use
pulsing dots. Each surface has a distinct empty state and a retryable error
state.

## Part 2 — landing page design reasoning

No design file was given, so the direction is a **warm, editorial** one:
`#F7F5F0` ivory ground, charcoal type, a single **electric-coral** accent
(`#FF5A4F`) with a soft-mint support colour — deliberately not the blue/indigo
SaaS look, no purple gradients, no heavy glassmorphism. The same palette and the
same UI primitives are shared with the chat app so the two feel like one
product.

The page leads with what the feature *is* (a live chat mockup + "Conversations
that move with you"), then walks through the real capabilities: real-time
delivery, one-to-one and group chat, member management, works on every screen.
Copy is kept honest — features the backend can't support (typing indicators,
read receipts) aren't advertised; the concrete ones (WebSocket delivery,
optimistic retry, smart auto-scroll) are. It's fully responsive with a mobile
menu that locks scroll, and it's installable as a PWA.

*Small touches:* Lenis smooth scrolling (lazy-loaded so it doesn't block LCP,
and paused while the mobile menu is open), scroll-reveal that never causes
layout shift, a back-to-top button, and all imagery pre-encoded as WebP so
mobile Lighthouse stays green.

## How I used AI tools

I used an AI coding assistant throughout, in the way I would on the job:

- **Scaffolding & boilerplate** — the initial folder structure, RTK Query
  endpoint shells, Tailwind token setup, repetitive skeleton components.
- **Live API exploration** — driving `curl` against the deployed backend to
  discover the real response shapes, then writing the normalisers. Every quirk
  in the "Issues" section below was verified this way, not taken from the AI or
  the Swagger doc.
- **The API docs in `docs/api/`** — drafted with AI help from the Swagger spec,
  then corrected by hand against live behaviour.
- **Landing copy and section layout** — iterated on with AI, restructured and
  trimmed by me.
- **The AI features themselves** (assistant, smart replies) — I designed the
  server-side proxy, the token/rate-limit strategy and the prompt scoping;
  the assistant is a product feature, not a code-writing tool here.

What I changed or rejected: the AI's first instinct was to keep the JWT in a
plain client variable and call Gemini from the browser — I moved the key
server-side behind route handlers and added rate limiting. It also over-used
`"use client"`; I pushed the boundary back down to leaves. Several
"convenience" abstractions it suggested were deleted as premature.

## Issues I ran into with the API

Full detail is in `docs/NOTES.md`. In short, the deployed API and the Swagger
docs disagree in several places — all verified with live calls:

1. **`_id`, never `id`** — every entity, including nested objects. Handled by a
   recursive `mapId` normaliser applied in each endpoint's `transformResponse`.
2. **`GET /conversations` shape differs by type** — direct items carry a single
   `participant` object and no `name`/`admins`; group items carry a
   `participants` array. `POST /conversations` returns a thin id-only shape.
   Collapsed into one `Conversation` type in `normalizeConversation`.
3. **`POST /messages` wants `text`, not `content`** (the docs say `content`) —
   and the message object has `sender` as a bare id string, `conversation`
   (not `conversationId`), no `updatedAt`. Sender names are looked up from the
   conversation participants.
4. **Message history is newest-first**, and the `before` cursor must be a
   message **`_id`** — passing a timestamp returns `SERVER_ERROR`. `before` is
   also inclusive, so the merge step dedupes and stops when a page brings
   nothing new.
5. **`/users/search` uses `q` as a raw regex** — a `+` (which the phone field
   produces) returns a `500`, and matching is case-sensitive and
   prefix-anchored. Fixed client-side: escape regex metacharacters, then prefix
   `(?i)` for case-insensitivity.
6. **No phone normalisation** — `01940075782` and `+8801940075782` create two
   different accounts. The login form only prepends the dial code when the user
   hasn't already typed a `+`, `00`, or a leading `0`.
7. **Whitespace-only messages are accepted** (`201`), so the empty-message guard
   is enforced on the client.
8. **The sender receives their own `message:new`**, and REST POSTs also fan out
   a `message:new` — hence REST-only send + dedup-by-`id` on every socket event.
9. **No documented error shape** — `parseApiError` checks `message` / `error` /
   `detail` and falls back to HTTP-status text.

## What I'd do differently with more time

- Message virtualization for very long threads.
- Real voice waveforms (needs CORS on the Spaces bucket; falls back to seeded
  bars today).
- Move the AI rate-limiter to a shared store so it survives cold starts.
- Proper reconnect reconciliation — refetch messages missed during a socket
  drop.
- Automated tests: component tests plus a small integration pass on the chat
  panel (send / receive / retry / scroll).

---

## Deployment (Vercel)

1. Push to GitHub, import the repo in Vercel (framework auto-detected as
   Next.js).
2. Add the environment variables above in **Project → Settings → Environment
   Variables**. Set `NEXT_PUBLIC_SITE_URL` to the deployed URL.
3. Deploy. The landing page is `/`, the chat app is `/chat`.
