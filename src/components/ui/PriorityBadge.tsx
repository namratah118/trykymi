import React from 'react';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const colors = {
    low: { bg: 'rgba(247,244,213,0.08)', text: 'rgba(247,244,213,0.50)' },
    medium: { bg: '#D3968C20', text: '#D3968C' },
    high: { bg: '#D3968C40', text: '#D3968C' },
  };

  const color = colors[priority];
  const label = priority.charAt(0).toUpperCase() + priority.slice(1);

  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-xs font-body font-semibold"
      style={{ background: color.bg, color: color.text }}
    >
      {label}
    </span>
  );
}
