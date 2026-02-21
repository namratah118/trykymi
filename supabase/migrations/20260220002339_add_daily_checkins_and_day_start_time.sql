/*
  # Add daily check-ins table and day_start_time to users

  1. Changes to users table
    - `day_start_time` (text) - The user's preferred day start time from onboarding (e.g., "07:00")

  2. New Tables
    - `daily_checkins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `checkin_date` (date) - The date of the check-in
      - `mood` (text) - One of: amazing, good, okay, bad, stressed
      - `message` (text) - User's free-text reflection
      - `ai_response` (text) - AI-generated analysis
      - `productivity_score` (integer) - AI-estimated score 0-100
      - `time_lost_minutes` (integer) - AI-estimated time lost in minutes
      - `created_at` (timestamptz)

  3. Security
    - Enable RLS on `daily_checkins`
    - Users can only read/write their own check-ins
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'day_start_time'
  ) THEN
    ALTER TABLE users ADD COLUMN day_start_time text DEFAULT '07:00';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS daily_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date date NOT NULL DEFAULT CURRENT_DATE,
  mood text NOT NULL DEFAULT 'okay',
  message text DEFAULT '',
  ai_response text DEFAULT '',
  productivity_score integer DEFAULT 50,
  time_lost_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, checkin_date)
);

ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own checkins"
  ON daily_checkins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins"
  ON daily_checkins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkins"
  ON daily_checkins FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS daily_checkins_user_id_date_idx ON daily_checkins(user_id, checkin_date);
