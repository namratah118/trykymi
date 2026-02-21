import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface VoiceTask {
  id: string;
  content: string;
  type: 'task' | 'habit' | 'reminder';
  scheduled_time: string;
  completed: boolean;
}

export function useVoiceCommands(userId: string | undefined) {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [lastTask, setLastTask] = useState<VoiceTask | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setIsListening(false);
        setStatus('processing');
        processVoiceCommand(text);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setStatus('idle');
      };

      recognitionRef.current.onend = () => {
        setStatus('idle');
      };
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const extractTime = (text: string): string => {
    const match = text.match(/([0-9]{1,2}):?([0-9]{2})?\s*(am|pm)?/i);
    if (match) {
      let hour = parseInt(match[1]);
      if (match[3]) {
        const isPm = match[3].toLowerCase() === 'pm';
        if (isPm && hour !== 12) hour += 12;
        if (!isPm && hour === 12) hour = 0;
      }
      return `${hour}:00`;
    }
    return '';
  };

  const autoPlan = async () => {
    if (!userId) return;

    const plan = [
      { time: '07:00', task: 'Wake up' },
      { time: '09:00', task: 'Deep work' },
      { time: '13:00', task: 'Lunch' },
      { time: '18:00', task: 'Exercise' },
      { time: '22:00', task: 'Sleep' }
    ];

    const today = new Date().toISOString().split('T')[0];

    try {
      const tasks = plan.map(item => ({
        user_id: userId,
        content: item.task,
        type: 'task' as const,
        scheduled_time: item.time,
        entry_date: today
      }));

      await supabase.from('voice_tasks').insert(tasks);
      speak('Your day is planned');
    } catch (error) {
      console.error('Failed to create daily plan:', error);
    }
  };

  const processVoiceCommand = async (text: string) => {
    if (!userId) return;

    if (text.includes('plan')) {
      await autoPlan();
      return;
    }

    let type: 'task' | 'habit' | 'reminder' = 'task';
    let scheduledTime = '';
    let feedback = 'Task saved';

    if (text.includes('every day')) {
      type = 'habit';
      scheduledTime = extractTime(text);
      feedback = 'Habit saved';
    } else if (text.includes('remind')) {
      type = 'reminder';
      scheduledTime = extractTime(text);
      feedback = 'Reminder saved';
    }

    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('voice_tasks')
        .insert({
          user_id: userId,
          content: text,
          type,
          scheduled_time: scheduledTime,
          entry_date: today
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setLastTask(data);
        setShowNotification(true);
        speak(feedback);
        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save voice task:', error);
    } finally {
      setStatus('idle');
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setStatus('listening');
      recognitionRef.current.start();
    }
  };

  return {
    isListening,
    status,
    startListening,
    lastTask,
    showNotification
  };
}
