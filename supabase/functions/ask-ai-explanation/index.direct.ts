import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Ask AI Explanation - Edge Function
 *
 * Generates explanations for quiz questions and flashcards using OpenRouter directly.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash-lite";

// ============================================================================
// PROMPTS
// ============================================================================

const PROMPTS = {
  quiz: (context: any) =>
    `You are an expert educational tutor. A student has answered a quiz question and needs an explanation.

**Question:** ${context.questionText}

**Options:**
${
  context.options
    ? context.options.map((o: any) => `- ${o.text}`).join("\n")
    : "No options provided"
}

**Correct Answer:** ${context.correctAnswer}
**Student's Answer:** ${context.userAnswer || "Not provided"}
**Was Correct:** ${context.isCorrect ? "Yes" : "No"}

Your task:
1. Explain WHY the correct answer is correct
2. If the student was wrong, explain what they might have misunderstood
3. Provide additional context that helps understanding
4. Be encouraging and educational

After your explanation, suggest 2-3 follow-up questions the student might want to ask to deepen their understanding.

Respond in JSON format:
{
  "explanation": "Your detailed explanation here...",
  "suggested_questions": ["Question 1?", "Question 2?", "Question 3?"]
}

IMPORTANT: Return ONLY the JSON object, no markdown code blocks.`,

  flashcard: (context: any) =>
    `You are an expert educational tutor. A student is studying a flashcard and needs help understanding it.

**Front (Question/Term):** ${context.front || context.questionText}
**Back (Answer/Definition):** ${context.back || context.correctAnswer}

Your task:
1. Explain the concept in simple terms
2. Provide examples or mnemonics to help remember
3. Add context about why this is important

After your explanation, suggest 2-3 follow-up questions the student might want to ask.

Respond in JSON format:
{
  "explanation": "Your detailed explanation here...",
  "suggested_questions": ["Question 1?", "Question 2?", "Question 3?"]
}

IMPORTANT: Return ONLY the JSON object, no markdown code blocks.`,

  followUp: (question: string) =>
    `The student has a follow-up question: "${question}"

Please answer this question in the context of the previous explanation. Be helpful and educational.

Respond in JSON format:
{
  "explanation": "Your answer here...",
  "suggested_questions": ["Related question 1?", "Related question 2?"]
}

IMPORTANT: Return ONLY the JSON object, no markdown code blocks.`,
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
    const { context, history, question } = await req.json();

    if (!context) {
      throw new Error("Missing context");
    }

    const openRouterApiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openRouterApiKey) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    // Build messages
    const messages = [];
    let systemPrompt = "";

    if (context.contentType === "quiz") {
      systemPrompt = PROMPTS.quiz(context);
    } else {
      systemPrompt = PROMPTS.flashcard(context);
    }

    messages.push({ role: "system", content: systemPrompt });

    // Add history
    if (history && Array.isArray(history)) {
      messages.push(...history);
    }

    // Add follow-up question
    if (question) {
      messages.push({ role: "user", content: PROMPTS.followUp(question) });
    } else if (messages.length === 1) {
      // If no history and no follow-up, it's the first turn.
      // The system prompt contains the context, but Chat APIs usually expect a user message to trigger generation or at least a system message.
      // We can treat the Initial prompt as a User message if 'system' roles aren't strictly followed by all models,
      // OR just append a "Please explain" user message.
      // However, the system prompt says "Your task: ...".
      // Let's make the FIRST message a USER message with the prompt content, for better compatibility with some models,
      // OR keep it system and add a standardized User trigger.
      // Let's add a generic user trigger.
      messages.push({
        role: "user",
        content: "Please provide the explanation.",
      });
    }

    // Call OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://manabi.app",
        "X-Title": "Manabi AI Explanation",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("Empty response from AI");
    }

    // Parse JSON
    let parsed: any;
    try {
      const cleaned = rawContent
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parse error", e);
      // Fallback
      parsed = {
        explanation: rawContent,
        suggested_questions: [],
      };
    }

    return new Response(
      JSON.stringify({
        explanation: parsed.explanation || rawContent,
        suggestedQuestions: parsed.suggested_questions || [],
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
