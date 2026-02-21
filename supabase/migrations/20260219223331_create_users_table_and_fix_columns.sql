
/*
  # Create users table and fix column mismatches

  ## Changes
  1. New Tables
    - `users` - User records synced from auth.users
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `created_at` (timestamptz)

  2. Modified Tables
    - `plans` - Add start_time, end_time, priority, completed, updated_at
    - `tasks` - Add description, updated_at
    - `reminders` - Add description, updated_at
    - `habits` - Add description, color, icon, frequency, current_streak, longest_streak, updated_at

  3. Security
    - RLS enabled on users with standard ownership policies
    - Updated trigger to populate users table on signup
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  email text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own user record') THEN
    CREATE POLICY "Users can view own user record" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can insert own user record') THEN
    CREATE POLICY "Users can insert own user record" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own user record') THEN
    CREATE POLICY "Users can update own user record" ON users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Fix plans table: add missing columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'start_time') THEN
    ALTER TABLE plans ADD COLUMN start_time time;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'end_time') THEN
    ALTER TABLE plans ADD COLUMN end_time time;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'priority') THEN
    ALTER TABLE plans ADD COLUMN priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'completed') THEN
    ALTER TABLE plans ADD COLUMN completed boolean DEFAULT false;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'updated_at') THEN
    ALTER TABLE plans ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Fix tasks table: add missing columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'description') THEN
    ALTER TABLE tasks ADD COLUMN description text DEFAULT '';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'updated_at') THEN
    ALTER TABLE tasks ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Fix reminders table: add missing columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reminders' AND column_name = 'description') THEN
    ALTER TABLE reminders ADD COLUMN description text DEFAULT '';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reminders' AND column_name = 'updated_at') THEN
    ALTER TABLE reminders ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Fix habits table: add missing columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habits' AND column_name = 'description') THEN
    ALTER TABLE habits ADD COLUMN description text DEFAULT '';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habits' AND column_name = 'color') THEN
    ALTER TABLE habits ADD COLUMN color text DEFAULT '#2F5D50';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habits' AND column_name = 'icon') THEN
    ALTER TABLE habits ADD COLUMN icon text DEFAULT 'star';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habits' AND column_name = 'frequency') THEN
    ALTER TABLE habits ADD COLUMN frequency text DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habits' AND column_name = 'current_streak') THEN
    ALTER TABLE habits ADD COLUMN current_streak integer DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habits' AND column_name = 'longest_streak') THEN
    ALTER TABLE habits ADD COLUMN longest_streak integer DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habits' AND column_name = 'updated_at') THEN
    ALTER TABLE habits ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Update trigger to populate both profiles and users tables
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.users (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
