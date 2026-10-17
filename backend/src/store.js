import { seedUsers, seedConversations } from './data/seed.js';

// ---------------------------------------------------------------------------
// In-memory data layer.
//
// This module exposes a small repository API (listUsers, listConversations,
// appendMessage, ...). In a full MERN deployment each function maps 1:1 to a
// Mongoose query against the `users`, `conversations` and `messages`
// collections, so swapping the implementation does not touch the routes.
// ---------------------------------------------------------------------------

const users = new Map();
const conversations = new Map();

let messageSeq = 0;
const nextId = (prefix) => `${prefix}_${Date.now().toString(36)}_${(messageSeq += 1)}`;

function hydrate() {
  users.clear();
  conversations.clear();
  for (const user of seedUsers) users.set(user.id, { ...user });
  for (const convo of seedConversations) {
    conversations.set(convo.id, {
      ...convo,
      participantIds: [...convo.participantIds],
      messages: convo.messages.map((m) => ({ ...m }))
    });
  }
}

hydrate();

export function listUsers() {
  return [...users.values()];
}

export function getUser(id) {
  return users.get(id) || null;
}

export function listConversations() {
  return [...conversations.values()];
}

export function getConversation(id) {
  return conversations.get(id) || null;
}

export function createConversation({ name, participantIds, type = 'dm' }) {
  const id = nextId('c');
  const conversation = {
    id,
    type,
    name: name || null,
    participantIds: [...participantIds],
    messages: []
  };
  conversations.set(id, conversation);
  return conversation;
}

export function appendMessage(conversationId, { senderId, text }) {
  const conversation = conversations.get(conversationId);
  if (!conversation) return null;
  const message = {
    id: nextId('m'),
    senderId,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    status: 'sent'
  };
  conversation.messages.push(message);
  return message;
}

export function markConversationRead(conversationId) {
  const conversation = conversations.get(conversationId);
  if (!conversation) return null;
  for (const message of conversation.messages) message.status = 'read';
  return conversation;
}

export function setUserStatus(userId, status) {
  const user = users.get(userId);
  if (!user) return null;
  user.status = status;
  user.lastSeen = status === 'online' ? null : new Date().toISOString();
  return user;
}

export function resetStore() {
  hydrate();
}
