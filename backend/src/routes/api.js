import { Router } from 'express';
import * as store from '../store.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'mern-chat-backend', time: new Date().toISOString() });
});

router.get('/users', (_req, res) => {
  res.json(store.listUsers());
});

router.get('/conversations', (_req, res) => {
  res.json(store.listConversations());
});

router.post('/conversations', (req, res) => {
  const { name, participantIds, type } = req.body || {};
  if (!Array.isArray(participantIds) || participantIds.length < 2) {
    return res.status(400).json({ error: 'participantIds must contain at least two users' });
  }
  const conversation = store.createConversation({ name, participantIds, type });
  res.status(201).json(conversation);
});

router.get('/conversations/:id/messages', (req, res) => {
  const conversation = store.getConversation(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  res.json(conversation.messages);
});

router.post('/conversations/:id/messages', (req, res) => {
  const { senderId, text } = req.body || {};
  if (!senderId || !text || !text.trim()) {
    return res.status(400).json({ error: 'senderId and non-empty text are required' });
  }
  const message = store.appendMessage(req.params.id, { senderId, text });
  if (!message) return res.status(404).json({ error: 'Conversation not found' });
  res.status(201).json(message);
});

router.post('/conversations/:id/read', (req, res) => {
  const conversation = store.markConversationRead(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  res.json(conversation);
});

export default router;
