import { MessageSquareDashed } from 'lucide-react';

export default function NoConversationSelected({ onOpenFirst }) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center bg-surface px-8 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <MessageSquareDashed size={30} aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-display text-lg font-semibold">Pick a conversation</h2>
      <p className="mt-2 max-w-xs text-sm text-content-muted">
        Select a chat on the left to read and reply. Your messages stay in sync in realtime.
      </p>
      <button
        type="button"
        onClick={onOpenFirst}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary-hover cursor-pointer"
      >
        Open most recent chat
      </button>
    </div>
  );
}
