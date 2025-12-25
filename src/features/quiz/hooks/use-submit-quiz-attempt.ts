"use client";

import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { QuizService } from "../services/quiz-service";

export function useSubmitQuizAttempt() {
  return useMutation({
    mutationFn: async ({
      quizId,
      answers,
      totalTimeSpent,
    }: {
      quizId: string;
      answers: Array<{
        questionId: string;
        selectedOptionIds: string[];
        timeSpent: number;
      }>;
      totalTimeSpent: number;
    }) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      return QuizService.submitQuizAttempt(
        quizId,
        user.id,
        answers,
        totalTimeSpent,
      );
    },
  });
}
