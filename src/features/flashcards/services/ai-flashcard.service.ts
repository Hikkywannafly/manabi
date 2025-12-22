interface GenerateFlashcardsParams {
  title: string;
  description: string;
  apiKey: string;
  fileContent: string;
  settings?: {
    visibility?: string;
    language?: string;
    numberOfCards?: number;
    difficulty?: string;
    generationMode?: "GENERATE" | "EXTRACT";
    fileProcessing?: string;
    parsingMode?: string;
  };
}

interface GenerateVocabularyFlashcardsParams {
  title: string;
  description: string;
  apiKey: string;
  fileContent: string;
  settings?: {
    visibility?: string;
    language?: string;
    numberOfCards?: number;
    difficulty?: string;
    generationMode?: "GENERATE" | "EXTRACT";
  };
}

interface GenerateFlashcardTitleDescriptionParams {
  content: string;
  flashcards: any[];
  isExtractMode: boolean;
  targetLanguage?: string;
  filename?: string;
  category?: string;
  tags?: string[];
  apiKey: string;
}

interface FlashcardAPIResponse {
  success: boolean;
  title?: string;
  description?: string;
  flashcards?: any[];
  metadata?: any;
  selectedCategory?: string;
  error?: string;
  mode?: string;
  sourceFile?: string;
  processedCount?: number;
  flashcardType?: string;
}

/**
 * Generate Questions flashcards from file content
 */
export async function generateFlashcardsFromFile(
  params: GenerateFlashcardsParams,
): Promise<FlashcardAPIResponse> {
  const response = await fetch("/api/ai/generate-flashcards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: params.title,
      description: params.description,
      apiKey: params.apiKey,
      fileContent: params.fileContent,
      modelName: "google/gemini-2.0-flash-exp:free",
      settings: {
        visibility: params.settings?.visibility || "private",
        language: params.settings?.language || "auto",
        numberOfCards: params.settings?.numberOfCards || 5,
        difficulty: params.settings?.difficulty || "easy",
        generationMode: params.settings?.generationMode || "GENERATE",
        fileProcessing: params.settings?.fileProcessing || "PARSE_THEN_SEND",
        parsingMode: params.settings?.parsingMode || "balanced",
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to generate flashcards");
  }

  return response.json();
}

/**
 * Generate Vocabulary flashcards
 */
export async function generateVocabularyFlashcards(
  params: GenerateVocabularyFlashcardsParams,
): Promise<FlashcardAPIResponse> {
  const response = await fetch("/api/ai/generate-vocabulary-flashcards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: params.title,
      description: params.description,
      apiKey: params.apiKey,
      fileContent: params.fileContent,
      modelName: "google/gemini-2.0-flash-exp:free",
      settings: {
        visibility: params.settings?.visibility || "private",
        language: params.settings?.language || "auto",
        numberOfCards: params.settings?.numberOfCards || 10,
        difficulty: params.settings?.difficulty || "easy",
        generationMode: params.settings?.generationMode || "GENERATE",
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Failed to generate vocabulary flashcards",
    );
  }

  return response.json();
}

/**
 * Generate title and description for flashcards
 */
export async function generateFlashcardTitleDescription(
  params: GenerateFlashcardTitleDescriptionParams,
): Promise<FlashcardAPIResponse> {
  const response = await fetch(
    "/api/ai/generate-flashcards-title-description",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: params.content,
        flashcards: params.flashcards,
        isExtractMode: params.isExtractMode,
        targetLanguage: params.targetLanguage || "auto",
        filename: params.filename,
        category: params.category,
        tags: params.tags,
        modelName: "openai/gpt-4o-mini",
        apiKey: params.apiKey,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Failed to generate title and description",
    );
  }

  return response.json();
}
