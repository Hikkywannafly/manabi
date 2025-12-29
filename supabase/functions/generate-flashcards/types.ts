export type FlashcardGenerationParams = {
  difficulty: "Easy" | "Medium" | "Hard";
  numberOfCards: number;
  language: string;
  parsingMode: "fast" | "balanced";
  customInstructions?: string;
};

export type RequestPayload = {
  filePath?: string;
  textContent?: string;
  deckId: string;
  generationParams?: FlashcardGenerationParams;
};

export type FlashcardData = {
  front: string;
  back: string;
};

export type AIResponse = {
  title: string;
  flashcards: FlashcardData[];
};

export type DeckStatus = "draft" | "generating" | "ready" | "failed";
