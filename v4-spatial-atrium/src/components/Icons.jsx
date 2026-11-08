import React from 'react';

// Apple-style 1.5px line icon set (SF Symbols spirit) — 0 dependencies, inherits currentColor
const PATHS = {
  cube: (
    <>
      <path d="M12 3 4.5 7.2v9.6L12 21l7.5-4.2V7.2L12 3Z" />
      <path d="M4.5 7.2 12 11.4l7.5-4.2M12 11.4V21" />
    </>
  ),
  xray: (
    <>
      <circle cx="12" cy="12" r="8.5" strokeDasharray="2.6 2.4" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  layers: (
    <>
      <path d="m12 4 8.5 4.2L12 12.4 3.5 8.2 12 4Z" />
      <path d="m3.5 12 8.5 4.2 8.5-4.2" />
      <path d="m3.5 15.8 8.5 4.2 8.5-4.2" />
    </>
  ),
  laser: (
    <>
      <path d="M4 7V5.5A1.5 1.5 0 0 1 5.5 4H7M17 4h1.5A1.5 1.5 0 0 1 20 5.5V7M20 17v1.5a1.5 1.5 0 0 1-1.5 1.5H17M7 20H5.5A1.5 1.5 0 0 1 4 18.5V17" />
      <path d="M3 12h18" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="3.8" />
      <path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5 7 7M17 17l1.5 1.5M5.5 18.5 7 17M17 7l1.5-1.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7L12 3Z" />
      <path d="M18.5 15.5 19.3 18l2.2.8-2.2.8-.8 2.4-.8-2.4-2.2-.8 2.2-.8.8-2.5Z" />
    </>
  ),
  map: (
    <>
      <path d="m3.5 6.2 5.6-2.2 5.8 2.2 5.6-2.2v13.8l-5.6 2.2-5.8-2.2-5.6 2.2V6.2Z" />
      <path d="M9.1 4v13.8M14.9 6.2V20" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.4" />
      <circle cx="8.8" cy="9.5" r="1.4" />
      <path d="m5 17.5 4.8-4.5 3.4 3.2 2.6-2.4 3.2 3.7" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
    </>
  ),
  apps: (
    <>
      <circle cx="6" cy="6" r="1.6" />
      <circle cx="12" cy="6" r="1.6" />
      <circle cx="18" cy="6" r="1.6" />
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18" cy="12" r="1.6" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="12" cy="18" r="1.6" />
      <circle cx="18" cy="18" r="1.6" />
    </>
  ),
  arrowUpRight: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  chevronRight: <path d="m9.5 6 6 6-6 6" />,
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  phone: (
    <path d="M6.6 3.8h2.6l1.4 4-1.9 1.3a11.5 11.5 0 0 0 6.2 6.2l1.3-1.9 4 1.4v2.6a1.9 1.9 0 0 1-2 1.9A15.6 15.6 0 0 1 4.7 5.8a1.9 1.9 0 0 1 1.9-2Z" />
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" />
      <path d="m4.2 7 7.8 6 7.8-6" />
    </>
  ),
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5S9.6 5.9 12 3.5Z" />
    </>
  ),
};

export const FX_ICON = {
  auto: 'cube',
  xray: 'xray',
  explode: 'layers',
  laser: 'laser',
  solar: 'sun',
};

export default function Icon({ name, size = 18, className = '' }) {
  const glyph = PATHS[name];
  if (!glyph) return null;
  return (
    <svg
      className={`ui-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}
