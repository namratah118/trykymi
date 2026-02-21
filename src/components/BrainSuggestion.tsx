import { useEffect, useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import type { DailyPlan } from '../hooks/useDailyBrain';

interface BrainSuggestionProps {
  suggestion: DailyPlan | null;
  onDismiss: () => void;
}

export default function BrainSuggestion({ suggestion, onDismiss }: BrainSuggestionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (suggestion) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [suggestion]);

  if (!suggestion || !isVisible) return null;

  return (
    <div className="fixed bottom-40 right-6 z-40 animate-in slide-in-from-bottom-4 duration-300" style={{ background: '#F7F4D5', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', maxWidth: '280px' }}>
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D3968C' }} />
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: '#0A3323' }}>Kymi Suggests</p>
          <p className="text-sm mt-1" style={{ color: '#0A3323', opacity: 0.8 }}>{suggestion.text}</p>
        </div>
        <button onClick={() => {
          setIsVisible(false);
          onDismiss();
        }} className="flex-shrink-0 transition-opacity hover:opacity-70" style={{ color: '#0A3323', opacity: 0.5 }}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
