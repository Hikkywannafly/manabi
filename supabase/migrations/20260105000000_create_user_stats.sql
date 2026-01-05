-- Create user_stats table for daily aggregated statistics
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  focus_minutes INTEGER DEFAULT 0,
  sessions_count INTEGER DEFAULT 0,
  quiz_count INTEGER DEFAULT 0,
  flashcard_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Add indexes
CREATE INDEX idx_user_stats_user_date ON user_stats(user_id, date DESC);
CREATE INDEX idx_user_stats_date ON user_stats(date);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to calculate current study streak from ALL study activities
CREATE OR REPLACE FUNCTION calculate_study_streak(p_user_id UUID)
RETURNS TABLE(current_streak INTEGER, longest_streak INTEGER) AS $$
DECLARE
  v_current_streak INTEGER := 0;
  v_longest_streak INTEGER := 0;
  v_temp_streak INTEGER := 0;
  v_prev_date DATE;
  v_current_date DATE;
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
  -- Get all distinct dates with ANY study activity
  FOR v_current_date IN
    SELECT DISTINCT activity_date
    FROM (
      -- Pomodoro sessions
      SELECT DISTINCT DATE(start_time) as activity_date
      FROM pomodoro_sessions
      WHERE user_id = p_user_id

      UNION

      -- Quiz attempts
      SELECT DISTINCT DATE(completed_at) as activity_date
      FROM quiz_attempts
      WHERE user_id = p_user_id AND completed_at IS NOT NULL

      UNION

      -- Flashcard reviews
      SELECT DISTINCT DATE(last_reviewed) as activity_date
      FROM flashcard_reviews
      WHERE user_id = p_user_id AND last_reviewed IS NOT NULL
    ) all_activities
    ORDER BY activity_date DESC
  LOOP
    -- Calculate current streak (must include today or yesterday)
    IF v_current_streak = 0 THEN
      IF v_current_date = v_today OR v_current_date = v_yesterday THEN
        v_current_streak := 1;
        v_prev_date := v_current_date;
      ELSE
        -- Streak is broken
        EXIT;
      END IF;
    ELSE
      -- Check if consecutive day
      IF v_current_date = v_prev_date - INTERVAL '1 day' THEN
        v_current_streak := v_current_streak + 1;
        v_prev_date := v_current_date;
      ELSE
        EXIT;
      END IF;
    END IF;
  END LOOP;

  -- Calculate longest streak
  v_temp_streak := 0;
  v_prev_date := NULL;

  FOR v_current_date IN
    SELECT DISTINCT activity_date
    FROM (
      SELECT DISTINCT DATE(start_time) as activity_date
      FROM pomodoro_sessions
      WHERE user_id = p_user_id

      UNION

      SELECT DISTINCT DATE(completed_at) as activity_date
      FROM quiz_attempts
      WHERE user_id = p_user_id AND completed_at IS NOT NULL

      UNION

      SELECT DISTINCT DATE(last_reviewed) as activity_date
      FROM flashcard_reviews
      WHERE user_id = p_user_id AND last_reviewed IS NOT NULL
    ) all_activities
    ORDER BY activity_date ASC
  LOOP
    IF v_prev_date IS NULL THEN
      v_temp_streak := 1;
    ELSIF v_current_date = v_prev_date + INTERVAL '1 day' THEN
      v_temp_streak := v_temp_streak + 1;
    ELSE
      v_longest_streak := GREATEST(v_longest_streak, v_temp_streak);
      v_temp_streak := 1;
    END IF;
    v_prev_date := v_current_date;
  END LOOP;

  v_longest_streak := GREATEST(v_longest_streak, v_temp_streak);

  RETURN QUERY SELECT v_current_streak, v_longest_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
