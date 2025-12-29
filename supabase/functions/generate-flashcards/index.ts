import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

import {
  ENV_VARS,
  ERROR_MESSAGES,
  LOGGING_CONFIG,
  PROGRESS_STEPS,
} from "./config.ts";
import { AIService } from "./services/ai.service.ts";
import { DeckService } from "./services/deck.service.ts";
import { StorageService } from "./services/storage.service.ts";
import type { FlashcardGenerationParams, RequestPayload } from "./types.ts";
import { Logger } from "./utils/logger.ts";
import { ProgressTracker } from "./utils/progress.ts";

// ============================================================================
// CONSTANTS
// ============================================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// MAIN HANDLER
// ============================================================================

class FlashcardGenerationHandler {
  private supabase;
  private storageService: StorageService;
  private aiService: AIService;
  private deckService: DeckService;
  private progressTracker: ProgressTracker;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    openRouterApiKey: string,
    deckId: string,
    generationParams?: FlashcardGenerationParams,
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.storageService = new StorageService(this.supabase);
    this.aiService = new AIService(openRouterApiKey);
    this.deckService = new DeckService(this.supabase);
    this.progressTracker = new ProgressTracker(
      this.supabase,
      deckId,
      generationParams,
    );
  }

  async execute(
    filePath: string | undefined,
    textContent: string | undefined,
    deckId: string,
  ): Promise<{
    success: boolean;
    count: number;
    title: string;
  }> {
    let shouldCleanupFile = false;

    try {
      let contentData: string;
      let processedMimeType: string;

      // Determine content source
      if (textContent) {
        Logger.info("Using direct text content");
        contentData = textContent;
        processedMimeType = "text/plain";

        await this.progressTracker.update(
          PROGRESS_STEPS.CONVERT.percent,
          PROGRESS_STEPS.CONVERT.message,
        );
      } else if (filePath) {
        shouldCleanupFile = true;

        // Step 1: Download file
        await this.progressTracker.update(
          PROGRESS_STEPS.DOWNLOAD.percent,
          PROGRESS_STEPS.DOWNLOAD.message,
        );
        const { data: fileBlob, mimeType } =
          await this.storageService.downloadFile(filePath);

        // Step 2: Process file
        await this.progressTracker.update(
          PROGRESS_STEPS.CONVERT.percent,
          PROGRESS_STEPS.CONVERT.message,
        );

        processedMimeType = mimeType;

        const isDocx =
          mimeType.includes("wordprocessingml") || mimeType.includes("msword");

        if (isDocx) {
          contentData = await this.storageService.extractTextFromDocx(fileBlob);
          processedMimeType = "text/plain";
        } else {
          contentData = await this.storageService.convertToBase64(fileBlob);
        }
      } else {
        throw new Error("Either filePath or textContent must be provided");
      }

      // Step 3: Generate flashcards with AI
      await this.progressTracker.update(
        PROGRESS_STEPS.ANALYZE.percent,
        PROGRESS_STEPS.ANALYZE.message,
      );

      const aiResponse = await this.aiService.generateFlashcards(
        contentData,
        processedMimeType,
        this.progressTracker.generationParams,
      );

      // Step 4: Parse response (included in AI service)
      await this.progressTracker.update(
        PROGRESS_STEPS.PARSE.percent,
        PROGRESS_STEPS.PARSE.message,
      );

      // Step 5: Save to database
      await this.progressTracker.update(
        PROGRESS_STEPS.SAVE.percent,
        PROGRESS_STEPS.SAVE.message,
      );

      await this.deckService.saveFlashcards(deckId, aiResponse.flashcards);
      await this.deckService.updateDeckMetadata(deckId, aiResponse.title);

      // Step 6: Update status
      await this.deckService.updateStatus(deckId, "ready");

      // Complete
      await this.progressTracker.update(
        PROGRESS_STEPS.COMPLETE.percent,
        PROGRESS_STEPS.COMPLETE.message,
        { title: aiResponse.title },
      );

      return {
        success: true,
        count: aiResponse.flashcards.length,
        title: aiResponse.title,
      };
    } finally {
      // Auto-cleanup
      if (shouldCleanupFile && filePath) {
        await this.storageService.deleteFile(filePath);
      }
    }
  }
}

// ============================================================================
// EDGE FUNCTION ENTRY POINT
// ============================================================================

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    Logger.info(`${LOGGING_CONFIG.emojis.rocket} Flashcard generation started`);

    // Parse request
    const payload: RequestPayload = await req.json();
    const { filePath, textContent, deckId, generationParams } = payload;

    if (!((filePath || textContent) && deckId)) {
      throw new Error(
        "Missing required fields: (filePath or textContent) and deckId",
      );
    }

    Logger.info("Request payload", {
      filePath,
      textContent: textContent ? "provided" : "none",
      deckId,
      generationParams,
    });

    // Validate environment variables
    const supabaseUrl = Deno.env.get(ENV_VARS.supabaseUrl);
    const supabaseKey = Deno.env.get(ENV_VARS.supabaseKey);
    const openRouterApiKey = Deno.env.get(ENV_VARS.openRouterApiKey);

    if (!(supabaseUrl && supabaseKey)) {
      throw new Error(ERROR_MESSAGES.missingSupabaseEnv);
    }

    if (!openRouterApiKey) {
      throw new Error(ERROR_MESSAGES.missingOpenRouterKey);
    }

    // Execute generation
    const handler = new FlashcardGenerationHandler(
      supabaseUrl,
      supabaseKey,
      openRouterApiKey,
      deckId,
      generationParams,
    );

    const result = await handler.execute(filePath, textContent, deckId);

    Logger.celebrate("Flashcard generation completed!");
    Logger.success("Result", result);

    return new Response(JSON.stringify(result), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (error) {
    Logger.boom("Flashcard generation failed");
    Logger.error("Error details", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Try to update deck status to failed
    try {
      const payload = await req
        .clone()
        .json()
        .catch(() => ({}));
      if (payload.deckId) {
        const supabaseUrl = Deno.env.get(ENV_VARS.supabaseUrl);
        const supabaseKey = Deno.env.get(ENV_VARS.supabaseKey);

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const deckService = new DeckService(supabase);
          await deckService.updateStatus(
            payload.deckId,
            "failed",
            errorMessage,
          );
        }
      }
    } catch (_updateError) {
      // Ignore
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorStack,
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
});
