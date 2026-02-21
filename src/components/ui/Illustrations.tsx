interface IllustrationProps {
  className?: string;
  opacity?: number;
}

export function ChecklistIllustration({ className = 'w-16 h-16', opacity = 0.6 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ opacity }}>
      <g stroke="#839958" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="10" width="40" height="44" rx="2" />
        <line x1="16" y1="18" x2="48" y2="18" />
        <line x1="16" y1="28" x2="48" y2="28" />
        <line x1="16" y1="38" x2="48" y2="38" />
        <polyline points="20 26 24 30 32 22" />
        <polyline points="20 36 24 40 32 32" />
        <polyline points="20 46 24 50 32 42" />
      </g>
    </svg>
  );
}

export function ReminderIllustration({ className = 'w-16 h-16', opacity = 0.6 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ opacity }}>
      <g stroke="#D3968C" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="32" r="22" />
        <line x1="32" y1="18" x2="32" y2="32" />
        <line x1="32" y1="32" x2="42" y2="42" />
        <circle cx="14" cy="12" r="2" fill="#D3968C" />
        <circle cx="50" cy="12" r="2" fill="#D3968C" />
      </g>
    </svg>
  );
}

export function HabitIllustration({ className = 'w-16 h-16', opacity = 0.6 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ opacity }}>
      <g stroke="#839958" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="20" r="6" />
        <circle cx="32" cy="20" r="6" />
        <circle cx="46" cy="20" r="6" />
        <line x1="18" y1="26" x2="18" y2="44" />
        <line x1="32" y1="26" x2="32" y2="44" />
        <line x1="46" y1="26" x2="46" y2="44" />
        <polyline points="14 44 22 52 28 46" stroke="#D3968C" />
        <polyline points="28 44 36 52 42 46" stroke="#D3968C" />
        <polyline points="42 44 50 52 56 46" stroke="#D3968C" />
      </g>
    </svg>
  );
}

export function InsightsIllustration({ className = 'w-16 h-16', opacity = 0.6 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ opacity }}>
      <g stroke="#839958" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="30" width="8" height="20" />
        <rect x="28" y="20" width="8" height="30" />
        <rect x="44" y="10" width="8" height="40" />
        <polyline points="12 12 28 20 44 14" stroke="#D3968C" fill="none" />
      </g>
    </svg>
  );
}

export function PlanIllustration({ className = 'w-16 h-16', opacity = 0.6 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ opacity }}>
      <g stroke="#D3968C" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="12" width="44" height="40" rx="2" />
        <line x1="10" y1="24" x2="54" y2="24" />
        <line x1="18" y1="32" x2="46" y2="32" />
        <line x1="18" y1="40" x2="46" y2="40" />
        <circle cx="16" cy="20" r="2" fill="#D3968C" />
      </g>
    </svg>
  );
}

export function ProfileIllustration({ className = 'w-16 h-16', opacity = 0.6 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ opacity }}>
      <g stroke="#839958" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="22" r="10" />
        <path d="M 14 48 Q 14 36 32 36 Q 50 36 50 48" />
        <line x1="22" y1="52" x2="42" y2="52" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function DebriefIllustration({ className = 'w-16 h-16', opacity = 0.6 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ opacity }}>
      <g stroke="#D3968C" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="14" width="40" height="36" rx="2" />
        <line x1="16" y1="22" x2="48" y2="22" />
        <line x1="16" y1="30" x2="48" y2="30" />
        <line x1="16" y1="38" x2="40" y2="38" />
        <circle cx="20" cy="18" r="1.5" fill="#D3968C" />
        <circle cx="20" cy="26" r="1.5" fill="#D3968C" />
        <circle cx="20" cy="34" r="1.5" fill="#D3968C" />
      </g>
    </svg>
  );
}

export function AssistantIllustration({ className = 'w-16 h-16', opacity = 0.6 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ opacity }}>
      <g stroke="#839958" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="32" r="18" />
        <circle cx="24" cy="28" r="2" fill="#839958" />
        <circle cx="40" cy="28" r="2" fill="#839958" />
        <path d="M 26 38 Q 32 42 38 38" stroke="#D3968C" />
        <path d="M 14 24 L 8 18 M 50 24 L 56 18" stroke="#D3968C" />
      </g>
    </svg>
  );
}
