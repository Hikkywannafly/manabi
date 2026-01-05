/**
 * Type definitions for Flashcard Generation V2
 */

export interface ProgressStep {
  percent: number;
  message: string;
}

export interface FlashcardGenerationParams {
  difficulty?: string;
  numberOfCards?: number;
  flashcardType?: "QUESTIONS" | "VOCABULARY";
  language?: string;
  customInstructions?: string;
  task?: "generate" | "extract";
  parsingMode?: "fast" | "balanced" | "premium";
}

export interface FlashcardData {
  front: string;
  back: string;
  explanation?: string;
}

export interface DeckResponse {
  title: string;
  description?: string;
  flashcards: FlashcardData[];
}

export interface RequestPayload {
  filePath?: string;
  textContent?: string;
  youtubeUrl?: string;
  webpageUrl?: string;
  imageUrl?: string;
  deckId: string;
  generationParams?: FlashcardGenerationParams;
}

export interface DocumentChunk {
  pageContent: string;
  metadata: Record<string, unknown>;
}

export interface VectorDocument {
  content: string;
  metadata: Record<string, unknown>;
  embedding: number[];
}
