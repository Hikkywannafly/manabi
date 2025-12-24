import { z } from "zod";

export const quizCreationSchema = z.object({
  visibility: z.enum(["public", "private", "shared"]),
  language: z.string(),
  questionType: z.enum([
    "mixed",
    "multiple_choice",
    "true_false",
    "fill_in_blank",
    "short_answer",
  ]),
  numberOfQuestions: z.string(),
  mode: z.enum(["quiz", "exam"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  task: z.enum(["generate", "extract"]),
  parsingMode: z.enum(["fast", "balanced", "premium"]),
  customInstructions: z.string().optional(),
});

export type QuizCreationValues = z.infer<typeof quizCreationSchema>;
