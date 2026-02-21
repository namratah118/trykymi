import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function useReminders(userId: string | undefined) {
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!userId) return;

    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    soundRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

    const checkReminders = async () => {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

      const { data: reminders } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', userId)
        .eq('reminder_date', currentDate)
        .eq('completed', false);

      if (reminders) {
        reminders.forEach(reminder => {
          if (reminder.reminder_time === currentTime) {
            if (soundRef.current) {
              soundRef.current.play().catch(() => {});
            }

            if (Notification.permission === "granted") {
              new Notification("TryKymi Reminder", {
                body: reminder.title,
                icon: '/image.png',
                badge: '/image.png',
              });
            }

            const event = new CustomEvent('reminderAlert', {
              detail: { reminder }
            });
            window.dispatchEvent(event);
          }
        });
      }
    };

    intervalRef.current = setInterval(checkReminders, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId]);
}
