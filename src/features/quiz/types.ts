import type { Database } from "@/types/supabase";

export type Quiz = Database["public"]["Tables"]["quizzes"]["Row"];
export type QuizQuestion =
  Database["public"]["Tables"]["quiz_questions"]["Row"];
export type QuizAttempt = Database["public"]["Tables"]["quiz_attempts"]["Row"];

export type QuizStatus = Database["public"]["Enums"]["quiz_status"];
