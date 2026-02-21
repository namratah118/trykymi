
/*
  # Onboarding & Time Tracking Schema

  ## New Columns on users table
    - onboarding_completed (boolean) - tracks if user finished onboarding
    - focus_areas (text[]) - areas user wants to improve
    - time_wasters (text[]) - where user loses time
    - tracking_prefs (text[]) - what user wants to track
    - main_goal (text) - primary goal
    - reminder_times (text[]) - preferred reminder times

  ## New Tables
    - time_entries - tracks time lost and time won
      - id, user_id, type (lost/won), activity, duration_minutes, entry_date
*/

-- Add onboarding columns to users table
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'onboarding_completed') THEN
    ALTER TABLE users ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'focus_areas') THEN
    ALTER TABLE users ADD COLUMN focus_areas text[] DEFAULT '{}';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'time_wasters') THEN
    ALTER TABLE users ADD COLUMN time_wasters text[] DEFAULT '{}';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tracking_prefs') THEN
    ALTER TABLE users ADD COLUMN tracking_prefs text[] DEFAULT '{}';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'main_goal') THEN
    ALTER TABLE users ADD COLUMN main_goal text DEFAULT '';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'reminder_times') THEN
    ALTER TABLE users ADD COLUMN reminder_times text[] DEFAULT '{}';
  END IF;
END $$;

-- Create time_entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('lost', 'won')),
  activity text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 0,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'time_entries' AND policyname = 'Users can view own time entries') THEN
    CREATE POLICY "Users can view own time entries" ON time_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'time_entries' AND policyname = 'Users can insert own time entries') THEN
    CREATE POLICY "Users can insert own time entries" ON time_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'time_entries' AND policyname = 'Users can delete own time entries') THEN
    CREATE POLICY "Users can delete own time entries" ON time_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS time_entries_user_id_idx ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS time_entries_entry_date_idx ON time_entries(entry_date);
