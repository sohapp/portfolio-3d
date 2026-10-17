# Chatly - Realtime Chat App (MERN)

A realtime messaging application with a React (Vite + Tailwind) frontend and an
Express + Socket.IO API. The data layer mirrors a MongoDB document model and can
be swapped for Mongoose without changing the HTTP or socket contracts.

## Features

- Realtime messages, typing indicators and online presence over Socket.IO
- Conversation list with search, unread badges and last-message previews
- Group and direct conversations with day separators and message grouping
- Read receipts (sent / delivered / read) and "scroll to latest"
- Responsive layout: two-pane on desktop, list-to-chat switch on mobile
- Light and dark themes driven by semantic design tokens
- Accessibility: keyboard support, focus rings, aria labels, reduced-motion

## Project structure

```
backend/                 Express + Socket.IO API
  src/server.js          HTTP + socket server and event handlers
  src/routes/api.js      REST endpoints (/api/...)
  src/store.js           Mongo-shaped data layer (in-memory by default)
  src/data/seed.js       Users, conversations and messages
frontend/                React (Vite) + Tailwind client
  src/hooks/useChat.js   REST + Socket.IO state for the chat session
  src/components/        UI components
  src/context/           Auth and theme providers
  vite.config.js         Reverse proxy to the backend
start.sh                 Runs both services together
```

## Requirements

- Node.js 18+ (Node 22 recommended)
- npm 9+

## Install

Install everything from the project root (the `postinstall` script also installs
the `backend` and `frontend` dependencies):

```bash
npm install
```

## Run

Start the API and the frontend together:

```bash
npm run dev
```

Then open the frontend at `http://localhost:5173`.

- Frontend (exposed preview port): `http://localhost:5173`
- Backend API: `http://localhost:3001`

You can also run the services separately:

```bash
# Terminal 1 - API
npm run dev --prefix backend

# Terminal 2 - frontend
npm run dev --prefix frontend
```

Or use the helper script:

```bash
./start.sh
```

## How the two services connect

The preview environment exposes a single port, so the Vite dev server reverse
proxies backend traffic. Requests to `/api/*` and the `/socket.io` websocket are
forwarded to `http://localhost:3001` (configurable with the `BACKEND_URL`
environment variable). The client therefore always calls relative `/api` paths
and creates the socket against the current origin.

## REST API

| Method | Path                              | Description                     |
| ------ | --------------------------------- | ------------------------------- |
| GET    | `/api/health`                     | Service health check            |
| GET    | `/api/users`                      | List users                      |
| GET    | `/api/conversations`              | List conversations with messages|
| POST   | `/api/conversations`              | Create a conversation           |
| GET    | `/api/conversations/:id/messages` | List messages in a conversation |
| POST   | `/api/conversations/:id/messages` | Send a message                  |
| POST   | `/api/conversations/:id/read`     | Mark a conversation as read     |

## Socket.IO events

| Direction       | Event             | Payload                                   |
| --------------- | ----------------- | ----------------------------------------- |
| client → server | `user:join`       | `userId`                                  |
| client → server | `message:send`    | `{ conversationId, senderId, text }`      |
| client → server | `typing:start`    | `{ conversationId, userId }`              |
| client → server | `typing:stop`     | `{ conversationId, userId }`              |
| server → client | `message:new`     | `{ conversationId, message }`             |
| server → client | `typing:start`    | `{ conversationId, userId }`              |
| server → client | `typing:stop`     | `{ conversationId, userId }`              |
| server → client | `presence:update` | `userId[]` (currently online)             |

## Switching to MongoDB

`backend/src/store.js` exposes a small repository API (`listConversations`,
`appendMessage`, `setUserStatus`, ...). To use MongoDB, replace those functions
with Mongoose queries against `users`, `conversations` and `messages`
collections and set `MONGODB_URI`; no route or client changes are required.

## Scripts

| Command              | Location | Purpose                        |
| -------------------- | -------- | ------------------------------ |
| `npm run dev`        | root     | Run API + frontend together    |
| `npm run build`      | root     | Production build of frontend   |
| `npm run lint`       | root     | Lint the frontend              |
| `npm run dev`        | backend  | API with file watching         |
| `npm run dev`        | frontend | Vite dev server                |
