import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * AI Explanation Edge Function - Gateway Version
 *
 * This function acts as a lightweight gateway that:
 * 1. Receives explanation requests from the frontend
 * 2. Forwards processing to the Python backend
 * 3. Returns the AI-generated explanation
 *
 * Set PYTHON_BACKEND_URL environment variable to your Railway deployment URL
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// TYPES
// ============================================================================

interface QuestionOption {
  id: string;
  text: string;
}

interface ExplainContext {
  contentType: "quiz" | "flashcard";
  questionText: string;
  options?: QuestionOption[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  front?: string;
  back?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestPayload {
  context: ExplainContext;
  history?: ChatMessage[];
  question?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function mapContextForPython(context: ExplainContext) {
  return {
    content_type: context.contentType,
    question_text: context.questionText,
    options: context.options,
    correct_answer: context.correctAnswer,
    user_answer: context.userAnswer,
    is_correct: context.isCorrect,
    front: context.front,
    back: context.back,
  };
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    console.log("🚀 AI Explanation gateway started");

    // Parse request
    const payload: RequestPayload = await req.json();
    const { context, history, question } = payload;

    // Validate
    if (!context) {
      throw new Error("Missing required field: context");
    }

    console.log("📝 Request:", {
      contentType: context.contentType,
      hasHistory: !!history?.length,
      hasFollowUp: !!question,
    });

    // Get environment variables
    const pythonBackendUrl = Deno.env.get("PYTHON_BACKEND_URL");
    const backendApiKey = Deno.env.get("BACKEND_API_KEY") || "default-key";

    if (!pythonBackendUrl) {
      throw new Error("PYTHON_BACKEND_URL environment variable not set");
    }

    // Build request for Python backend
    const backendRequest = {
      context: mapContextForPython(context),
      history: history || [],
      question: question || null,
    };

    // Call Python backend
    console.log("📤 Calling Python backend...");

    const backendResponse = await fetch(`${pythonBackendUrl}/api/v1/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": backendApiKey,
      },
      body: JSON.stringify(backendRequest),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(
        `Python backend error: ${backendResponse.status} - ${errorText}`,
      );
    }

    const result = await backendResponse.json();

    console.log("✅ Backend returned explanation");

    // Return response with camelCase for frontend
    return new Response(
      JSON.stringify({
        explanation: result.explanation,
        suggestedQuestions: result.suggested_questions || [],
      }),
      {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("❌ Gateway error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
});
