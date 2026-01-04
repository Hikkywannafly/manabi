/**
 * Quiz Generation V2 - RAG Pipeline
 *
 * Flow:
 * 1. Extract content from source (file, text, youtube, url)
 * 2. Split into chunks
 * 3. Generate embeddings & store in vector DB
 * 4. Retrieve relevant context
 * 5. Generate quiz with AI
 * 6. Save to database
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { ExtractorService } from "./services/extractor.ts";
import { RagService } from "./services/rag.ts";
import { GeneratorService } from "./services/generator.ts";
import { Logger } from "./utils/logger.ts";
import { ProgressTracker } from "./utils/progress.ts";
import {
  API_CONFIG,
  DATABASE_CONFIG,
  ENV_VARS,
  ERROR_MESSAGES,
  PROGRESS_STEPS,
} from "./config.ts";
import type { GenerationParams, RequestPayload } from "./types.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": API_CONFIG.cors.allowOrigin,
  "Access-Control-Allow-Headers": API_CONFIG.cors.allowHeaders,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    Logger.info("🚀 Quiz generation V2 (RAG) started");

    // =========================================================================
    // 1. SETUP & AUTH
    // =========================================================================
    const supabaseUrl = Deno.env.get(ENV_VARS.supabaseUrl) ?? "";
    const supabaseKey = Deno.env.get(ENV_VARS.supabaseKey) ?? "";
    const githubToken = Deno.env.get(ENV_VARS.githubToken);

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(ERROR_MESSAGES.missingSupabaseEnv);
    }

    if (!githubToken) {
      throw new Error(ERROR_MESSAGES.missingApiKey);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (authError || !user) throw new Error("Unauthorized");

    Logger.success(`Authenticated user: ${user.id.substring(0, 8)}...`);

    // =========================================================================
    // 2. PARSE PAYLOAD
    // =========================================================================
    const payload: RequestPayload = await req.json();
    const {
      filePath,
      textContent,
      youtubeUrl,
      webpageUrl,
      imageUrl,
      quizId,
      generationParams,
    } = payload;

    if (!quizId) throw new Error(ERROR_MESSAGES.missingFields);

    // Initialize progress tracker
    const progress = new ProgressTracker(supabase, quizId);
    await progress.update(
      PROGRESS_STEPS.START.percent,
      PROGRESS_STEPS.START.message,
    );

    // Extract params with defaults
    const params: GenerationParams = {
      difficulty: generationParams?.difficulty || "Medium",
      numberOfQuestions:
        parseInt(String(generationParams?.numberOfQuestions)) || 10,
      questionTypes: generationParams?.questionTypes || ["multiple_choice"],
      language: generationParams?.language || "English",
      parsingMode: generationParams?.parsingMode || "balanced",
      task: generationParams?.task || "generate",
      mode: generationParams?.mode || "quiz",
      customInstructions: generationParams?.customInstructions,
    };

    Logger.info("Generation params", params);

    // =========================================================================
    // 3. EXTRACT CONTENT
    // =========================================================================
    await progress.update(
      PROGRESS_STEPS.DOWNLOAD.percent,
      PROGRESS_STEPS.DOWNLOAD.message,
    );

    const extractor = new ExtractorService(githubToken);
    let extractedText = "";
    let sourceType: "file" | "text" | "youtube" | "webpage" | "image" = "text";
    let sourceUrl = "";

    if (textContent) {
      extractedText = await extractor.extract(
        "text",
        textContent,
        undefined,
        params.parsingMode,
      );
    } else if (youtubeUrl) {
      sourceType = "youtube";
      sourceUrl = youtubeUrl;
      extractedText = await extractor.extract(
        "youtube",
        youtubeUrl,
        undefined,
        params.parsingMode,
      );
    } else if (webpageUrl) {
      sourceType = "webpage";
      sourceUrl = webpageUrl;
      extractedText = await extractor.extract(
        "webpage",
        webpageUrl,
        undefined,
        params.parsingMode,
      );
    } else if (imageUrl) {
      sourceType = "image";
      sourceUrl = imageUrl;
      extractedText = await extractor.extract(
        "image",
        imageUrl,
        undefined,
        params.parsingMode,
      );
    } else if (filePath) {
      sourceType = "file";
      const { data } = await supabase.storage.from("uploads").createSignedUrl(
        filePath,
        3600,
      );
      if (!data?.signedUrl) throw new Error("Failed to get signed URL");

      sourceUrl = data.signedUrl;
      const fileType = filePath.split(".").pop()?.toLowerCase();
      extractedText = await extractor.extract(
        "file",
        sourceUrl,
        fileType,
        params.parsingMode,
      );
    }

    if (!extractedText || extractedText.length < 50) {
      throw new Error(
        ERROR_MESSAGES.extractionFailed("Insufficient content extracted"),
      );
    }

    await progress.update(
      PROGRESS_STEPS.EXTRACT.percent,
      PROGRESS_STEPS.EXTRACT.message,
    );
    Logger.success(`Extracted ${extractedText.length} characters`);

    // =========================================================================
    // 4. RAG PROCESS (EMBED & STORE)
    // =========================================================================
    await progress.update(
      PROGRESS_STEPS.SPLIT.percent,
      PROGRESS_STEPS.SPLIT.message,
    );

    const ragService = new RagService(supabase, githubToken);
    const chunksStored = await ragService.processAndStore(extractedText, {
      user_id: user.id,
      quiz_id: quizId,
      source: sourceUrl,
      type: sourceType,
      parsing_mode: params.parsingMode,
    });

    await progress.update(
      PROGRESS_STEPS.STORE.percent,
      `Stored ${chunksStored} chunks`,
    );

    // =========================================================================
    // 5. RETRIEVE CONTEXT
    // =========================================================================
    await progress.update(
      PROGRESS_STEPS.RETRIEVE.percent,
      PROGRESS_STEPS.RETRIEVE.message,
    );

    const retrievalQuery = params.task === "extract"
      ? "Find questions, answers, quiz items, and assessments"
      : `Key concepts for a ${params.difficulty} ${params.mode}: ${
        extractedText.substring(0, 300)
      }`;

    const context = await ragService.retrieveContext(retrievalQuery, 15);

    // Use extracted text as fallback if retrieval returns nothing
    const finalContext = context || extractedText.substring(0, 10000);

    // =========================================================================
    // 6. GENERATE QUIZ
    // =========================================================================
    await progress.update(
      PROGRESS_STEPS.GENERATE.percent,
      PROGRESS_STEPS.GENERATE.message,
    );

    const generator = new GeneratorService(githubToken);
    const quizData = await generator.generateQuiz(finalContext, params);

    Logger.celebrate(
      `Generated quiz: "${quizData.title}" with ${quizData.questions.length} questions`,
    );

    // =========================================================================
    // 7. SAVE TO DATABASE
    // =========================================================================
    await progress.update(
      PROGRESS_STEPS.SAVE.percent,
      PROGRESS_STEPS.SAVE.message,
    );

    // Generate slug
    const slug = quizData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50);

    // Update quiz metadata
    const { error: updateError } = await supabase
      .from(DATABASE_CONFIG.tables.quizzes)
      .update({
        title: quizData.title,
        slug: `${slug}-${quizId.slice(0, 4)}`,
        status: "ready",
      })
      .eq("id", quizId);

    if (updateError) {
      Logger.error("Quiz update failed", updateError);
      throw new Error(ERROR_MESSAGES.databaseInsertFailed(updateError.message));
    }

    // Insert questions
    const questions = quizData.questions.map((q, idx) => ({
      quiz_id: quizId,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      order_index: idx,
    }));

    const { error: insertError } = await supabase
      .from(DATABASE_CONFIG.tables.questions)
      .insert(questions);

    if (insertError) {
      Logger.error("Questions insert failed", insertError);
      throw new Error(ERROR_MESSAGES.databaseInsertFailed(insertError.message));
    }

    // =========================================================================
    // 8. COMPLETE
    // =========================================================================
    const finalSlug = `${slug}-${quizId.slice(0, 4)}`;
    await progress.update(
      PROGRESS_STEPS.COMPLETE.percent,
      PROGRESS_STEPS.COMPLETE.message,
      { slug: finalSlug }, // Send slug to frontend
    );

    Logger.celebrate("🎉 Quiz generation completed!");

    return new Response(
      JSON.stringify({
        success: true,
        quizId,
        title: quizData.title,
        questionCount: quizData.questions.length,
        chunksProcessed: chunksStored,
      }),
      {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    Logger.boom("Quiz generation failed");
    Logger.error("Error details", error);

    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

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
