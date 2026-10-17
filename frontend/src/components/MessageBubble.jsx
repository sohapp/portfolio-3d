import { Check, CheckCheck } from 'lucide-react';
import Avatar from './Avatar.jsx';
import { formatTime } from '../lib/format.js';

export default function MessageBubble({ message, isOwn, sender, showAvatar, isGrouped, showSenderName }) {
  return (
    <div
      className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} ${
        isGrouped ? 'mt-0.5' : 'mt-3'
      }`}
    >
      <div className="w-8 shrink-0">
        {!isOwn && showAvatar && sender && (
          <Avatar name={sender.name} color={sender.avatarColor} size="sm" />
        )}
      </div>

      <div className={`flex max-w-[78%] flex-col sm:max-w-[68%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && isGrouped === false && showSenderName && sender && (
          <span className="mb-1 px-1 text-2xs font-medium text-content-muted">{sender.name}</span>
        )}

        <div
          className={`animate-scale-in rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-bubble ${
            isOwn
              ? 'bg-bubble-out text-bubble-out-fg rounded-br-md'
              : 'bg-bubble-in text-bubble-in-fg rounded-bl-md'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>

        <span
          className={`mt-1 flex items-center gap-1 px-1 text-2xs text-content-faint ${
            isOwn ? 'flex-row-reverse' : ''
          }`}
        >
          <time className="tabular-nums" dateTime={message.createdAt}>
            {formatTime(message.createdAt)}
          </time>
          {isOwn && <StatusTick status={message.status} />}
        </span>
      </div>
    </div>
  );
}

function StatusTick({ status }) {
  if (status === 'read') return <CheckCheck size={13} className="text-primary" aria-label="Read" />;
  if (status === 'delivered') {
    return <CheckCheck size={13} className="text-content-faint" aria-label="Delivered" />;
  }
  return <Check size={13} className="text-content-faint" aria-label="Sent" />;
}
