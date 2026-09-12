type IconProps = { className?: string };

function Svg({ className = "", children, fill = false }: IconProps & { children: React.ReactNode; fill?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function HomeIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.8V21h5v-6h4v6h5V9.8" />
    </Svg>
  );
}

export function CompassIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m16 8-2.7 5.3L8 16l2.7-5.3z" />
    </Svg>
  );
}

export function FireIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </Svg>
  );
}

export function StarIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className} fill>
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
    </Svg>
  );
}

export function CheckIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12.5 2.7 2.7L16.5 9" />
    </Svg>
  );
}

export function TagIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M20.6 13.4 11 3H4v7l9.6 10.4a2 2 0 0 0 2.8 0l4.2-4.2a2 2 0 0 0 0-2.8z" />
      <circle cx="7.5" cy="7.5" r="1" />
    </Svg>
  );
}

export function BookmarkIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 3h12v18l-6-4.5L6 21z" />
    </Svg>
  );
}

export function HistoryIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.7 9.7 0 0 0-6.7 2.8L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l3.5 2" />
    </Svg>
  );
}

export function InfoIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8h.01" />
      <path d="M12 11v6" />
    </Svg>
  );
}

export function SearchIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </Svg>
  );
}

export function MenuIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function CloseIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function UpIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </Svg>
  );
}

export function PlayIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className} fill>
      <path d="M8 5v14l11-7z" />
    </Svg>
  );
}

export function EyeIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function ThumbsUpIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className} fill>
      <path d="M7 22H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3v10zm2 0h9.6a2 2 0 0 0 2-1.6l1.7-7A2 2 0 0 0 20.4 11H14V6.5A1.5 1.5 0 0 0 12.5 5c-.5 0-.9.2-1.2.7L9 9H7v13z" />
    </Svg>
  );
}

export function BoltIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className} fill>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </Svg>
  );
}

export function GridIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

export function RowsIcon({ className = "" }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
    </Svg>
  );
}
