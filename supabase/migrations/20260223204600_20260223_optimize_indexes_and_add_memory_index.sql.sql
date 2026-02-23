/*
  # Optimize Database Indexes

  1. **Replace Unused Single-Column Indexes with Composite Indexes**
    - Removes ineffective single-column user_id indexes that aren't being utilized
    - Creates composite indexes covering user_id and commonly filtered columns (created_at, completed, etc.)
    - Composite indexes are more efficient for the actual query patterns used in the application

  2. **Add Missing Index for Memory Table**
    - Add composite index on memory table for user_id and created_at
    - Ensures foreign key performance for memory records

  3. **Index Strategy**
    - Each table gets a composite index starting with user_id (for RLS filtering)
    - Secondary columns are those commonly filtered in WHERE clauses
    - This covers most query patterns: fetching user data filtered by status, date, or completion state

  4. **Important Notes**
    - Composite indexes starting with user_id will be used for RLS foreign key constraints
    - These indexes support both (user_id) and (user_id, other_column) queries efficiently
    - All existing unique constraints and primary keys are preserved
*/

-- Drop unused single-column user_id indexes
DROP INDEX IF EXISTS chat_messages_user_id_idx;
DROP INDEX IF EXISTS habit_completions_user_id_idx;
DROP INDEX IF EXISTS habit_logs_user_id_idx;
DROP INDEX IF EXISTS habits_user_id_idx;
DROP INDEX IF EXISTS plans_user_id_idx;
DROP INDEX IF EXISTS reminders_user_id_idx;
DROP INDEX IF EXISTS tasks_user_id_idx;
DROP INDEX IF EXISTS voice_tasks_user_id_idx;

-- Create composite indexes for better query performance
CREATE INDEX IF NOT EXISTS chat_messages_user_id_created_at_idx ON chat_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS habit_completions_user_id_completed_date_idx ON habit_completions(user_id, completed_date DESC);
CREATE INDEX IF NOT EXISTS habit_logs_user_id_logged_date_idx ON habit_logs(user_id, logged_date DESC);
CREATE INDEX IF NOT EXISTS habits_user_id_created_at_idx ON habits(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS plans_user_id_completed_idx ON plans(user_id, completed);
CREATE INDEX IF NOT EXISTS reminders_user_id_completed_idx ON reminders(user_id, completed);
CREATE INDEX IF NOT EXISTS tasks_user_id_completed_idx ON tasks(user_id, completed);
CREATE INDEX IF NOT EXISTS voice_tasks_user_id_entry_date_idx ON voice_tasks(user_id, entry_date DESC);

-- Add missing index for memory table
CREATE INDEX IF NOT EXISTS memory_user_id_created_at_idx ON memory(user_id, created_at DESC);
