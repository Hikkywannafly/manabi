-- RLS Policies for quiz_attempts table

-- Policy: Users can view their own quiz attempts
CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own quiz attempts
CREATE POLICY "Users can create own quiz attempts" ON public.quiz_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own quiz attempts (optional, for future use)
CREATE POLICY "Users can update own quiz attempts" ON public.quiz_attempts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own quiz attempts (optional)
CREATE POLICY "Users can delete own quiz attempts" ON public.quiz_attempts
  FOR DELETE
  USING (auth.uid() = user_id);
