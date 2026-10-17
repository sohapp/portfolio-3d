import { useState } from 'react';
import { MessageSquareDashed, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const HIGHLIGHTS = [
  { icon: Zap, title: 'Realtime by default', text: 'Messages, typing and presence stream instantly.' },
  { icon: ShieldCheck, title: 'Read receipts', text: 'Know when your message is delivered and seen.' },
  { icon: MessageSquareDashed, title: 'Every device', text: 'One responsive layout for mobile, tablet and desktop.' }
];

export default function LoginScreen() {
  const { users, status, login } = useAuth();
  const [selected, setSelected] = useState(null);

  const selectableUsers = users;

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">C</span>
            Chatly
          </div>
          <h1 className="mt-16 max-w-md font-display text-5xl font-semibold leading-[1.05] tracking-tight">
            Conversations that feel instant.
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-white/80">
            A realtime messaging experience built with MongoDB, Express, React and Node.
          </p>
        </div>
        <ul className="relative mt-12 space-y-5">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-medium">{title}</span>
                <span className="block text-sm text-white/75">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-lg font-semibold lg:invisible">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">C</span>
            Chatly
          </div>
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Choose a profile</h2>
          <p className="mt-2 text-sm text-content-muted">
            Pick who you want to sign in as. No password needed for this demo.
          </p>

          <div className="mt-8 space-y-2" role="listbox" aria-label="Available profiles">
            {status === 'loading' &&
              [0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-line p-3">
                  <div className="h-11 w-11 animate-pulse rounded-full bg-surface-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 animate-pulse rounded bg-surface-muted" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-surface-muted" />
                  </div>
                </div>
              ))}

            {status === 'error' && (
              <p className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
                Could not reach the server. Make sure the backend is running, then reload.
              </p>
            )}

            {status === 'ready' &&
              selectableUsers.map((user) => {
                const isSelected = selected === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setSelected(user.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-line hover:border-primary/40 hover:bg-surface-hover'
                    }`}
                  >
                    <Avatar name={user.name} color={user.avatarColor} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{user.name}</span>
                      <span className="block truncate text-xs text-content-muted">{user.handle}</span>
                    </span>
                  </button>
                );
              })}
          </div>

          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && login(selected)}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
          >
            Continue
          </button>
        </div>
      </section>
    </div>
  );
}
