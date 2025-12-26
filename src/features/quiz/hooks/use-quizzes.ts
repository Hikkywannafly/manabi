"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-provider";
import { QuizService } from "../services/quiz-service";

export function useQuizzes() {
  const { user, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: ["quizzes", user?.id],
    queryFn: () => QuizService.getQuizzes(),
    enabled: !!user && !authLoading,
  });
}
