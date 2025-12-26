"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-provider";
import { QuizService } from "../services/quiz-service";

export function useQuizHistory(quizId: string) {
  const { user, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: ["quiz-history", quizId, user?.id],
    queryFn: () => QuizService.getQuizHistory(quizId),
    enabled: !!quizId && !!user && !authLoading,
  });
}
