// Thin fetch wrapper around the Express API.
// All requests use the relative `/api` prefix so the Vite dev server can
// reverse-proxy them to the backend (single exposed port in preview).

const BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // response had no JSON body
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getHealth: () => request('/health'),
  getUsers: () => request('/users'),
  getConversations: () => request('/conversations'),
  getMessages: (conversationId) => request(`/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, { senderId, text }) =>
    request(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ senderId, text })
    }),
  markRead: (conversationId) =>
    request(`/conversations/${conversationId}/read`, { method: 'POST' }),
  createConversation: (payload) =>
    request('/conversations', { method: 'POST', body: JSON.stringify(payload) })
};
