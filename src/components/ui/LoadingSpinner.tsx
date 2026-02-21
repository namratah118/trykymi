import React from 'react';

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
      <div
        className="rounded-full animate-spin"
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(247,244,213,0.15)',
          borderTopColor: '#D3968C',
        }}
      />
    </div>
  );
}
