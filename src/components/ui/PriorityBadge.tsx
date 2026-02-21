import type { CSSProperties } from 'react';

type Priority = 'low' | 'medium' | 'high';

const STYLES: Record<Priority, CSSProperties> = {
  low: { background: 'rgba(131,153,88,0.18)', color: '#839958', border: '1px solid rgba(131,153,88,0.28)' },
  medium: { background: 'rgba(211,150,140,0.15)', color: '#D3968C', border: '1px solid rgba(211,150,140,0.25)' },
  high: { background: 'rgba(211,150,140,0.15)', color: '#D3968C', border: '1px solid rgba(211,150,140,0.25)' },
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const labels: Record<Priority, string> = { low: 'Low', medium: 'Medium', high: 'High' };
  return (
    <span className="badge" style={STYLES[priority]}>{labels[priority]}</span>
  );
}
