import React from 'react';

interface IllustrationProps {
  className?: string;
  opacity?: number;
}

export function ChecklistIllustration({ className = 'w-16 h-16', opacity = 1 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} style={{ opacity }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} style={{ opacity: 0.5 }} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 10l2 2 4-4M7 16l2 2 4-4" style={{ opacity: 0.5 }} />
    </svg>
  );
}

export function HabitIllustration({ className = 'w-16 h-16', opacity = 1 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} style={{ opacity }}>
      <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2a10 10 0 110 20 10 10 0 010-20z" style={{ opacity: 0.5 }} />
    </svg>
  );
}

export function PlanIllustration({ className = 'w-16 h-16', opacity = 1 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} style={{ opacity }}>
      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 2v4M8 2v4M3 10h18" />
      <line x1="8" y1="14" x2="16" y2="14" strokeWidth={1.5} />
      <line x1="8" y1="18" x2="16" y2="18" strokeWidth={1.5} />
    </svg>
  );
}

export function ReminderIllustration({ className = 'w-16 h-16', opacity = 1 }: IllustrationProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} style={{ opacity }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
