import type { Database } from "@/types/supabase";

export type Quiz = Database["public"]["Tables"]["quizzes"]["Row"];
export type QuizQuestion =
  Database["public"]["Tables"]["quiz_questions"]["Row"];
export type QuizAttempt = Database["public"]["Tables"]["quiz_attempts"]["Row"];

export type QuizStatus = Database["public"]["Enums"]["quiz_status"];
export type QuestionType = Database["public"]["Enums"]["question_type"];

// Quiz Taking Types
export type QuizTakeMode = "exam" | "test";

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  timeSpent: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  performanceLevel?: "Learning" | "Excellent" | "Good" | "Needs Improvement";
  personalizedFeedback?: string;
  answers: Array<{
    questionId: string;
    questionText: string;
    selectedOptionId: string;
    correctOptionId: string;
    isCorrect: boolean;
    options: QuizQuestionOption[];
  }>;
}

export interface QuizQuestionOption {
  id: string;
  text: string;
}

export interface QuestionFeedback {
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
}

// Extended types for quiz taking with joined data
export interface QuizWithQuestions extends Quiz {
  questions: QuizQuestion[];
}

export interface QuizQuestionWithOptions extends QuizQuestion {
  parsedOptions: QuizQuestionOption[];
}
