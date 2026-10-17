import { useMemo, useState } from 'react';
import { LogOut, Pencil, Search, Wifi, WifiOff } from 'lucide-react';
import Avatar from './Avatar.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import ConversationItem from './ConversationItem.jsx';
import { getConversationMeta, lastMessage } from '../lib/conversations.js';

export default function Sidebar({
  conversations,
  usersById,
  currentUser,
  activeId,
  onSelect,
  unread,
  typing,
  connected,
  onLogout,
  className = ''
}) {
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const mapped = conversations.map((conversation) => {
      const meta = getConversationMeta(conversation, currentUser.id, usersById);
      return { conversation, meta, last: lastMessage(conversation) };
    });

    const filtered = query.trim()
      ? mapped.filter(({ meta, last }) => {
          const haystack = `${meta.title} ${meta.subtitle} ${last?.text || ''}`.toLowerCase();
          return haystack.includes(query.trim().toLowerCase());
        })
      : mapped;

    return filtered.sort((a, b) => {
      const at = a.last ? new Date(a.last.createdAt).getTime() : 0;
      const bt = b.last ? new Date(b.last.createdAt).getTime() : 0;
      return bt - at;
    });
  }, [conversations, currentUser.id, usersById, query]);

  const totalUnread = Object.values(unread).reduce((sum, n) => sum + n, 0);

  return (
    <aside
      className={`flex h-full flex-col border-r border-line bg-surface ${className}`}
      aria-label="Conversations"
    >
      <header className="flex items-center justify-between gap-2 px-4 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-sm font-semibold text-primary-foreground">
            C
          </span>
          <div>
            <p className="font-display text-base font-semibold leading-none">Chatly</p>
            <p className="mt-1 text-2xs text-content-faint">
              {totalUnread > 0 ? `${totalUnread} unread` : 'All caught up'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            aria-label="New message"
            title="New message"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-content-muted transition-colors duration-200 hover:bg-surface-hover hover:text-content cursor-pointer"
          >
            <Pencil size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="px-4 pb-2">
        <label htmlFor="conversation-search" className="sr-only">
          Search conversations
        </label>
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-faint"
          />
          <input
            id="conversation-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search messages"
            className="h-11 w-full rounded-xl border border-line bg-surface-muted pl-9 pr-3 text-sm text-content placeholder:text-content-faint transition-colors duration-200 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-2 py-1">
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-content-muted">
            {query ? `No conversations match "${query}".` : 'No conversations yet.'}
          </p>
        ) : (
          <ul className="space-y-1">
            {rows.map(({ conversation, meta, last }) => (
              <ConversationItem
                key={conversation.id}
                meta={meta}
                last={last}
                isActive={conversation.id === activeId}
                unreadCount={unread[conversation.id] || 0}
                isTyping={(typing[conversation.id] || []).length > 0}
                isOwnLast={last?.senderId === currentUser.id}
                onSelect={() => onSelect(conversation.id)}
              />
            ))}
          </ul>
        )}
      </div>

      <footer className="flex items-center gap-3 border-t border-line px-4 py-3">
        <Avatar name={currentUser.name} color={currentUser.avatarColor} size="sm" showStatus online />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{currentUser.name}</p>
          <p className="flex items-center gap-1 text-2xs text-content-faint">
            {connected ? (
              <>
                <Wifi size={12} aria-hidden="true" className="text-online" /> Connected
              </>
            ) : (
              <>
                <WifiOff size={12} aria-hidden="true" /> Reconnecting...
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Sign out"
          title="Sign out"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-content-muted transition-colors duration-200 hover:bg-surface-hover hover:text-danger cursor-pointer"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </footer>
    </aside>
  );
}
