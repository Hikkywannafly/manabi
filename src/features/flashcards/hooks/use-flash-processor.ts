"use client";

import { useState } from "react";
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
  customInstructions?: string;
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

      // Create Supabase client
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      // Get authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Upload file to Supabase Storage
      const fileExt = uploadedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(fileName, uploadedFile.file);

      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      // 2. Create deck record with generating status
      const { data: deck, error: deckError } = await supabase
        .from("decks")
        .insert({
          owner_id: user.id,
          title: "Processing...",
          status: "generating",
        })
        .select()
        .single();

      if (deckError || !deck) {
        throw new Error(`Failed to create deck: ${deckError?.message}`);
      }

      // 3. Call generate-flashcard-v2 Edge Function
      const { data, error } = await supabase.functions.invoke(
        "generate-flashcard-v2",
        {
          body: {
            deckId: deck.id,
            filePath: fileName,
            generationParams: {
              difficulty: settings.difficulty,
              numberOfCards: settings.numberOfCards,
              flashcardType: settings.flashcardType,
              language: settings.language,
              parsingMode: settings.parsingMode,
              task: settings.generationMode?.toLowerCase(),
              customInstructions: settings.customInstructions,
            },
          },
        },
      );

      if (error) {
        throw new Error(error.message || "Edge Function invocation failed");
      }

      if (!data?.success) {
        throw new Error(data?.error || "Failed to generate flashcards");
      }

      // 4. Fetch generated flashcards from database
      const { data: flashcards, error: flashcardsError } = await supabase
        .from("flashcards")
        .select("*")
        .eq("deck_id", deck.id)
        .order("order_index");

      if (flashcardsError) {
        throw new Error(
          `Failed to fetch flashcards: ${flashcardsError.message}`,
        );
      }

      // 5. Store in local state for editing (map to GeneratedFlashcard format)
      const mappedFlashcards = (flashcards || []).map((f) => ({
        id: f.id || Math.random().toString(36).substring(7),
        front: f.front,
        back: f.back,
      }));

      setGeneratedFlashcards(
        mappedFlashcards,
        data.title || "AI Generated Flashcards",
        deck.description || "Generated from uploaded file",
        {
          flashcardType: settings.flashcardType || "QUESTIONS",
          difficulty: settings.difficulty || "easy",
          total_cards: flashcards?.length || 0,
          estimated_study_time: Math.ceil((flashcards?.length || 0) * 0.5),
        },
      );

      setIsProcessing(false);
      return {
        success: true,
        flashcards: mappedFlashcards,
        title: data.title,
      };
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
