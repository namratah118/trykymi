import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function CountUp({ end, duration = 2.5, className, style }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const steps = Math.ceil(end);
    const increment = end / (duration * 60);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        ...style,
        animation: isVisible ? `countUp 0.6s ease-out` : 'none',
      }}
    >
      {count}
    </span>
  );
}
