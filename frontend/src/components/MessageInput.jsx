import { useEffect, useRef, useState } from 'react';
import { Paperclip, SendHorizontal, Smile } from 'lucide-react';

export default function MessageInput({ onSend, onTyping, disabled }) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeout = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [value]);

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout.current);
      if (isTypingRef.current) onTyping(false);
    };
  }, [onTyping]);

  const stopTyping = () => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTyping(false);
    }
    clearTimeout(typingTimeout.current);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTyping(true);
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(stopTyping, 1500);
  };

  const submit = async () => {
    const text = value.trim();
    if (!text || sending || disabled) return;
    setSending(true);
    stopTyping();
    try {
      await onSend(text);
      setValue('');
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const canSend = value.trim().length > 0 && !sending && !disabled;

  return (
    <div className="border-t border-line bg-surface px-3 py-3 safe-bottom sm:px-5">
      <div className="flex items-end gap-2">
        <div className="flex-1 rounded-2xl border border-line bg-surface-muted px-2 focus-within:border-primary transition-colors duration-200">
          <div className="flex items-end gap-1">
            <button
              type="button"
              aria-label="Add emoji"
              title="Emoji"
              className="mb-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-content-muted transition-colors duration-200 hover:bg-surface-hover hover:text-content cursor-pointer"
            >
              <Smile size={19} aria-hidden="true" />
            </button>

            <label htmlFor="message-input" className="sr-only">
              Message
            </label>
            <textarea
              id="message-input"
              ref={textareaRef}
              rows={1}
              value={value}
              disabled={disabled}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={stopTyping}
              placeholder="Write a message..."
              className="max-h-36 flex-1 resize-none bg-transparent py-2.5 text-sm leading-relaxed text-content placeholder:text-content-faint focus:outline-none disabled:opacity-50"
              style={{ touchAction: 'manipulation' }}
            />

            <button
              type="button"
              aria-label="Attach file"
              title="Attach"
              className="mb-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-content-muted transition-colors duration-200 hover:bg-surface-hover hover:text-content cursor-pointer"
            >
              <Paperclip size={19} aria-hidden="true" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label="Send message"
          className="mb-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          {sending ? (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
              aria-hidden="true"
            />
          ) : (
            <SendHorizontal size={19} aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="mt-1.5 hidden pl-3 text-2xs text-content-faint sm:block">
        Press <kbd className="rounded bg-surface-muted px-1">Enter</kbd> to send,{' '}
        <kbd className="rounded bg-surface-muted px-1">Shift</kbd>+
        <kbd className="rounded bg-surface-muted px-1">Enter</kbd> for a new line.
      </p>
    </div>
  );
}
