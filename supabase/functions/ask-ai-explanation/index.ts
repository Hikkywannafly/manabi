import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Import types and config
import { AI_CONFIG, API_CONFIG, ENV_VARS, ERROR_MESSAGES } from "./config.ts";
// Import Services
import { GeneratorService } from "./services/generator.ts";
import { RagService } from "./services/rag.ts";
import type { RequestPayload } from "./types.ts";
import { Logger } from "./utils/logger.ts";
import { createClient } from "@supabase/supabase-js";

// ============================================================================
// CONSTANTS
// ============================================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": API_CONFIG.cors.allowOrigin,
  "Access-Control-Allow-Headers": API_CONFIG.cors.allowHeaders,
};

// ============================================================================
// MAIN HANDLER
// ============================================================================

class ExplanationHandler {
  private generatorService: GeneratorService;

  constructor(githubToken: string, ragService?: RagService) {
    this.generatorService = new GeneratorService(githubToken, ragService);
  }

  async execute(payload: RequestPayload): Promise<{
    explanation: string;
    suggestedQuestions: string[];
  }> {
    const { context, history, question } = payload;

    // Validate context
    if (!context) {
      throw new Error(ERROR_MESSAGES.missingContext);
    }

    Logger.info("Processing explanation request", {
      contentType: context.contentType,
      hasHistory: !!history?.length,
      hasFollowUp: !!question,
      hasQuizId: !!context.quizId,
      hasDeckId: !!context.deckId,
    });

    let result: {
      explanation: string;
      suggested_questions: string[];
    };

    if (question && history) {
      // Follow-up question
      result = await this.generatorService.generateFollowUp(
        context,
        history,
        question,
      );
    } else {
      // Initial explanation
      result = await this.generatorService.generateExplanation(context);
    }

    return {
      explanation: result.explanation,
      suggestedQuestions: result.suggested_questions,
    };
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
    Logger.rocket("AI Explanation started");

    // Parse and validate request
    const payload: RequestPayload = await req.json();

    // Check if streaming is requested
    const url = new URL(req.url);
    const isStreaming = url.searchParams.get("stream") === "true";

    // Validate environment variables
    const githubToken = Deno.env.get(ENV_VARS.githubToken);
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!githubToken) {
      throw new Error(ERROR_MESSAGES.missingGithubToken);
    }

    // Initialize RAG service if Supabase credentials available
    let ragService: RagService | undefined;
    if (supabaseUrl && supabaseKey && AI_CONFIG.rag.enabled) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      ragService = new RagService(supabase, githubToken, {
        embeddingsUrl: AI_CONFIG.embeddingsUrl,
        embeddingModel: AI_CONFIG.embeddingModel,
        matchThreshold: AI_CONFIG.rag.matchThreshold,
        matchCount: AI_CONFIG.rag.matchCount,
      });
      Logger.info("RAG service initialized");
    } else {
      Logger.info(
        "RAG service disabled (missing credentials or disabled in config)",
      );
    }

    const generatorService = new GeneratorService(githubToken, ragService);

    // Handle streaming request
    if (isStreaming) {
      const { context, history, question } = payload;

      if (!context) {
        throw new Error(ERROR_MESSAGES.missingContext);
      }

      Logger.info("Processing streaming explanation request");

      // Create SSE stream
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();

          try {
            let generator: AsyncGenerator<string, string[], void>;

            if (question && history) {
              generator = generatorService.generateFollowUpStream(
                context,
                history,
                question,
              );
            } else {
              generator = generatorService.generateExplanationStream(context);
            }

            // Stream content chunks
            for await (const chunk of generator) {
              const event = `data: ${
                JSON.stringify({ type: "content", content: chunk })
              }\n\n`;
              controller.enqueue(encoder.encode(event));
            }

            // Get suggested questions from generator return value
            const suggestedQuestions = await generator.next();
            if (suggestedQuestions.value) {
              const event = `data: ${
                JSON.stringify({
                  type: "suggestions",
                  suggestions: suggestedQuestions.value,
                })
              }\n\n`;
              controller.enqueue(encoder.encode(event));
            }

            // Send done event
            const doneEvent = `data: ${JSON.stringify({ type: "done" })}\n\n`;
            controller.enqueue(encoder.encode(doneEvent));

            Logger.celebrate("Streaming completed successfully!");
          } catch (error) {
            const errorMessage = error instanceof Error
              ? error.message
              : "Unknown error";
            const errorEvent = `data: ${
              JSON.stringify({ type: "error", error: errorMessage })
            }\n\n`;
            controller.enqueue(encoder.encode(errorEvent));
            Logger.error("Streaming error", error);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Handle non-streaming request (legacy)
    const handler = new ExplanationHandler(githubToken, ragService);
    const result = await handler.execute(payload);

    Logger.celebrate("Explanation generated successfully!");
    Logger.success("Result", result);

    return new Response(JSON.stringify(result), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (error) {
    Logger.boom("Explanation generation failed");
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
