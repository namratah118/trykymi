import { useEffect, useState } from 'react';
import { X, CheckCircle2, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Reminder } from '../types/database';

export default function ReminderAlert() {
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleReminder = (e: Event) => {
      const customEvent = e as CustomEvent;
      setReminder(customEvent.detail.reminder);

      if (autoHideTimer) clearTimeout(autoHideTimer);
      const timer = setTimeout(() => setReminder(null), 6000);
      setAutoHideTimer(timer);
    };

    window.addEventListener('reminderAlert', handleReminder);
    return () => {
      window.removeEventListener('reminderAlert', handleReminder);
      if (autoHideTimer) clearTimeout(autoHideTimer);
    };
  }, [autoHideTimer]);

  const handleComplete = async () => {
    if (!reminder) return;
    await supabase
      .from('reminders')
      .update({ completed: true, updated_at: new Date().toISOString() })
      .eq('id', reminder.id);
    setReminder(null);
  };

  const handleDismiss = () => {
    setReminder(null);
  };

  if (!reminder) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300" style={{ background: '#F7F4D5', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', maxWidth: '320px' }}>
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D3968C' }} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" style={{ color: '#0A3323' }}>Reminder</p>
          <p className="text-sm mt-1" style={{ color: '#0A3323', opacity: 0.9 }}>{reminder.title}</p>
          {reminder.description && (
            <p className="text-xs mt-1" style={{ color: '#0A3323', opacity: 0.7 }}>{reminder.description}</p>
          )}
        </div>
        <button onClick={handleDismiss} className="flex-shrink-0 transition-colors" style={{ color: '#0A3323', opacity: 0.6 }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.6'}>
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={handleDismiss} className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: 'rgba(10,51,35,0.10)', color: '#0A3323' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(10,51,35,0.15)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(10,51,35,0.10)'}>
          Dismiss
        </button>
        <button onClick={handleComplete} className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1" style={{ background: '#0A3323', color: '#F7F4D5' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Done
        </button>
      </div>
    </div>
  );
}
