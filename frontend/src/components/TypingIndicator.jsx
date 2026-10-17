export default function TypingIndicator() {
  return (
    <div className="mt-3 flex items-end gap-2" aria-hidden="true">
      <div className="w-8 shrink-0" />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-bubble-in px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-content-muted animate-blink"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
