import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Ask AI Explanation - Edge Function Gateway
 *
 * This is a lightweight gateway that proxies requests to the Python backend.
 * The Python backend handles the AI generation using LangChain.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// MAIN HANDLER
// ============================================================================

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    // Get Python backend URL from environment
    const pythonBackendUrl = Deno.env.get("PYTHON_BACKEND_URL");
    const apiSecretKey = Deno.env.get("BACKEND_API_KEY");

    if (!pythonBackendUrl) {
      throw new Error("PYTHON_BACKEND_URL not configured");
    }

    if (!apiSecretKey) {
      throw new Error("BACKEND_API_KEY not configured");
    }

    // Forward request to Python backend
    const payload = await req.json();

    const response = await fetch(`${pythonBackendUrl}/api/v1/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiSecretKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Python backend error: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();

    // Transform response to match frontend expected format
    return new Response(
      JSON.stringify({
        explanation: data.explanation,
        suggestedQuestions: data.suggested_questions || [],
      }),
      {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("AI Explanation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
