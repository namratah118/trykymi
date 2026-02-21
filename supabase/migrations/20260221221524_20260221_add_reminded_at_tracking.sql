/*
  # Add reminder alert tracking

  1. New Columns
    - `reminded_at` timestamp to track when a reminder has been alerted
    - `dismissed_at` timestamp to track when user dismissed an alert

  2. Changes
    - Adds columns to track reminder delivery and dismissal
    - Allows proper handling of reminders across sessions
    - Prevents duplicate alerts for the same reminder

  3. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminders' AND column_name = 'reminded_at'
  ) THEN
    ALTER TABLE reminders ADD COLUMN reminded_at timestamp with time zone DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminders' AND column_name = 'dismissed_at'
  ) THEN
    ALTER TABLE reminders ADD COLUMN dismissed_at timestamp with time zone DEFAULT NULL;
  END IF;
END $$;
