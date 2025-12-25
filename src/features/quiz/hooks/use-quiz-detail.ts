"use client";

import { useQuery } from "@tanstack/react-query";
import { QuizService } from "../services/quiz-service";

interface UseQuizDetailOptions {
  quizId: string;
  enabled?: boolean;
}

export function useQuizDetail({
  quizId,
  enabled = true,
}: UseQuizDetailOptions) {
  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => QuizService.getQuizWithQuestions(quizId),
    enabled: enabled && !!quizId,
  });
}
