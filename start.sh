#!/usr/bin/env bash
set -euo pipefail

# Start the Express + Socket.IO API in the background.
# The Vite dev server (foreground) reverse-proxies /api and /socket.io to it.
cd "$(dirname "$0")/backend"
if [ ! -d node_modules ]; then
  npm install
fi
npm run dev &
BACKEND_PID=$!

# Ensure the API is stopped when the frontend exits.
trap 'kill "$BACKEND_PID" 2>/dev/null || true' EXIT

# Start the React frontend on the exposed preview port.
cd ../frontend
if [ ! -d node_modules ]; then
  npm install
fi
npm run dev
