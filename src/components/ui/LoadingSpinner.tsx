import ThinkingDots from './ThinkingDots';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: { width: '16px', height: '16px', borderWidth: '2px' },
    md: { width: '24px', height: '24px', borderWidth: '2px' },
    lg: { width: '32px', height: '32px', borderWidth: '3px' },
  };

  const s = sizes[size];

  return (
    <div
      className={`rounded-full animate-spin ${className}`}
      style={{
        width: s.width,
        height: s.height,
        border: `${s.borderWidth} solid rgba(211,150,140,0.20)`,
        borderTopColor: '#D3968C',
      }}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-64">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-3" />
        <ThinkingDots className="font-body" color="#839958" />
      </div>
    </div>
  );
}
