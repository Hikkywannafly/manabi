-- Optimize RLS policies by wrapping auth.uid() in subqueries
-- This prevents unnecessary re-evaluation for each row

-- ============================================================================
-- NOTES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
CREATE POLICY "Users can view their own notes"
  ON public.notes
  FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
CREATE POLICY "Users can insert their own notes"
  ON public.notes
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
CREATE POLICY "Users can update their own notes"
  ON public.notes
  FOR UPDATE
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
CREATE POLICY "Users can delete their own notes"
  ON public.notes
  FOR DELETE
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- DECKS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own decks" ON public.decks;
CREATE POLICY "Users can view their own decks"
  ON public.decks
  FOR SELECT
  USING ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Users can insert their own decks" ON public.decks;
CREATE POLICY "Users can insert their own decks"
  ON public.decks
  FOR INSERT
  WITH CHECK ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Users can update their own decks" ON public.decks;
CREATE POLICY "Users can update their own decks"
  ON public.decks
  FOR UPDATE
  USING ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Users can delete their own decks" ON public.decks;
CREATE POLICY "Users can delete their own decks"
  ON public.decks
  FOR DELETE
  USING ((select auth.uid()) = owner_id);

-- ============================================================================
-- FLASHCARDS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view flashcards from their decks" ON public.flashcards;
CREATE POLICY "Users can view flashcards from their decks"
  ON public.flashcards
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.decks
    WHERE decks.id = flashcards.deck_id
    AND decks.owner_id = (select auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert flashcards to their decks" ON public.flashcards;
CREATE POLICY "Users can insert flashcards to their decks"
  ON public.flashcards
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.decks
    WHERE decks.id = flashcards.deck_id
    AND decks.owner_id = (select auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update flashcards in their decks" ON public.flashcards;
CREATE POLICY "Users can update flashcards in their decks"
  ON public.flashcards
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.decks
    WHERE decks.id = flashcards.deck_id
    AND decks.owner_id = (select auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete flashcards from their decks" ON public.flashcards;
CREATE POLICY "Users can delete flashcards from their decks"
  ON public.flashcards
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.decks
    WHERE decks.id = flashcards.deck_id
    AND decks.owner_id = (select auth.uid())
  ));

-- ============================================================================
-- FLASHCARD_REVIEWS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.flashcard_reviews;
CREATE POLICY "Users can view their own reviews"
  ON public.flashcard_reviews
  FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.flashcard_reviews;
CREATE POLICY "Users can insert their own reviews"
  ON public.flashcard_reviews
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.flashcard_reviews;
CREATE POLICY "Users can update their own reviews"
  ON public.flashcard_reviews
  FOR UPDATE
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- USER_MISSIONS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own missions" ON public.user_missions;
CREATE POLICY "Users can view their own missions"
  ON public.user_missions
  FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own missions" ON public.user_missions;
CREATE POLICY "Users can insert their own missions"
  ON public.user_missions
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own missions" ON public.user_missions;
CREATE POLICY "Users can update their own missions"
  ON public.user_missions
  FOR UPDATE
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- MATERIALS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can crud their own materials" ON public.materials;
CREATE POLICY "Users can crud their own materials"
  ON public.materials
  FOR ALL
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- POMODORO_SESSIONS TABLE (Remove duplicates)
-- ============================================================================
DROP POLICY IF EXISTS "Users can crud their own pomodoro sessions" ON public.pomodoro_sessions;
DROP POLICY IF EXISTS "users_can_insert_sessions" ON public.pomodoro_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.pomodoro_sessions;

CREATE POLICY "Users can crud their own pomodoro sessions"
  ON public.pomodoro_sessions
  FOR ALL
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- USER_ACHIEVEMENTS TABLE (Remove duplicates)
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own data" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can update their own data" ON public.user_achievements;
DROP POLICY IF EXISTS "User achievements are viewable by everyone" ON public.user_achievements;

-- Users can view their own achievements
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements
  FOR SELECT
  USING ((select auth.uid()) = user_id);

-- Users can update their own achievements
CREATE POLICY "Users can update their own achievements"
  ON public.user_achievements
  FOR UPDATE
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- USER_DAILY_STATS TABLE (Remove duplicates)
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_daily_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_daily_stats;

CREATE POLICY "Users can view their own stats"
  ON public.user_daily_stats
  FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_daily_stats
  FOR UPDATE
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- QUIZZES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own quizzes" ON public.quizzes;
CREATE POLICY "Users can view own quizzes"
  ON public.quizzes
  FOR SELECT
  USING ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Users can create own quizzes" ON public.quizzes;
CREATE POLICY "Users can create own quizzes"
  ON public.quizzes
  FOR INSERT
  WITH CHECK ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Users can update own quizzes" ON public.quizzes;
CREATE POLICY "Users can update own quizzes"
  ON public.quizzes
  FOR UPDATE
  USING ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Users can delete own quizzes" ON public.quizzes;
CREATE POLICY "Users can delete own quizzes"
  ON public.quizzes
  FOR DELETE
  USING ((select auth.uid()) = owner_id);

-- ============================================================================
-- QUIZ_QUESTIONS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own quiz questions" ON public.quiz_questions;
CREATE POLICY "Users can view own quiz questions"
  ON public.quiz_questions
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = quiz_questions.quiz_id
    AND quizzes.owner_id = (select auth.uid())
  ));

DROP POLICY IF EXISTS "Users can create own quiz questions" ON public.quiz_questions;
CREATE POLICY "Users can create own quiz questions"
  ON public.quiz_questions
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = quiz_questions.quiz_id
    AND quizzes.owner_id = (select auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update own quiz questions" ON public.quiz_questions;
CREATE POLICY "Users can update own quiz questions"
  ON public.quiz_questions
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = quiz_questions.quiz_id
    AND quizzes.owner_id = (select auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete own quiz questions" ON public.quiz_questions;
CREATE POLICY "Users can delete own quiz questions"
  ON public.quiz_questions
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = quiz_questions.quiz_id
    AND quizzes.owner_id = (select auth.uid())
  ));

-- ============================================================================
-- QUIZ_ATTEMPTS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON public.quiz_attempts
  FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can create own quiz attempts"
  ON public.quiz_attempts
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- ACHIEVEMENTS TABLE (Remove duplicate policies)
-- ============================================================================
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON public.achievements;
DROP POLICY IF EXISTS "Public achievements are viewable by everyone" ON public.achievements;

CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements
  FOR SELECT
  USING (true);
