import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function useConsciousMode(userId: string | undefined) {
  const [isActive, setIsActive] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const lastActivityRef = useRef<number>(Date.now());
  const greeted = useRef<boolean>(false);

  const speak = (text: string) => {
    if (isActive && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
      else if (hour >= 17 && hour < 22) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 3600000);
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || greeted.current) return;

    const timer = setTimeout(() => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour <= 11) {
        speak("Good morning. Let's make today productive.");
        greeted.current = true;
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const inactivityInterval = setInterval(() => {
      const minutesInactive = (Date.now() - lastActivityRef.current) / 60000;
      if (minutesInactive > 30) {
        speak("You've been inactive. Let's return to focus.");
        lastActivityRef.current = Date.now();
      }
    }, 60000);

    return () => clearInterval(inactivityInterval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !userId) return;

    const checkTimeline = async () => {
      const hour = new Date().getHours();
      const timeSlot = `${hour}:00`;

      try {
        const today = new Date().toISOString().split('T')[0];

        const { data } = await supabase
          .from('voice_tasks')
          .select('content')
          .eq('user_id', userId)
          .eq('entry_date', today)
          .eq('scheduled_time', timeSlot)
          .eq('completed', false)
          .limit(1)
          .maybeSingle();

        if (data) {
          speak(`Now it's time for ${data.content}`);
        }
      } catch (error) {
        console.error('Failed to check timeline:', error);
      }
    };

    checkTimeline();
    const timelineInterval = setInterval(checkTimeline, 3600000);
    return () => clearInterval(timelineInterval);
  }, [isActive, userId]);

  useEffect(() => {
    if (!isActive) return;

    const checkNightReflection = setInterval(() => {
      const hour = new Date().getHours();
      if (hour === 22) {
        speak("Before sleeping, reflect on your day.");
      }
    }, 3600000);

    return () => clearInterval(checkNightReflection);
  }, [isActive]);

  const toggle = () => {
    setIsActive(!isActive);
    speak(!isActive ? 'Conscious mode activated' : 'Conscious mode deactivated');
  };

  return {
    isActive,
    toggle,
    timeOfDay,
    speak
  };
}
