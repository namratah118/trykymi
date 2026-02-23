import { useEffect, useState } from 'react';

interface ThinkingDotsProps {
  className?: string;
  color?: string;
}

export default function ThinkingDots({ className = '', color = 'rgba(247,244,213,0.40)' }: ThinkingDotsProps) {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={className} style={{ color }}>
      TryKymi is thinking{dots}
    </span>
  );
}
