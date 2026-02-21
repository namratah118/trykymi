export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string;
  color: string;
  frequency: 'daily' | 'weekly';
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_time: string | null;
  end_time: string | null;
  priority: 'low' | 'medium' | 'high';
  plan_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description: string;
  reminder_date: string;
  reminder_time: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface HabitCompletion {
  habit_id: string;
  user_id: string;
  completed_date: string;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  type: 'won' | 'lost';
  activity: string;
  duration_minutes: number;
  entry_date: string;
  created_at: string;
}
