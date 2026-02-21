import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Reminder } from '../types/database';

export default function ReminderAlert() {
  const [reminder, setReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    const handleReminder = (e: Event) => {
      const customEvent = e as CustomEvent;
      setReminder(customEvent.detail.reminder);
      setTimeout(() => setReminder(null), 5000);
    };

    window.addEventListener('reminderAlert', handleReminder);
    return () => window.removeEventListener('reminderAlert', handleReminder);
  }, []);

  if (!reminder) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300" style={{ background: '#F7F4D5', borderRadius: '12px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', maxWidth: '300px' }}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-semibold" style={{ color: '#0A3323' }}>Reminder</p>
          <p className="text-sm mt-1" style={{ color: '#0A3323', opacity: 0.8 }}>{reminder.title}</p>
        </div>
        <button onClick={() => setReminder(null)} className="flex-shrink-0 transition-colors" style={{ color: '#0A3323', opacity: 0.6 }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.6'}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
