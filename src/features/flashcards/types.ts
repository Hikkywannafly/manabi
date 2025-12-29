import type { Database } from "@/types/supabase";

export type Deck = Database["public"]["Tables"]["decks"]["Row"];
export type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"];

export type FlashcardGenerationParams = {
  difficulty: "Easy" | "Medium" | "Hard";
  numberOfCards: number;
  language: string;
  parsingMode: "fast" | "balanced";
  customInstructions?: string;
};

export type DeckInsert = Database["public"]["Tables"]["decks"]["Insert"];
export type FlashcardInsert =
  Database["public"]["Tables"]["flashcards"]["Insert"];
