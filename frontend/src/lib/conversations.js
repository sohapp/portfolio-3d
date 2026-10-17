export function buildUserIndex(users) {
  return users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});
}

export function getConversationMeta(conversation, currentUserId, usersById) {
  const others = conversation.participantIds
    .filter((id) => id !== currentUserId)
    .map((id) => usersById[id])
    .filter(Boolean);

  if (conversation.type === 'group') {
    const title = conversation.name || 'Group chat';
    const subtitle = others.map((u) => u.name.split(' ')[0]).join(', ');
    return {
      title,
      subtitle,
      avatarName: title,
      avatarColor: '#4F46E5',
      online: false,
      isGroup: true,
      members: others
    };
  }

  const peer = others[0] || { name: 'Unknown', avatarColor: '#64748B', status: 'offline' };
  return {
    title: peer.name,
    subtitle: peer.handle || '',
    avatarName: peer.name,
    avatarColor: peer.avatarColor,
    online: peer.status === 'online',
    isGroup: false,
    peer
  };
}

export function lastMessage(conversation) {
  return conversation.messages[conversation.messages.length - 1] || null;
}
