import { WifiOff } from 'lucide-react';
import ChatHeader from './ChatHeader.jsx';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';
import { getConversationMeta } from '../lib/conversations.js';

export default function ChatWindow({
  conversation,
  currentUserId,
  usersById,
  typingUserIds,
  onlineIds,
  connected,
  loading,
  onBack,
  onSend,
  onTyping
}) {
  const meta = getConversationMeta(conversation, currentUserId, usersById);
  const liveMeta = {
    ...meta,
    online: meta.isGroup ? false : onlineIds.includes(meta.peer?.id)
  };

  const typingNames = typingUserIds
    .map((id) => usersById[id]?.name?.split(' ')[0])
    .filter(Boolean);

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col bg-surface" aria-label={meta.title}>
      <ChatHeader meta={liveMeta} typingNames={typingNames} onBack={onBack} />
      {!connected && (
        <div
          className="flex items-center justify-center gap-2 bg-content-muted/10 px-4 py-2 text-xs font-medium text-content-muted"
          role="status"
        >
          <WifiOff size={14} aria-hidden="true" />
          Reconnecting to the server...
        </div>
      )}
      <MessageList
        conversationId={conversation.id}
        messages={conversation.messages}
        currentUserId={currentUserId}
        usersById={usersById}
        isGroup={meta.isGroup}
        typingNames={typingNames}
        loading={loading}
      />
      <MessageInput
        onSend={(text) => onSend(conversation.id, text)}
        onTyping={(isTyping) => onTyping(conversation.id, isTyping)}
        disabled={!connected}
      />
    </section>
  );
}
