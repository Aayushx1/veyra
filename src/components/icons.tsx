import type { ReactNode } from 'react';

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const make = (children: ReactNode) =>
  function Icon() {
    return <svg {...base}>{children}</svg>;
  };

export const IconFirst = make(
  <>
    <path d="M6 5v14" />
    <path d="M19 5 9 12l10 7z" fill="currentColor" />
  </>,
);
export const IconPrev = make(<path d="M17 5 7 12l10 7z" fill="currentColor" />);
export const IconNext = make(<path d="M7 5l10 7-10 7z" fill="currentColor" />);
export const IconLast = make(
  <>
    <path d="M18 5v14" />
    <path d="M5 5l10 7-10 7z" fill="currentColor" />
  </>,
);
export const IconPlay = make(<path d="M8 5l11 7-11 7z" fill="currentColor" />);
export const IconPause = make(
  <>
    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
  </>,
);
export const IconSun = make(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>,
);
export const IconMoon = make(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />);
export const IconShare = make(
  <>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
    <path d="M16 6l-4-4-4 4" />
    <path d="M12 2v14" />
  </>,
);
export const IconTrace = make(
  <>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8.5 6H14a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h5.5" />
  </>,
);
export const IconChart = make(
  <>
    <path d="M3 3v18h18" />
    <path d="M7 15l4-5 3 3 5-7" />
  </>,
);
export const IconCards = make(
  <>
    <rect x="3" y="6" width="14" height="14" rx="2" />
    <path d="M7 3h12a2 2 0 0 1 2 2v12" />
  </>,
);
export const IconCheck = make(<path d="M20 6 9 17l-5-5" />);
export const IconDownload = make(
  <>
    <path d="M12 3v12" />
    <path d="M7 11l5 5 5-5" />
    <path d="M5 21h14" />
  </>,
);

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="vg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#vg)" />
      <path
        d="M8 10l8 13 8-13"
        fill="none"
        stroke="var(--accent-ink)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="23" r="2.2" fill="var(--accent-ink)" />
    </svg>
  );
}

export const IconCoffee = make(
  <>
    <path d="M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
    <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M8 3v2M12 3v2" />
  </>,
);
