-- Enable RLS on quizzes table (if not already enabled)
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own quizzes
CREATE POLICY "Users can view own quizzes" ON public.quizzes
  FOR SELECT
  USING (auth.uid() = owner_id);

-- Policy: Users can insert their own quizzes
CREATE POLICY "Users can create own quizzes" ON public.quizzes
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can update their own quizzes
CREATE POLICY "Users can update own quizzes" ON public.quizzes
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can delete their own quizzes
CREATE POLICY "Users can delete own quizzes" ON public.quizzes
  FOR DELETE
  USING (auth.uid() = owner_id);

-- Enable RLS on quiz_questions table
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view questions from their own quizzes
CREATE POLICY "Users can view own quiz questions" ON public.quiz_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND quizzes.owner_id = auth.uid()
    )
  );

-- Policy: Users can insert questions to their own quizzes
CREATE POLICY "Users can create own quiz questions" ON public.quiz_questions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND quizzes.owner_id = auth.uid()
    )
  );

-- Policy: Users can update questions in their own quizzes
CREATE POLICY "Users can update own quiz questions" ON public.quiz_questions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND quizzes.owner_id = auth.uid()
    )
  );

-- Policy: Users can delete questions from their own quizzes
CREATE POLICY "Users can delete own quiz questions" ON public.quiz_questions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND quizzes.owner_id = auth.uid()
    )
  );
