import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Reminder } from '../types/database';

export function useReminders(userId: string | undefined) {
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alertedRemindersRef = useRef<Set<string>>(new Set());
  const lastCheckRef = useRef<string>('');

  useEffect(() => {
    if (!userId) return;

    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    soundRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

    const triggerReminder = async (reminder: Reminder) => {
      if (alertedRemindersRef.current.has(reminder.id)) return;

      alertedRemindersRef.current.add(reminder.id);

      await supabase
        .from('reminders')
        .update({ reminded_at: new Date().toISOString() })
        .eq('id', reminder.id)
        .select()
        .maybeSingle();

      if (soundRef.current) {
        soundRef.current.play().catch(() => {});
      }

      if (Notification.permission === "granted") {
        new Notification("TryKymi Reminder", {
          body: reminder.title,
          icon: '/image.png',
          badge: '/image.png',
          tag: reminder.id,
          requireInteraction: false,
        });
      }

      const event = new CustomEvent('reminderAlert', {
        detail: { reminder }
      });
      window.dispatchEvent(event);
    };

    const checkReminders = async () => {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      const currentCheck = `${currentDate}T${currentTime}`;

      if (lastCheckRef.current === currentCheck) return;
      lastCheckRef.current = currentCheck;

      const { data: reminders } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', false)
        .or(`reminder_date.eq.${currentDate},reminder_date.lt.${currentDate}`)
        .is('reminded_at', null);

      if (!reminders) return;

      for (const reminder of reminders) {
        if (!reminder.reminder_time) continue;
        if (reminder.reminder_time !== currentTime) continue;

        await triggerReminder(reminder);
      }
    };

    const loadAlertedReminders = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data: alerted } = await supabase
        .from('reminders')
        .select('id')
        .eq('user_id', userId)
        .eq('reminder_date', today)
        .not('reminded_at', 'is', null);

      if (alerted) {
        alerted.forEach(r => alertedRemindersRef.current.add(r.id));
      }
    };

    loadAlertedReminders();
    intervalRef.current = setInterval(checkReminders, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId]);
}
