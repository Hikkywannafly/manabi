"use client";

import { useState } from "react";
import {
  generateFlashcardsFromFile,
  generateVocabularyFlashcards,
} from "@/features/flashcards/services/ai-flashcard.service";
import { FileParserService } from "@/features/flashcards/services/file-parser.service";
import { useFlashcardStore } from "@/features/flashcards/stores/use-flashcard-store";
import { rateLimiter } from "@/features/flashcards/utils/rate-limiter";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "success" | "error";
  progress: number;
  file?: File;
  parsedContent?: string;
  error?: string;
}

interface FlashProcessorSettings {
  generationMode?: "GENERATE" | "EXTRACT";
  flashcardType?: "QUESTIONS" | "VOCABULARY";
  fileProcessingMode?: string;
  visibility?: string;
  language?: string;
  numberOfCards?: number;
  difficulty?: string;
  parsingMode?: string;
}

export function useFlashProcessor() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setGeneratedFlashcards } = useFlashcardStore();

  const addFiles = (droppedFiles: File[]) => {
    const newFiles: UploadedFile[] = droppedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "success",
      progress: 100,
      file,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const generateFromFiles = async (settings: FlashProcessorSettings) => {
    if (uploadedFiles.length === 0) {
      throw new Error("No files to process");
    }

    // Check rate limit
    if (!rateLimiter.isAllowed("ai-generate-flashcards")) {
      const waitTime = rateLimiter.getTimeUntilNextRequest(
        "ai-generate-flashcards",
      );
      const seconds = Math.ceil(waitTime / 1000);
      throw new Error(
        `Rate limit exceeded. Please wait ${seconds} seconds before generating more flashcards.`,
      );
    }

    setIsProcessing(true);

    try {
      const uploadedFile = uploadedFiles[0];
      if (!uploadedFile.file) {
        throw new Error("File object not found");
      }

      // Get API key from environment
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
      if (!apiKey) {
        throw new Error("OpenRouter API key not configured");
      }

      // Parse file content
      const fileParser = new FileParserService();
      const fileContent = await fileParser.parseFile(uploadedFile.file);

      let result: any;

      // Route to appropriate API based on flashcard type
      if (settings.flashcardType === "VOCABULARY") {
        result = await generateVocabularyFlashcards({
          title: "Vocabulary Flashcards",
          description: "Generated from uploaded file",
          apiKey,
          fileContent,
          settings: {
            visibility: settings.visibility,
            language: settings.language,
            numberOfCards: settings.numberOfCards,
            difficulty: settings.difficulty,
            generationMode: settings.generationMode,
          },
        });
      } else {
        result = await generateFlashcardsFromFile({
          title: "AI Generated Flashcards",
          description: "Generated from uploaded file",
          apiKey,
          fileContent,
          settings: {
            visibility: settings.visibility,
            language: settings.language,
            numberOfCards: settings.numberOfCards,
            difficulty: settings.difficulty,
            generationMode: settings.generationMode,
            fileProcessing: settings.fileProcessingMode,
            parsingMode: settings.parsingMode,
          },
        });
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to generate flashcards");
      }

      // Validate flashcards array
      if (!(result.flashcards && Array.isArray(result.flashcards))) {
        console.error("❌ Invalid flashcards structure:", result);
        throw new Error("Invalid flashcards structure in API response");
      }

      if (result.flashcards.length === 0) {
        throw new Error(
          "No flashcards were generated. Please try again with different content.",
        );
      }

      // Store generated flashcards with proper metadata
      setGeneratedFlashcards(
        result.flashcards,
        result.title || "AI Generated Flashcards",
        result.description || "Generated from uploaded file",
        {
          flashcardType: settings.flashcardType || "QUESTIONS",
          difficulty:
            result.metadata?.difficulty || settings.difficulty || "EASY",
          total_cards: result.flashcards.length,
          estimated_study_time:
            result.metadata?.estimated_study_time ||
            Math.ceil(result.flashcards.length * 0.5),
        },
      );

      setIsProcessing(false);
      return result;
    } catch (error) {
      setIsProcessing(false);
      console.error("❌ Error in generateFromFiles:", error);
      throw error;
    }
  };

  const extractFromFilesAI = async (settings: FlashProcessorSettings) => {
    // For extract mode, use the same logic but with EXTRACT mode
    return generateFromFiles({
      ...settings,
      generationMode: "EXTRACT",
    });
  };

  return {
    uploadedFiles,
    addFiles,
    removeFile,
    generateFromFiles,
    extractFromFilesAI,
    isProcessing,
    hasFiles: uploadedFiles.length > 0,
  };
}
