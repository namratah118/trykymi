
/*
  # TryKymi - Core Tables Schema

  ## New Tables
  - `plans` - Daily plan items
  - `reminders` - User reminders
  - `tasks` - User tasks
  - `habits` - Habit definitions
  - `habit_completions` - Daily completion tracking
  - `chat_messages` - AI chat history

  ## Security
  - RLS enabled on all tables with ownership-based policies
*/

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  plan_date date NOT NULL DEFAULT CURRENT_DATE,
  start_time time,
  end_time time,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plans' AND policyname = 'Users can view own plans') THEN
    CREATE POLICY "Users can view own plans" ON plans FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plans' AND policyname = 'Users can insert own plans') THEN
    CREATE POLICY "Users can insert own plans" ON plans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plans' AND policyname = 'Users can update own plans') THEN
    CREATE POLICY "Users can update own plans" ON plans FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plans' AND policyname = 'Users can delete own plans') THEN
    CREATE POLICY "Users can delete own plans" ON plans FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS plans_user_id_idx ON plans(user_id);
CREATE INDEX IF NOT EXISTS plans_plan_date_idx ON plans(plan_date);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  reminder_date date NOT NULL,
  reminder_time time,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reminders' AND policyname = 'Users can view own reminders') THEN
    CREATE POLICY "Users can view own reminders" ON reminders FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reminders' AND policyname = 'Users can insert own reminders') THEN
    CREATE POLICY "Users can insert own reminders" ON reminders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reminders' AND policyname = 'Users can update own reminders') THEN
    CREATE POLICY "Users can update own reminders" ON reminders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reminders' AND policyname = 'Users can delete own reminders') THEN
    CREATE POLICY "Users can delete own reminders" ON reminders FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON reminders(user_id);
CREATE INDEX IF NOT EXISTS reminders_reminder_date_idx ON reminders(reminder_date);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  is_completed boolean DEFAULT false,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can view own tasks') THEN
    CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can insert own tasks') THEN
    CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can update own tasks') THEN
    CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can delete own tasks') THEN
    CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#2F5D50',
  icon text DEFAULT 'star',
  frequency text DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'habits' AND policyname = 'Users can view own habits') THEN
    CREATE POLICY "Users can view own habits" ON habits FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'habits' AND policyname = 'Users can insert own habits') THEN
    CREATE POLICY "Users can insert own habits" ON habits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'habits' AND policyname = 'Users can update own habits') THEN
    CREATE POLICY "Users can update own habits" ON habits FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'habits' AND policyname = 'Users can delete own habits') THEN
    CREATE POLICY "Users can delete own habits" ON habits FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id);

-- Habit completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completed_date)
);

ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'habit_completions' AND policyname = 'Users can view own habit completions') THEN
    CREATE POLICY "Users can view own habit completions" ON habit_completions FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'habit_completions' AND policyname = 'Users can insert own habit completions') THEN
    CREATE POLICY "Users can insert own habit completions" ON habit_completions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'habit_completions' AND policyname = 'Users can delete own habit completions') THEN
    CREATE POLICY "Users can delete own habit completions" ON habit_completions FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS habit_completions_habit_id_idx ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS habit_completions_user_id_idx ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS habit_completions_date_idx ON habit_completions(completed_date);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Users can view own chat messages') THEN
    CREATE POLICY "Users can view own chat messages" ON chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Users can insert own chat messages') THEN
    CREATE POLICY "Users can insert own chat messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Users can delete own chat messages') THEN
    CREATE POLICY "Users can delete own chat messages" ON chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
