import type { Database } from "@/types/supabase";

export type Deck = Database["public"]["Tables"]["decks"]["Row"];
export type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"];

export type FlashcardGenerationParams = {
  difficulty: "Easy" | "Medium" | "Hard" | "easy" | "medium" | "hard";
  numberOfCards: number;
  language: string;
  flashcardType: "QUESTIONS" | "VOCABULARY";
  parsingMode: "fast" | "balanced" | "premium";
  task: "generate" | "extract";
  customInstructions?: string;
};

export type DeckInsert = Database["public"]["Tables"]["decks"]["Insert"];
export type FlashcardInsert =
  Database["public"]["Tables"]["flashcards"]["Insert"];

export type FlashcardReview =
  Database["public"]["Tables"]["flashcard_reviews"]["Row"];

export type FlashcardWithReview = Flashcard & {
  flashcard_reviews?: FlashcardReview[];
};
