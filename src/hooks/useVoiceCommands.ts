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
        processVoiceCommand(text);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

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

  const processVoiceCommand = async (text: string) => {
    if (!userId) return;

    let type: 'task' | 'habit' | 'reminder' = 'task';
    let scheduledTime = '';

    if (text.includes('every day')) {
      type = 'habit';
      scheduledTime = extractTime(text);
    } else if (text.includes('remind')) {
      type = 'reminder';
      scheduledTime = extractTime(text);
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
        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save voice task:', error);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return {
    isListening,
    startListening,
    lastTask,
    showNotification
  };
}
