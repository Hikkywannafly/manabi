import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Import types and config
import { API_CONFIG, ENV_VARS, ERROR_MESSAGES } from "./config.ts";
// Import Services
import { GeneratorService } from "./services/generator.ts";
import type { RequestPayload } from "./types.ts";
import { Logger } from "./utils/logger.ts";

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

  constructor(githubToken: string) {
    this.generatorService = new GeneratorService(githubToken);
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

    // Validate environment variables
    const githubToken = Deno.env.get(ENV_VARS.githubToken);

    if (!githubToken) {
      throw new Error(ERROR_MESSAGES.missingGithubToken);
    }

    // Execute explanation generation
    const handler = new ExplanationHandler(githubToken);
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
