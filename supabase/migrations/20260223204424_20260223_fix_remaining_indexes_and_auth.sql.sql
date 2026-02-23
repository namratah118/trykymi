/*
  # Fix Remaining Foreign Key Indexes and Auth Configuration

  1. **Unindexed Foreign Keys**
    - Add covering indexes on user_id columns for all tables with user_id foreign keys
    - Tables: chat_messages, habit_completions, habit_logs, habits, plans, reminders, tasks, voice_tasks
    - These indexes improve query performance for foreign key lookups and joins

  2. **Unused Indexes**
    - Drop unused date-based indexes: plans_plan_date_idx, reminders_reminder_date_idx, memory_user_id_idx
    - These are not being utilized by the query planner

  3. **Function Search Path**
    - Fix handle_new_user function to use immutable search_path
    - Prevents role-based security issues

  4. **Important Notes**
    - All user_id indexes use consistent naming pattern: table_user_id_idx
    - Indexes are created IF NOT EXISTS for idempotency
    - Auth connection strategy and password protection must be configured via Supabase dashboard settings
*/

-- Add covering indexes for foreign key constraints
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS habit_completions_user_id_idx ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS habit_logs_user_id_idx ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id);
CREATE INDEX IF NOT EXISTS plans_user_id_idx ON plans(user_id);
CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON reminders(user_id);
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS voice_tasks_user_id_idx ON voice_tasks(user_id);

-- Drop unused indexes
DROP INDEX IF EXISTS plans_plan_date_idx;
DROP INDEX IF EXISTS reminders_reminder_date_idx;
DROP INDEX IF EXISTS memory_user_id_idx;

-- Fix handle_new_user function search path
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
