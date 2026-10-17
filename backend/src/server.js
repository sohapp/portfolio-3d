import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import apiRoutes from './routes/api.js';
import * as store from './store.js';
import { seedReplies } from './data/seed.js';

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use('/api', apiRoutes);

app.use((err, _req, res, _next) => {
  console.error('[api]', err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_ORIGIN, methods: ['GET', 'POST'] }
});

const onlineUsers = new Set();

function broadcastOnline() {
  io.emit('presence:update', [...onlineUsers]);
}

io.on('connection', (socket) => {
  socket.on('user:join', (userId) => {
    if (!userId) return;
    socket.data.userId = userId;
    onlineUsers.add(userId);
    store.setUserStatus(userId, 'online');
    broadcastOnline();
  });

  socket.on('message:send', ({ conversationId, senderId, text }) => {
    if (!conversationId || !senderId || !text || !text.trim()) return;
    const message = store.appendMessage(conversationId, { senderId, text });
    if (!message) return;
    io.emit('message:new', { conversationId, message });

    // Simulate a peer replying so the realtime experience is visible in preview.
    const conversation = store.getConversation(conversationId);
    const peerId = conversation?.participantIds.find((id) => id !== senderId);
    if (peerId) {
      const replyText = seedReplies[Math.floor(Math.random() * seedReplies.length)];
      io.emit('typing:start', { conversationId, userId: peerId });
      setTimeout(() => {
        io.emit('typing:stop', { conversationId, userId: peerId });
        const reply = store.appendMessage(conversationId, { senderId: peerId, text: replyText });
        if (reply) io.emit('message:new', { conversationId, message: reply });
      }, 1200);
    }
  });

  socket.on('typing:start', ({ conversationId, userId }) => {
    socket.broadcast.emit('typing:start', { conversationId, userId });
  });

  socket.on('typing:stop', ({ conversationId, userId }) => {
    socket.broadcast.emit('typing:stop', { conversationId, userId });
  });

  socket.on('disconnect', () => {
    const userId = socket.data.userId;
    if (userId) {
      onlineUsers.delete(userId);
      store.setUserStatus(userId, 'offline');
      broadcastOnline();
    }
  });
});

server.listen(PORT, () => {
  console.log(`[server] MERN chat API listening on http://localhost:${PORT}`);
});
