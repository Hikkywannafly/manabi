import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// Import types and config
import {
  ENV_VARS,
  ERROR_MESSAGES,
  LOGGING_CONFIG,
  PROGRESS_STEPS,
} from "./config.ts";
// Import Services
import { AIService } from "./services/ai.service.ts";
import { QuizService } from "./services/quiz.service.ts";
import { StorageService } from "./services/storage.service.ts";
import type { GenerationParams, RequestPayload } from "./types.ts";
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

class QuizGenerationHandler {
  private supabase;
  private storageService: StorageService;
  private aiService: AIService;
  private quizService: QuizService;
  private progressTracker: ProgressTracker;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    openRouterApiKey: string,
    quizId: string,
    generationParams?: GenerationParams,
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.storageService = new StorageService(this.supabase);
    this.aiService = new AIService(openRouterApiKey);
    this.quizService = new QuizService(this.supabase);
    this.progressTracker = new ProgressTracker(
      this.supabase,
      quizId,
      generationParams,
    );
  }

  async execute(
    filePath: string | undefined,
    textContent: string | undefined,
    quizId: string,
  ): Promise<{
    success: boolean;
    count: number;
    title: string;
    slug: string;
  }> {
    let shouldCleanupFile = false;

    try {
      let contentData: string;
      let processedMimeType: string;

      // Determine content source
      if (textContent) {
        // Direct text processing (no storage involved)
        Logger.info("Using direct text content (no file download)");
        contentData = textContent;
        processedMimeType = "text/plain";

        await this.progressTracker.update(
          PROGRESS_STEPS.CONVERT.percent,
          PROGRESS_STEPS.CONVERT.message,
        );
      } else if (filePath) {
        // File-based processing (download from storage)
        shouldCleanupFile = true; // Mark for cleanup

        // Step 1: Download file
        await this.progressTracker.update(
          PROGRESS_STEPS.DOWNLOAD.percent,
          PROGRESS_STEPS.DOWNLOAD.message,
        );
        const { data: fileBlob, mimeType } =
          await this.storageService.downloadFile(filePath);

        // Step 2: Process file based on type
        await this.progressTracker.update(
          PROGRESS_STEPS.CONVERT.percent,
          PROGRESS_STEPS.CONVERT.message,
        );

        processedMimeType = mimeType;

        // Check if file is DOCX
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

      // Step 3: Generate quiz with AI
      await this.progressTracker.update(
        PROGRESS_STEPS.ANALYZE.percent,
        PROGRESS_STEPS.ANALYZE.message,
      );
      const aiResponse = await this.aiService.generateQuiz(
        contentData,
        processedMimeType,
        this.progressTracker.generationParams,
      );

      // Step 4: Parse response
      await this.progressTracker.update(
        PROGRESS_STEPS.PARSE.percent,
        PROGRESS_STEPS.PARSE.message,
      );

      // Step 5: Save to database
      await this.progressTracker.update(
        PROGRESS_STEPS.SAVE.percent,
        PROGRESS_STEPS.SAVE.message,
      );
      await this.quizService.saveQuestions(quizId, aiResponse.questions);
      const slug = await this.quizService.updateQuizMetadata(
        quizId,
        aiResponse.title,
      );

      // Step 6: Update status
      await this.progressTracker.update(
        PROGRESS_STEPS.UPDATE.percent,
        PROGRESS_STEPS.UPDATE.message,
      );
      await this.quizService.updateStatus(quizId, "ready");

      // Complete
      await this.progressTracker.update(
        PROGRESS_STEPS.COMPLETE.percent,
        PROGRESS_STEPS.COMPLETE.message,
        { title: aiResponse.title, slug },
      );

      return {
        success: true,
        count: aiResponse.questions.length,
        title: aiResponse.title,
        slug,
      };
    } finally {
      // Auto-cleanup: Delete temporary file if it was uploaded
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
    Logger.info(`${LOGGING_CONFIG.emojis.rocket} Quiz generation started`);

    // Parse and validate request
    const payload: RequestPayload = await req.json();
    const { filePath, textContent, quizId, generationParams } = payload;

    if (!((filePath || textContent) && quizId)) {
      throw new Error(
        "Missing required fields: (filePath or textContent) and quizId",
      );
    }

    Logger.info("Request payload", {
      filePath,
      textContent: textContent ? "provided" : "none",
      quizId,
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

    // Execute quiz generation
    const handler = new QuizGenerationHandler(
      supabaseUrl,
      supabaseKey,
      openRouterApiKey,
      quizId,
      generationParams,
    );

    const result = await handler.execute(filePath, textContent, quizId);

    Logger.celebrate("Quiz generation completed!");
    Logger.success("Result", result);

    return new Response(JSON.stringify(result), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (error) {
    Logger.boom("Quiz generation failed");
    Logger.error("Error details", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Try to update quiz status to failed (best effort)
    try {
      const payload = await req
        .clone()
        .json()
        .catch(() => ({}));
      if (payload.quizId) {
        const supabaseUrl = Deno.env.get(ENV_VARS.supabaseUrl);
        const supabaseKey = Deno.env.get(ENV_VARS.supabaseKey);

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const quizService = new QuizService(supabase);
          await quizService.updateStatus(payload.quizId, "failed");
        }
      }
    } catch (_updateError) {
      // Ignore errors when updating status
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
