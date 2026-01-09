import { z } from "zod";

export const flashcardCreationSchema = z.object({
  visibility: z.enum(["public", "private"]),
  language: z.string(),
  targetLanguage: z.string().optional(), // Translation target for VOCABULARY mode
  numberOfCards: z.string(), // "5-10", "11-20", "21-30", "auto"
  difficulty: z.enum(["easy", "medium", "hard"]),
  flashcardType: z.enum(["QUESTIONS", "VOCABULARY"]),
  parsingMode: z.enum(["fast", "balanced"]),
  customInstructions: z.string().max(500),
});

export type FlashcardCreationValues = z.infer<typeof flashcardCreationSchema>;
