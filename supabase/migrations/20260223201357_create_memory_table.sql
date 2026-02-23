/*
  # Create memory table for user context

  1. New Tables
    - `memory`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content` (text - stores user preferences, context, notes)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `memory` table
    - Add policy for authenticated users to read their own memory
    - Add policy for authenticated users to create their own memory
    - Add policy for authenticated users to update their own memory
*/

CREATE TABLE IF NOT EXISTS memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own memory"
  ON memory
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own memory"
  ON memory
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memory"
  ON memory
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
