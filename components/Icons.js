const actionProps = {
  width: 30,
  height: 30,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true'
};

// Ikon cadangan untuk tombol menu (dipakai kalau iconUrl kosong).
export function ActionIcon({ name }) {
  switch (name) {
    case 'discord':
      return (
        <svg {...actionProps}>
          <path d="M8.5 8.2A7.7 7.7 0 0 1 12 7.4a7.7 7.7 0 0 1 3.5.8" />
          <path d="M6.8 17.2c1.5 1.1 3.3 1.7 5.2 1.7s3.7-.6 5.2-1.7c.6-2.1.7-4.8.1-7.2-1.2-.8-2.4-1.2-3.8-1.4l-.5 1.1c-.7-.1-1.4-.1-2.1 0l-.5-1.1c-1.4.2-2.6.6-3.8 1.4-.6 2.4-.5 5.1.2 7.2Z" />
          <path d="M9.4 13.9h.1M14.5 13.9h.1" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...actionProps}>
          <path d="M20 11.6a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.6Z" />
          <path d="M9 9.2c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.5 1.2c.1.2.1.4-.1.6l-.5.6c.5.9 1.2 1.6 2.1 2.1l.6-.5c.2-.2.4-.2.6-.1l1.2.5c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-1 .4-2.4-.1-3.8-1.3-1.4-1.2-2.5-2.5-2.2-4.7Z" />
        </svg>
      );
    case 'users':
      return (
        <svg {...actionProps}>
          <path d="M16 20v-1.4a3.6 3.6 0 0 0-3.6-3.6H7.6A3.6 3.6 0 0 0 4 18.6V20" />
          <circle cx="10" cy="8" r="3" />
          <path d="M16 11a3 3 0 0 0 0-6M20 20v-1.4a3.6 3.6 0 0 0-2.7-3.5" />
        </svg>
      );
    case 'network':
      return (
        <svg {...actionProps}>
          <circle cx="12" cy="5" r="2.2" />
          <circle cx="5" cy="18" r="2.2" />
          <circle cx="19" cy="18" r="2.2" />
          <path d="M10.8 6.9 6.2 16M13.2 6.9l4.6 9M7.2 18h9.6" />
        </svg>
      );
    case 'play':
      return (
        <svg {...actionProps} fill="currentColor" stroke="none">
          <path d="m9 6.5 9 5.5-9 5.5v-11Z" />
        </svg>
      );
    case 'video':
      return (
        <svg {...actionProps}>
          <rect x="3" y="5" width="13" height="14" rx="2" />
          <path d="m16 10 5-3v10l-5-3" />
        </svg>
      );
    default:
      return (
        <svg {...actionProps}>
          <path d="M10 13.8a4 4 0 0 0 5.7.2l2-2a4 4 0 0 0-5.7-5.7l-1.1 1.1" />
          <path d="M14 10.2a4 4 0 0 0-5.7-.2l-2 2A4 4 0 0 0 12 17.7l1.1-1.1" />
        </svg>
      );
  }
}

const serverProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true'
};

// Ikon tautan di modal server. `src` = ikon kustom dari config (selain host).
export function ServerLinkIcon({ type, src }) {
  if (src && type !== 'host') {
    return <img className="server-link-icon" src={src} alt="" aria-hidden="true" />;
  }
  switch (type) {
    case 'whatsapp':
      return (
        <svg {...serverProps}>
          <path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
          <path d="M9.1 9.1c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.5 1.2c.1.2.1.4-.1.6l-.5.6c.5.9 1.2 1.6 2.1 2.1l.6-.5c.2-.2.4-.2.6-.1l1.2.5c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-1 .4-2.4-.1-3.8-1.3-1.4-1.2-2.5-2.5-2.2-4.7Z" />
        </svg>
      );
    case 'discord':
      return (
        <svg {...serverProps}>
          <path d="M8.2 8.2A8 8 0 0 1 12 7.3a8 8 0 0 1 3.8.9" />
          <path d="M6.5 17.1c1.6 1.1 3.4 1.7 5.5 1.7s3.9-.6 5.5-1.7c.6-2.2.7-4.7.1-7.1-1.2-.8-2.4-1.2-3.8-1.4l-.5 1.1a8 8 0 0 0-2.6 0l-.5-1.1c-1.4.2-2.6.6-3.8 1.4-.6 2.4-.5 4.9.1 7.1Z" />
          <circle cx="9.2" cy="13.7" r=".7" fill="currentColor" stroke="none" />
          <circle cx="14.8" cy="13.7" r=".7" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...serverProps}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.8 9h16.4M3.8 15h16.4M12 3.5c2.1 2.3 3.2 5.1 3.2 8.5S14.1 18.2 12 20.5c-2.1-2.3-3.2-5.1-3.2-8.5S9.9 5.8 12 3.5Z" />
        </svg>
      );
  }
}
