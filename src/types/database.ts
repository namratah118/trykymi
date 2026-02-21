export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
        };
      };
      users: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          created_at: string;
          onboarding_completed: boolean;
          focus_areas: string[] | null;
          time_wasters: string[] | null;
          tracking_prefs: string[] | null;
          main_goal: string | null;
          reminder_times: string[] | null;
        };
        Insert: {
          id: string;
          full_name?: string;
          email?: string;
          created_at?: string;
          onboarding_completed?: boolean;
          focus_areas?: string[] | null;
          time_wasters?: string[] | null;
          tracking_prefs?: string[] | null;
          main_goal?: string | null;
          reminder_times?: string[] | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          onboarding_completed?: boolean;
          focus_areas?: string[] | null;
          time_wasters?: string[] | null;
          tracking_prefs?: string[] | null;
          main_goal?: string | null;
          reminder_times?: string[] | null;
        };
      };
      time_entries: {
        Row: {
          id: string;
          user_id: string;
          type: 'lost' | 'won';
          activity: string;
          duration_minutes: number;
          entry_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'lost' | 'won';
          activity: string;
          duration_minutes: number;
          entry_date?: string;
          created_at?: string;
        };
        Update: {
          type?: 'lost' | 'won';
          activity?: string;
          duration_minutes?: number;
          entry_date?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          plan_date: string;
          plan_time: string | null;
          start_time: string | null;
          end_time: string | null;
          priority: 'low' | 'medium' | 'high';
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          plan_date?: string;
          plan_time?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          priority?: 'low' | 'medium' | 'high';
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          plan_date?: string;
          start_time?: string | null;
          end_time?: string | null;
          priority?: 'low' | 'medium' | 'high';
          completed?: boolean;
          updated_at?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          reminder_date: string;
          reminder_time: string | null;
          completed: boolean;
          reminded_at: string | null;
          dismissed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          reminder_date: string;
          reminder_time?: string | null;
          completed?: boolean;
          reminded_at?: string | null;
          dismissed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          reminder_date?: string;
          reminder_time?: string | null;
          completed?: boolean;
          reminded_at?: string | null;
          dismissed_at?: string | null;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          completed: boolean;
          priority: 'low' | 'medium' | 'high';
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          completed?: boolean;
          priority?: 'low' | 'medium' | 'high';
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          completed?: boolean;
          priority?: 'low' | 'medium' | 'high';
          due_date?: string | null;
          updated_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          color: string;
          icon: string;
          frequency: 'daily' | 'weekly';
          current_streak: number;
          longest_streak: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          color?: string;
          icon?: string;
          frequency?: 'daily' | 'weekly';
          current_streak?: number;
          longest_streak?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          color?: string;
          icon?: string;
          frequency?: 'daily' | 'weekly';
          current_streak?: number;
          longest_streak?: number;
          updated_at?: string;
        };
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_date?: string;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserRecord = Database['public']['Tables']['users']['Row'];
export type Plan = Database['public']['Tables']['plans']['Row'];
export type Reminder = Database['public']['Tables']['reminders']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type Habit = Database['public']['Tables']['habits']['Row'];
export type HabitCompletion = Database['public']['Tables']['habit_completions']['Row'];
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
export type TimeEntry = Database['public']['Tables']['time_entries']['Row'];
