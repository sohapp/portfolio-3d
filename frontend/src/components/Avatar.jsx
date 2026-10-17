import { initials } from '../lib/format.js';

const SIZES = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-12 w-12 text-base'
};

const DOT_SIZES = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-3.5 w-3.5'
};

export default function Avatar({ name, color = '#2563EB', size = 'md', online = false, showStatus = false }) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={`inline-flex items-center justify-center rounded-full font-semibold text-white select-none ${SIZES[size]}`}
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {initials(name)}
      </span>
      {showStatus && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-surface ${DOT_SIZES[size]} ${
            online ? 'bg-online' : 'bg-content-faint'
          }`}
          role="img"
          aria-label={online ? `${name} is online` : `${name} is offline`}
        />
      )}
    </span>
  );
}
