/*
  # Voice Commands Schema

  1. New Tables
    - `voice_tasks` - Tasks created via voice commands
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content` (text) - task description
      - `type` (text) - 'task', 'habit', or 'reminder'
      - `scheduled_time` (text) - extracted time like "14:00"
      - `completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `entry_date` (date) - for organizing by day

  2. Security
    - Enable RLS on `voice_tasks` table
    - Add policies for authenticated users to manage own tasks
*/

CREATE TABLE IF NOT EXISTS voice_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('task', 'habit', 'reminder')),
  scheduled_time text DEFAULT '',
  completed boolean DEFAULT false,
  entry_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE voice_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own voice tasks"
  ON voice_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own voice tasks"
  ON voice_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own voice tasks"
  ON voice_tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own voice tasks"
  ON voice_tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS voice_tasks_user_id_idx ON voice_tasks(user_id);
CREATE INDEX IF NOT EXISTS voice_tasks_entry_date_idx ON voice_tasks(entry_date);
CREATE INDEX IF NOT EXISTS voice_tasks_type_idx ON voice_tasks(type);
