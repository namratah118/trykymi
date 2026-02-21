import { useEffect, useState } from 'react';
import { X, Brain } from 'lucide-react';
import type { MemoryInsight } from '../hooks/useMemoryInsights';

interface MemoryInsightProps {
  insight: MemoryInsight | null;
  isVisible: boolean;
  onDismiss: () => void;
}

export default function MemoryInsightComponent({ insight, isVisible, onDismiss }: MemoryInsightProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible && insight) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onDismiss();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, insight, onDismiss]);

  if (!show || !insight) return null;

  return (
    <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-top-4 duration-300" style={{ background: '#F7F4D5', borderRadius: '10px', padding: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', maxWidth: '300px' }}>
      <div className="flex items-start gap-3">
        <Brain className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D3968C' }} />
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: '#0A3323' }}>TryKymi Insight</p>
          <p className="text-sm mt-1" style={{ color: '#0A3323', opacity: 0.8 }}>{insight.message}</p>
        </div>
        <button onClick={() => {
          setShow(false);
          onDismiss();
        }} className="flex-shrink-0 transition-opacity hover:opacity-70" style={{ color: '#0A3323', opacity: 0.5 }}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
