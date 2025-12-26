"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-provider";
import { QuizService } from "../services/quiz-service";

interface UseQuizDetailOptions {
  quizId: string;
  enabled?: boolean;
}

export function useQuizDetail({
  quizId,
  enabled = true,
}: UseQuizDetailOptions) {
  const { user, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: ["quiz", quizId, user?.id],
    queryFn: () => QuizService.getQuizWithQuestions(quizId),
    enabled: enabled && !!quizId && !!user && !authLoading,
  });
}
