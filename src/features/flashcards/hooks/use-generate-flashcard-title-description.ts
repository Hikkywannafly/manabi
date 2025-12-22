"use client";

import { useState } from "react";
import { generateFlashcardTitleDescription } from "@/features/flashcards/services/ai-flashcard.service";
import { useFlashcardStore } from "@/features/flashcards/stores/use-flashcard-store";

interface GenerateTitleOptions {
  isExtractMode: boolean;
  targetLanguage?: string;
  filename?: string;
  category?: string;
}

export function useGenerateFlashcardTitleDescription() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { updateFlashcardMetadata } = useFlashcardStore();

  const generateTitleDescription = async (
    content: string,
    flashcards: any[],
    options: GenerateTitleOptions,
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Get API key from environment
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
      if (!apiKey) {
        throw new Error("OpenRouter API key not configured");
      }

      const result = await generateFlashcardTitleDescription({
        content,
        flashcards,
        isExtractMode: options.isExtractMode,
        targetLanguage: options.targetLanguage || "auto",
        filename: options.filename,
        category: options.category,
        tags: [],
        apiKey,
      });

      if (result.success && result.title && result.description) {
        // Update store with new title and description
        updateFlashcardMetadata({
          title: result.title,
          description: result.description,
        });
      }

      setIsGenerating(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      setIsGenerating(false);
      // Don't throw - this is a non-blocking enhancement
      console.warn("⚠️ Failed to generate AI title (using fallback):", error);
      return { success: false, error: error.message };
    }
  };

  const reset = () => {
    setIsGenerating(false);
    setError(null);
  };

  return {
    generateTitleDescription,
    isGenerating,
    error,
    reset,
  };
}
