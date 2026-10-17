import { ArrowLeft, Info, Phone, Video } from 'lucide-react';
import Avatar from './Avatar.jsx';
import { formatLastSeen } from '../lib/format.js';

export default function ChatHeader({ meta, typingNames, onBack }) {
  let subtitle;
  if (typingNames.length > 0) {
    subtitle =
      typingNames.length === 1
        ? `${typingNames[0]} is typing...`
        : `${typingNames.length} people are typing...`;
  } else if (meta.isGroup) {
    subtitle = meta.subtitle || `${meta.members.length} members`;
  } else if (meta.online) {
    subtitle = 'Active now';
  } else {
    subtitle = formatLastSeen(meta.peer?.lastSeen);
  }

  const isTyping = typingNames.length > 0;

  return (
    <header className="flex items-center gap-3 border-b border-line bg-surface/90 px-3 py-3 backdrop-blur sm:px-5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to conversations"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-content-muted transition-colors duration-200 hover:bg-surface-hover hover:text-content lg:hidden cursor-pointer"
      >
        <ArrowLeft size={20} aria-hidden="true" />
      </button>

      <Avatar
        name={meta.avatarName}
        color={meta.avatarColor}
        showStatus={!meta.isGroup}
        online={meta.online}
      />

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-display text-base font-semibold leading-tight">
          {meta.title}
        </h2>
        <p
          className={`truncate text-xs ${
            isTyping ? 'font-medium text-primary' : meta.online && !meta.isGroup ? 'text-online' : 'text-content-muted'
          }`}
          aria-live="polite"
        >
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <IconButton label="Voice call">
          <Phone size={18} aria-hidden="true" />
        </IconButton>
        <IconButton label="Video call">
          <Video size={18} aria-hidden="true" />
        </IconButton>
        <IconButton label="Conversation details">
          <Info size={18} aria-hidden="true" />
        </IconButton>
      </div>
    </header>
  );
}

function IconButton({ label, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-content-muted transition-colors duration-200 hover:bg-surface-hover hover:text-content cursor-pointer"
    >
      {children}
    </button>
  );
}
