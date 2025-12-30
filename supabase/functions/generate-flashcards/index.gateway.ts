import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

/**
 * Flashcard Generation Edge Function - Gateway Version
 *
 * This function acts as a lightweight gateway that:
 * 1. Receives requests from the frontend
 * 2. Creates signed URLs for file access
 * 3. Forwards processing to the Python backend
 * 4. The Python backend handles all heavy processing
 *
 * Set PYTHON_BACKEND_URL environment variable to your Railway deployment URL
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// TYPES
// ============================================================================

interface GenerationParams {
  difficulty?: string;
  numberOfCards?: number;
  language?: string;
  parsingMode?: string;
  customInstructions?: string;
}

interface RequestPayload {
  filePath?: string;
  textContent?: string;
  youtubeUrl?: string;
  webpageUrl?: string;
  deckId: string;
  generationParams?: GenerationParams;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function mapParamsForPython(params?: GenerationParams) {
  if (!params) return {};

  return {
    difficulty: params.difficulty || "Medium",
    number_of_cards: params.numberOfCards || 20,
    language: params.language || "english",
    parsing_mode: params.parsingMode || "balanced",
    custom_instructions: params.customInstructions || null,
  };
}

function getFileType(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() || "pdf";
  return ext;
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
    console.log("🚀 Flashcard generation gateway started");

    // Parse request
    const payload: RequestPayload = await req.json();
    const {
      filePath,
      textContent,
      youtubeUrl,
      webpageUrl,
      deckId,
      generationParams,
    } = payload;

    // Validate
    if (!deckId) {
      throw new Error("Missing required field: deckId");
    }
    if (!(filePath || textContent || youtubeUrl || webpageUrl)) {
      throw new Error(
        "Missing content source: filePath, textContent, youtubeUrl, or webpageUrl required",
      );
    }

    console.log("📝 Request:", {
      deckId,
      hasFile: !!filePath,
      hasText: !!textContent,
      hasYoutube: !!youtubeUrl,
      hasWebpage: !!webpageUrl,
    });

    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const pythonBackendUrl = Deno.env.get("PYTHON_BACKEND_URL");
    const backendApiKey = Deno.env.get("BACKEND_API_KEY") || "default-key";

    if (!(supabaseUrl && supabaseKey)) {
      throw new Error("Missing Supabase environment variables");
    }

    if (!pythonBackendUrl) {
      throw new Error("PYTHON_BACKEND_URL environment variable not set");
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build request for Python backend
    const backendRequest: Record<string, unknown> = {
      deck_id: deckId,
      params: mapParamsForPython(generationParams),
    };

    // Handle different content sources
    if (filePath) {
      // Create signed URL for the file
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage.from("uploads").createSignedUrl(filePath, 3600); // 1 hour expiry

      if (signedUrlError || !signedUrlData?.signedUrl) {
        throw new Error(
          `Failed to create signed URL: ${signedUrlError?.message}`,
        );
      }

      backendRequest.file_url = signedUrlData.signedUrl;
      backendRequest.file_type = getFileType(filePath);

      console.log("📁 Created signed URL for file");
    } else if (textContent) {
      backendRequest.text_content = textContent;
      console.log("📝 Using direct text content");
    } else if (youtubeUrl) {
      backendRequest.youtube_url = youtubeUrl;
      console.log("🎥 Using YouTube URL");
    } else if (webpageUrl) {
      backendRequest.webpage_url = webpageUrl;
      console.log("🌐 Using webpage URL");
    }

    // Call Python backend
    console.log("📤 Calling Python backend...");

    const backendResponse = await fetch(
      `${pythonBackendUrl}/api/v1/generate-flashcards`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": backendApiKey,
        },
        body: JSON.stringify(backendRequest),
      },
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(
        `Python backend error: ${backendResponse.status} - ${errorText}`,
      );
    }

    const result = await backendResponse.json();

    console.log("✅ Backend accepted request:", result);

    // Return immediate response (processing happens in background on Python backend)
    return new Response(
      JSON.stringify({
        success: true,
        status: "processing",
        deckId,
        message: "Flashcard generation started",
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
        success: false,
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
});
