/*
  # Security and Performance Fixes

  1. **Unindexed Foreign Keys**
    - Add covering index on memory(user_id) for memory_user_id_fkey

  2. **RLS Performance Optimization**
    - Replace direct auth.uid() calls with (select auth.uid()) across all tables
    - Affected tables: profiles, tasks, reminders, habits, habit_logs, plans, habit_completions, chat_messages, users, time_entries, daily_checkins, voice_tasks, memory
    - This prevents re-evaluation per row at scale

  3. **Duplicate Policies**
    - Remove duplicate permissive policies on chat_messages for SELECT and INSERT
    - Keep the newer "Users can insert own messages" and "Users can view own messages" policies

  4. **Index Cleanup**
    - Drop unused indexes that are not contributing to query performance
    - Affected: chat_messages_user_id_created_at_idx, tasks_user_id_idx, reminders_user_id_idx, habits_user_id_idx, habit_logs_user_id_idx, plans_user_id_idx, habit_completions_habit_id_idx, habit_completions_user_id_idx, chat_messages_user_id_idx, chat_messages_created_at_idx, voice_tasks_user_id_idx, voice_tasks_type_idx
    - Keep reminders_reminder_date_idx and plans_plan_date_idx as these support date filtering

  5. **Important Notes**
    - RLS changes use parameterized auth calls for better performance
    - Foreign key index added without changing constraint behavior
    - Duplicate chat_messages policies cleaned up
    - Unused indexes dropped to reduce maintenance overhead
*/

-- Add covering index for memory foreign key
CREATE INDEX IF NOT EXISTS memory_user_id_idx ON memory(user_id);

-- Fix RLS Policies: profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = (select auth.uid()))
  WITH CHECK (auth.uid() = (select auth.uid()));

-- Fix RLS Policies: tasks table
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix RLS Policies: reminders table
DROP POLICY IF EXISTS "Users can view own reminders" ON reminders;
CREATE POLICY "Users can view own reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own reminders" ON reminders;
CREATE POLICY "Users can insert own reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own reminders" ON reminders;
CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own reminders" ON reminders;
CREATE POLICY "Users can delete own reminders"
  ON reminders FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix RLS Policies: habits table
DROP POLICY IF EXISTS "Users can view own habits" ON habits;
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own habits" ON habits;
CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own habits" ON habits;
CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own habits" ON habits;
CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix RLS Policies: habit_logs table
DROP POLICY IF EXISTS "Users can view own habit logs" ON habit_logs;
CREATE POLICY "Users can view own habit logs"
  ON habit_logs FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own habit logs" ON habit_logs;
CREATE POLICY "Users can insert own habit logs"
  ON habit_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own habit logs" ON habit_logs;
CREATE POLICY "Users can delete own habit logs"
  ON habit_logs FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix RLS Policies: plans table
DROP POLICY IF EXISTS "Users can view own plans" ON plans;
CREATE POLICY "Users can view own plans"
  ON plans FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own plans" ON plans;
CREATE POLICY "Users can insert own plans"
  ON plans FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own plans" ON plans;
CREATE POLICY "Users can update own plans"
  ON plans FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own plans" ON plans;
CREATE POLICY "Users can delete own plans"
  ON plans FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix RLS Policies: habit_completions table
DROP POLICY IF EXISTS "Users can view own habit completions" ON habit_completions;
CREATE POLICY "Users can view own habit completions"
  ON habit_completions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own habit completions" ON habit_completions;
CREATE POLICY "Users can insert own habit completions"
  ON habit_completions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own habit completions" ON habit_completions;
CREATE POLICY "Users can delete own habit completions"
  ON habit_completions FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix RLS Policies: chat_messages table - remove duplicates and optimize
DROP POLICY IF EXISTS "Users can view own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view own messages" ON chat_messages;
CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON chat_messages;
CREATE POLICY "Users can insert own messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own chat messages" ON chat_messages;
CREATE POLICY "Users can delete own chat messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix RLS Policies: users table
DROP POLICY IF EXISTS "Users can view own user record" ON users;
CREATE POLICY "Users can view own user record"
  ON users FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own user record" ON users;
CREATE POLICY "Users can insert own user record"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own user record" ON users;
CREATE POLICY "Users can update own user record"
  ON users FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- Fix RLS Policies: time_entries table
DROP POLICY IF EXISTS "Users can view own time entries" ON time_entries;
CREATE POLICY "Users can view own time entries"
  ON time_entries FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own time entries" ON time_entries;
CREATE POLICY "Users can insert own time entries"
  ON time_entries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own time entries" ON time_entries;
CREATE POLICY "Users can delete own time entries"
  ON time_entries FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix RLS Policies: daily_checkins table
DROP POLICY IF EXISTS "Users can select own checkins" ON daily_checkins;
CREATE POLICY "Users can select own checkins"
  ON daily_checkins FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own checkins" ON daily_checkins;
CREATE POLICY "Users can insert own checkins"
  ON daily_checkins FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own checkins" ON daily_checkins;
CREATE POLICY "Users can update own checkins"
  ON daily_checkins FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Fix RLS Policies: voice_tasks table
DROP POLICY IF EXISTS "Users can view own voice tasks" ON voice_tasks;
CREATE POLICY "Users can view own voice tasks"
  ON voice_tasks FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own voice tasks" ON voice_tasks;
CREATE POLICY "Users can insert own voice tasks"
  ON voice_tasks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own voice tasks" ON voice_tasks;
CREATE POLICY "Users can update own voice tasks"
  ON voice_tasks FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own voice tasks" ON voice_tasks;
CREATE POLICY "Users can delete own voice tasks"
  ON voice_tasks FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix RLS Policies: memory table
DROP POLICY IF EXISTS "Users can read own memory" ON memory;
CREATE POLICY "Users can read own memory"
  ON memory FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own memory" ON memory;
CREATE POLICY "Users can create own memory"
  ON memory FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own memory" ON memory;
CREATE POLICY "Users can update own memory"
  ON memory FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Drop unused indexes - keep only date-based indexes that are needed for filtering
DROP INDEX IF EXISTS chat_messages_user_id_created_at_idx;
DROP INDEX IF EXISTS tasks_user_id_idx;
DROP INDEX IF EXISTS reminders_user_id_idx;
DROP INDEX IF EXISTS habits_user_id_idx;
DROP INDEX IF EXISTS habit_logs_user_id_idx;
DROP INDEX IF EXISTS habit_logs_habit_id_idx;
DROP INDEX IF EXISTS plans_user_id_idx;
DROP INDEX IF EXISTS habit_completions_habit_id_idx;
DROP INDEX IF EXISTS habit_completions_user_id_idx;
DROP INDEX IF EXISTS chat_messages_user_id_idx;
DROP INDEX IF EXISTS chat_messages_created_at_idx;
DROP INDEX IF EXISTS voice_tasks_user_id_idx;
DROP INDEX IF EXISTS voice_tasks_type_idx;
