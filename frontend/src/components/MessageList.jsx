import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import { formatDayLabel } from '../lib/format.js';

const GROUP_WINDOW_MS = 5 * 60 * 1000;

function sameDay(a, b) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export default function MessageList({
  conversationId,
  messages,
  currentUserId,
  usersById,
  isGroup,
  typingNames,
  loading
}) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);

  useEffect(() => {
    setAtBottom(true);
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [conversationId, loading]);

  useLayoutEffect(() => {
    if (atBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages.length, typingNames.length, atBottom]);

  const handleScroll = (event) => {
    const el = event.currentTarget;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(distance < 80);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setAtBottom(true);
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 overflow-hidden px-4 py-6" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`h-12 animate-pulse rounded-2xl bg-surface-muted ${
                i % 2 ? 'w-2/5' : 'w-3/5'
              }`}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="scrollbar-thin h-full overflow-y-auto px-3 pb-4 pt-2 sm:px-6"
        role="log"
        aria-label="Message history"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-base font-semibold">No messages yet</p>
            <p className="mt-1 max-w-xs text-sm text-content-muted">
              Say hello to start the conversation. Messages appear here in realtime.
            </p>
          </div>
        )}

        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const isOwn = message.senderId === currentUserId;
          const isNewDay = !previous || !sameDay(previous.createdAt, message.createdAt);
          const startedNewGroup =
            isNewDay ||
            !previous ||
            previous.senderId !== message.senderId ||
            new Date(message.createdAt) - new Date(previous.createdAt) > GROUP_WINDOW_MS;
          const next = messages[index + 1];
          const isLastInGroup =
            !next ||
            next.senderId !== message.senderId ||
            new Date(next.createdAt) - new Date(message.createdAt) > GROUP_WINDOW_MS ||
            !sameDay(next.createdAt, message.createdAt);

          return (
            <div key={message.id}>
              {isNewDay && (
                <div className="my-5 flex items-center justify-center">
                  <span className="rounded-full bg-surface-muted px-3 py-1 text-2xs font-medium text-content-muted">
                    {formatDayLabel(message.createdAt)}
                  </span>
                </div>
              )}
              <MessageBubble
                message={message}
                isOwn={isOwn}
                sender={usersById[message.senderId]}
                showAvatar={isLastInGroup}
                isGrouped={!startedNewGroup}
                showSenderName={isGroup && startedNewGroup}
              />
            </div>
          );
        })}

        {typingNames.length > 0 && <TypingIndicator />}
        <div ref={bottomRef} className="h-1" />
      </div>

      {!atBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Scroll to latest messages"
          className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-content shadow-panel transition-transform duration-200 hover:scale-105 cursor-pointer"
        >
          <ChevronDown size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
