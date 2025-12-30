import { z } from "zod";

const questionTypeValues = [
  "mixed",
  "multiple_choice",
  "true_false",
  "fill_in_blank",
  "short_answer",
] as const;

export const quizCreationSchema = z.object({
  visibility: z.enum(["public", "private", "shared"]),
  language: z.string(),
  // Changed to array for multi-select support
  questionTypes: z
    .array(z.enum(questionTypeValues))
    .min(1, "Select at least one question type"),
  numberOfQuestions: z.string(),
  mode: z.enum(["quiz", "exam"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  task: z.enum(["generate", "extract"]),
  parsingMode: z.enum(["fast", "balanced", "premium"]),
  customInstructions: z.string().optional(),
});

export type QuizCreationValues = z.infer<typeof quizCreationSchema>;
export type QuestionType = (typeof questionTypeValues)[number];
