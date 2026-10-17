// Seed dataset for the chat application.
// The shape mirrors the MongoDB collections (users, conversations, messages)
// so the in-memory store can be swapped for Mongoose models without API changes.

export const seedUsers = [
  { id: 'u_self', name: 'Jordan Lee', handle: '@jordan', avatarColor: '#2563EB', status: 'online', lastSeen: null },
  { id: 'u_ava', name: 'Ava Mitchell', handle: '@ava', avatarColor: '#7C3AED', status: 'online', lastSeen: null },
  { id: 'u_liam', name: 'Liam Chen', handle: '@liam', avatarColor: '#059669', status: 'offline', lastSeen: '2026-10-15T02:10:00.000Z' },
  { id: 'u_sofia', name: 'Sofia Rossi', handle: '@sofia', avatarColor: '#DB2777', status: 'online', lastSeen: null },
  { id: 'u_noah', name: 'Noah Williams', handle: '@noah', avatarColor: '#EA580C', status: 'offline', lastSeen: '2026-10-14T19:45:00.000Z' },
  { id: 'u_mia', name: 'Mia Patel', handle: '@mia', avatarColor: '#0891B2', status: 'online', lastSeen: null },
  { id: 'u_ethan', name: 'Ethan Brooks', handle: '@ethan', avatarColor: '#4F46E5', status: 'offline', lastSeen: '2026-10-13T08:20:00.000Z' }
];

const now = Date.now();
const minutesAgo = (m) => new Date(now - m * 60 * 1000).toISOString();

export const seedConversations = [
  {
    id: 'c_ava',
    type: 'dm',
    participantIds: ['u_self', 'u_ava'],
    messages: [
      { id: 'm1', senderId: 'u_ava', text: 'Hey! Are we still on for the design review at 3?', createdAt: minutesAgo(96), status: 'read' },
      { id: 'm2', senderId: 'u_self', text: 'Yep, I will bring the new messaging prototype.', createdAt: minutesAgo(94), status: 'read' },
      { id: 'm3', senderId: 'u_ava', text: 'Perfect. I love the direction so far.', createdAt: minutesAgo(92), status: 'read' },
      { id: 'm4', senderId: 'u_ava', text: 'Can you share the Figma link before we meet?', createdAt: minutesAgo(8), status: 'delivered' }
    ]
  },
  {
    id: 'c_team',
    type: 'group',
    name: 'Product Team',
    participantIds: ['u_self', 'u_liam', 'u_sofia', 'u_noah'],
    messages: [
      { id: 'g1', senderId: 'u_liam', text: 'Standup notes are in the doc, nothing blocking.', createdAt: minutesAgo(180), status: 'read' },
      { id: 'g2', senderId: 'u_sofia', text: 'Shipping the realtime notifications today.', createdAt: minutesAgo(60), status: 'read' },
      { id: 'g3', senderId: 'u_noah', text: 'Nice. I will QA the read receipts after lunch.', createdAt: minutesAgo(42), status: 'delivered' }
    ]
  },
  {
    id: 'c_sofia',
    type: 'dm',
    participantIds: ['u_self', 'u_sofia'],
    messages: [
      { id: 's1', senderId: 'u_self', text: 'Sofia, the socket reconnect logic is much smoother now.', createdAt: minutesAgo(300), status: 'read' },
      { id: 's2', senderId: 'u_sofia', text: 'Great to hear. Any dropped messages under load?', createdAt: minutesAgo(290), status: 'read' }
    ]
  },
  {
    id: 'c_mia',
    type: 'dm',
    participantIds: ['u_self', 'u_mia'],
    messages: [
      { id: 'mi1', senderId: 'u_mia', text: 'Do you have five minutes to look at the empty states?', createdAt: minutesAgo(1440), status: 'read' },
      { id: 'mi2', senderId: 'u_self', text: 'Sure, send them over.', createdAt: minutesAgo(1430), status: 'read' }
    ]
  },
  {
    id: 'c_design',
    type: 'group',
    name: 'Design Guild',
    participantIds: ['u_self', 'u_ava', 'u_mia', 'u_ethan'],
    messages: [
      { id: 'd1', senderId: 'u_ethan', text: 'New type scale proposal is up for comments.', createdAt: minutesAgo(2880), status: 'read' },
      { id: 'd2', senderId: 'u_mia', text: 'Love the tighter line-height on body copy.', createdAt: minutesAgo(2870), status: 'read' }
    ]
  }
];

export const seedReplies = [
  'Got it, thanks!',
  'Sounds good to me.',
  'Let me take a look and get back to you.',
  'That works. Talk soon.',
  'Nice work on this.',
  'Can you send that over when you get a chance?'
];
