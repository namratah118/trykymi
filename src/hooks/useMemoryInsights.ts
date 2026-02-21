import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface MemoryInsight {
  bestHour: number | null;
  focusMinutes: number;
  message: string;
}

export function useMemoryInsights(userId: string | undefined) {
  const [insight, setInsight] = useState<MemoryInsight | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const lastFocusRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!userId) return;

    const handleFocus = () => {
      lastFocusRef.current = Date.now();
    };

    const handleBlur = () => {
      const minutes = Math.floor((Date.now() - lastFocusRef.current) / 60000);
      if (minutes >= 1) {
        recordTimeSpent(userId, minutes);
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [userId]);

  const recordTimeSpent = async (userId: string, minutes: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const hour = new Date().getHours();

      await supabase.from('time_entries').insert({
        user_id: userId,
        type: 'won',
        activity: `focused work at ${hour}:00`,
        duration_minutes: minutes,
        entry_date: today
      });
    } catch (error) {
      console.error('Failed to record time:', error);
    }
  };

  const findBestHour = async (userId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: entries } = await supabase
        .from('time_entries')
        .select('activity, duration_minutes')
        .eq('user_id', userId)
        .eq('entry_date', today)
        .eq('type', 'won');

      const hourMap: { [key: number]: number } = {};

      entries?.forEach(entry => {
        const match = entry.activity.match(/at (\d+):00/);
        if (match) {
          const hour = parseInt(match[1]);
          hourMap[hour] = (hourMap[hour] || 0) + entry.duration_minutes;
        }
      });

      let bestHour = null;
      let maxMinutes = 0;

      Object.entries(hourMap).forEach(([hour, minutes]) => {
        if (minutes > maxMinutes) {
          maxMinutes = minutes;
          bestHour = parseInt(hour);
        }
      });

      if (bestHour !== null && maxMinutes > 0) {
        return {
          bestHour,
          focusMinutes: maxMinutes,
          message: `You focus best at ${bestHour}:00 (${maxMinutes} minutes)`
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to find best hour:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!userId) return;

    const showInsight = async () => {
      const bestInsight = await findBestHour(userId);
      if (bestInsight) {
        setInsight(bestInsight);
        setIsVisible(true);
      }
    };

    const timer = setTimeout(showInsight, 5000);
    return () => clearTimeout(timer);
  }, [userId]);

  return {
    insight,
    isVisible,
    setIsVisible
  };
}
