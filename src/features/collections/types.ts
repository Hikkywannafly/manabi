import type { Database } from "@/types/supabase";

export type Collection = Database["public"]["Tables"]["collections"]["Row"];

export interface CollectionDetail extends Collection {
  quizzes: CollectionQuiz[];
  decks: CollectionDeck[];
}

export interface CollectionQuiz {
  id: string;
  title: string;
  slug: string;
  created_at: string | null;
  visibility: Database["public"]["Enums"]["quiz_visibility"] | null;
  status: Database["public"]["Enums"]["quiz_status"] | null;
}

export interface CollectionDeck {
  id: string;
  title: string;
  slug: string;
  created_at: string | null;
  visibility: Database["public"]["Enums"]["deck_visibility"] | null;
  status: Database["public"]["Enums"]["deck_status"] | null;
}

export interface CollectionStats {
  totalQuizzes: number;
  totalDecks: number;
  totalItems: number;
}
