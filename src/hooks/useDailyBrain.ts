import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface DailyPlan {
  hour: number;
  text: string;
}

export function useDailyBrain(userId: string | undefined) {
  const [suggestion, setSuggestion] = useState<DailyPlan | null>(null);
  const [productivityScore, setProductivityScore] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const focusTimeRef = useRef<number>(Date.now());

  const defaultPlan: DailyPlan[] = [
    { hour: 7, text: "Wake up and refresh" },
    { hour: 9, text: "Deep work session" },
    { hour: 13, text: "Lunch and rest" },
    { hour: 16, text: "Continue productive work" },
    { hour: 19, text: "Exercise or self care" },
    { hour: 22, text: "Wind down and reflect" }
  ];

  useEffect(() => {
    if (!userId) return;

    const handleFocus = () => {
      focusTimeRef.current = Date.now();
    };

    const handleBlur = () => {
      const timeLost = Math.round((Date.now() - focusTimeRef.current) / 60000);
      if (timeLost > 0) {
        recordTimeLost(userId, timeLost);
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [userId]);

  const recordTimeLost = async (userId: string, minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('time_entries').insert({
      user_id: userId,
      type: 'lost',
      activity: 'window blur',
      duration_minutes: minutes,
      entry_date: today
    });
  };

  const getOrCreateDailyPlan = async () => {
    if (!userId) return null;

    const today = new Date().toISOString().split('T')[0];
    const { data: existingPlan } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_date', today)
      .order('plan_time');

    if (existingPlan && existingPlan.length > 0) {
      return existingPlan.map(p => ({
        hour: parseInt(p.start_time?.split(':')[0] || '0'),
        text: p.description
      }));
    }

    return defaultPlan;
  };

  const updateProductivityScore = async () => {
    if (!userId) return;

    const today = new Date().toISOString().split('T')[0];
    const { data: completedTasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('updated_at', today);

    const { data: habitLogs } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('logged_date', today);

    const score = Math.min(100, ((completedTasks?.length || 0) * 15 + (habitLogs?.length || 0) * 10));
    setProductivityScore(score);

    await supabase
      .from('daily_checkins')
      .upsert({
        user_id: userId,
        checkin_date: today,
        productivity_score: score
      }, { onConflict: 'user_id,checkin_date' });
  };

  useEffect(() => {
    if (!userId) return;

    const checkSuggestion = async () => {
      const now = new Date();
      const hour = now.getHours();
      const plan = await getOrCreateDailyPlan();
      const current = plan?.find(p => p.hour === hour);
      if (current) setSuggestion(current);
    };

    const checkReflection = async () => {
      const now = new Date();
      if (now.getHours() === 22) {
        const today = now.toISOString().split('T')[0];
        const { data: existingCheckin } = await supabase
          .from('daily_checkins')
          .select('id')
          .eq('user_id', userId)
          .eq('checkin_date', today)
          .maybeSingle();

        if (!existingCheckin) {
          setShowReflection(true);
        }
      }
    };

    checkSuggestion();
    updateProductivityScore();
    checkReflection();

    const interval = setInterval(() => {
      checkSuggestion();
      updateProductivityScore();
      checkReflection();
    }, 60000);

    return () => clearInterval(interval);
  }, [userId]);

  return {
    suggestion,
    setSuggestion,
    productivityScore,
    showReflection,
    setShowReflection
  };
}
