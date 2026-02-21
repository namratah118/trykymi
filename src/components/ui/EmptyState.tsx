import React, { ReactNode } from 'react';

interface EmptyStateProps {
  illustration?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ illustration, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
      {illustration && (
        <div className="mb-6 sm:mb-8" style={{ color: 'rgba(247,244,213,0.30)' }}>
          {illustration}
        </div>
      )}
      <h3 className="text-lg sm:text-xl lg:text-2xl font-heading font-semibold mb-2 sm:mb-3" style={{ color: '#F7F4D5' }}>
        {title}
      </h3>
      <p className="text-sm sm:text-base font-body text-center mb-6 sm:mb-8" style={{ color: 'rgba(247,244,213,0.55)' }}>
        {description}
      </p>
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}
