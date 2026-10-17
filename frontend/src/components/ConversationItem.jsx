import { Check, CheckCheck } from 'lucide-react';
import Avatar from './Avatar.jsx';
import { formatRelative } from '../lib/format.js';

export default function ConversationItem({
  meta,
  last,
  isActive,
  unreadCount,
  isTyping,
  isOwnLast,
  onSelect
}) {
  const preview = isTyping
    ? 'typing...'
    : last
      ? `${isOwnLast ? 'You: ' : ''}${last.text}`
      : 'No messages yet';

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={isActive ? 'true' : undefined}
        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 cursor-pointer ${
          isActive ? 'bg-primary/10' : 'hover:bg-surface-hover'
        }`}
      >
        <Avatar
          name={meta.avatarName}
          color={meta.avatarColor}
          showStatus={!meta.isGroup}
          online={meta.online}
        />

        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span
              className={`truncate text-sm ${
                isActive ? 'font-semibold text-primary' : 'font-medium text-content'
              }`}
            >
              {meta.title}
            </span>
            {last && !isTyping && (
              <span className="shrink-0 text-2xs text-content-faint tabular-nums">
                {formatRelative(last.createdAt)}
              </span>
            )}
          </span>

          <span className="mt-0.5 flex items-center justify-between gap-2">
            <span
              className={`flex min-w-0 items-center gap-1 truncate text-xs ${
                isTyping ? 'font-medium text-primary' : 'text-content-muted'
              }`}
            >
              {!isTyping && isOwnLast && last && (
                <StatusTick status={last.status} />
              )}
              <span className="truncate">{preview}</span>
            </span>

            {unreadCount > 0 && (
              <span
                className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-2xs font-semibold text-primary-foreground"
                aria-label={`${unreadCount} unread messages`}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </span>
        </span>
      </button>
    </li>
  );
}

function StatusTick({ status }) {
  if (status === 'read') {
    return <CheckCheck size={14} className="shrink-0 text-primary" aria-label="Read" />;
  }
  if (status === 'delivered') {
    return <CheckCheck size={14} className="shrink-0 text-content-faint" aria-label="Delivered" />;
  }
  return <Check size={14} className="shrink-0 text-content-faint" aria-label="Sent" />;
}
