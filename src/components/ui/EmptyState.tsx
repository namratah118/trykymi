import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  illustration?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, illustration, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {illustration ? (
        <div className="mb-5">
          {illustration}
        </div>
      ) : icon ? (
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: 'rgba(211,150,140,0.15)',
            border: '1px solid rgba(211,150,140,0.25)',
            color: '#D3968C',
          }}
        >
          {icon}
        </div>
      ) : null}
      <h3 className="font-heading text-xl font-semibold mb-3" style={{ color: '#F7F4D5' }}>{title}</h3>
      <p className="font-body max-w-xs leading-relaxed mb-6" style={{ color: '#839958', fontSize: '16px' }}>{description}</p>
      {action}
    </div>
  );
}
