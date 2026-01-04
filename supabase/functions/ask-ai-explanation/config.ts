/**
 * Configuration for AI Explanation Edge Function
 * Aligned with generate-quiz-v2 architecture
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  cors: {
    allowOrigin: "*",
    allowHeaders: "authorization, x-client-info, apikey, content-type",
  },
  timeout: 60000, // 1 minute
} as const;

// ============================================================================
// GITHUB MODELS AI CONFIGURATION
// ============================================================================

export const AI_CONFIG = {
  // GitHub Models API endpoints
  chatUrl: "https://models.github.ai/inference/chat/completions",

  // Model selection - using gpt-4o-mini for speed and efficiency
  generationModel: "gpt-4o-mini",

  // Generation settings
  generation: {
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 0.95,
  },
} as const;

// ============================================================================
// LOGGING CONFIGURATION
// ============================================================================

export const LOGGING_CONFIG = {
  verbose: true,
  emojis: {
    info: "ℹ️",
    success: "✅",
    error: "❌",
    warning: "⚠️",
    rocket: "🚀",
    celebrate: "🎉",
    boom: "💥",
    brain: "🧠",
  },
} as const;

// ============================================================================
// PROMPT TEMPLATES
// ============================================================================

export const PROMPT_TEMPLATES = {
  quiz: (context: {
    questionText: string;
    options?: Array<{ id: string; text: string }>;
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
  }) =>
    `You are an expert educational tutor. A student has answered a quiz question and needs an explanation.

**Question:** ${context.questionText}

**Options:**
${
      context.options
        ? context.options.map((o) => `- ${o.text}`).join("\n")
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

  flashcard: (context: {
    front?: string;
    back?: string;
    questionText: string;
    correctAnswer: string;
  }) =>
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
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  missingContext: "Missing required field: context",
  missingGithubToken: "Missing GITHUB_TOKEN environment variable",
  aiGenerationFailed: (message: string) => `AI generation failed: ${message}`,
  parseResponseFailed: (message: string) =>
    `Failed to parse AI response: ${message}`,
  emptyResponse: "Empty response from AI",
} as const;

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

export const ENV_VARS = {
  githubToken: "GITHUB_TOKEN",
} as const;
