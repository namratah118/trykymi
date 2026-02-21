import { askKymi } from "./lib/gork";
import { Brain } from 'lucide-react';
import { useConsciousMode } from '../hooks/useConsciousMode';

interface ConsciousModeProps {
  userId: string | undefined;
}

export default function ConsciousMode({ userId }: ConsciousModeProps) {
  const { isActive, toggle, timeOfDay } = useConsciousMode(userId);

  if (!userId) return null;

  const getTimeOfDayEmoji = () => {
    switch (timeOfDay) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌆';
      case 'night': return '🌙';
      default: return '⏰';
    }
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2"
      style={{
        background: isActive ? '#0A3323' : '#F7F4D5',
        color: isActive ? '#D3968C' : '#0A3323',
        border: isActive ? '1px solid #2C7A6F' : '1px solid #0A3323',
        cursor: 'pointer'
      }}
      title={isActive ? 'Conscious mode is active' : 'Conscious mode is inactive'}
    >
      <Brain className="w-4 h-4" />
      <span className="hidden sm:inline">Conscious: {isActive ? 'ON' : 'OFF'}</span>
      <span className="sm:hidden">{getTimeOfDayEmoji()}</span>
    </button>
  );
}
