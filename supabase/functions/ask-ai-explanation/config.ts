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
  embeddingsUrl: "https://models.github.ai/inference/embeddings",

  // Model selection - using gpt-4o-mini for speed and efficiency
  generationModel: "gpt-4o-mini",
  embeddingModel: "text-embedding-3-small",

  // Generation settings - tuned for educational explanations
  generation: {
    temperature: 0.5, // Lower for more consistent, factual explanations
    max_tokens: 3072, // Higher for detailed explanations
    top_p: 0.9, // Slightly lower for more focused responses
  },

  // RAG settings for context retrieval
  rag: {
    enabled: true,
    matchThreshold: 0.5,
    matchCount: 5,
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
  // System message for consistent AI behavior
  system: () =>
    `You are Manabi AI, an expert educational tutor specializing in personalized learning. Your role is to:
- Provide clear, accurate, and concise explanations
- Focus on the core concept without being overly verbose
- Adapt your teaching style to the student's level
- Use examples only when necessary to clarify
- Always respond in valid JSON format without markdown code blocks`,

  quiz: (context: {
    questionText: string;
    options?: Array<{ id: string; text: string }>;
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
  }) => {
    const wasCorrect = context.isCorrect;
    const hasUserAnswer = context.userAnswer &&
      context.userAnswer.trim() !== "";

    return `A student just answered a quiz question. Provide a helpful explanation.

## Question Context
**Question:** ${context.questionText}

${
      context.options && context.options.length > 0
        ? `**Options:**\n${
          context.options.map((o, i) => `${i + 1}. ${o.text}`).join("\n")
        }`
        : ""
    }

**Correct Answer:** ${context.correctAnswer}
${hasUserAnswer ? `**Student's Answer:** ${context.userAnswer}` : ""}
${
      hasUserAnswer
        ? `**Result:** ${wasCorrect ? "✓ Correct" : "✗ Incorrect"}`
        : ""
    }

## Your Task
${
      wasCorrect
        ? `1. **Reinforce Understanding:** Explain why "${context.correctAnswer}" is correct
2. **Deepen Knowledge:** Provide additional context or related concepts
3. **Encourage:** Acknowledge their correct answer positively`
        : `1. **Explain the Correct Answer:** Why "${context.correctAnswer}" is the right choice
2. **Address the Misconception:** ${
          hasUserAnswer
            ? `Why "${context.userAnswer}" is incorrect`
            : "Common mistakes to avoid"
        }
3. **Teach the Concept:** Break down the underlying principle
4. **Encourage:** Be supportive and constructive`
    }

## Your Task
${
      wasCorrect
        ? `1. **Briefly explain** why "${context.correctAnswer}" is correct
2. **Add context** if helpful for deeper understanding`
        : `1. **Explain why** "${context.correctAnswer}" is the right choice
2. **Address the error** ${
          hasUserAnswer
            ? `in choosing "${context.userAnswer}"`
            : "and common mistakes"
        }`
    }
3. **Suggest 2-3 follow-up questions** to deepen understanding

## Output Format (JSON ONLY)
{
  "explanation": "Your concise, focused explanation (2-3 sentences max). Be direct and clear.",
  "suggested_questions": [
    "First follow-up question?",
    "Second follow-up question?",
    "Third follow-up question?"
  ]
}

**CRITICAL:** Return ONLY the JSON object. No markdown, no code blocks, no extra text. Keep explanation brief and focused.`;
  },

  flashcard: (context: {
    front?: string;
    back?: string;
    questionText: string;
    correctAnswer: string;
  }) =>
    `A student is studying a flashcard and needs help understanding the concept.

## Flashcard Content
**Front (Question/Term):** ${context.front || context.questionText}
**Back (Answer/Definition):** ${context.back || context.correctAnswer}

## Your Task
1. **Explain Simply:** Break down the concept in clear, accessible language
2. **Provide Examples:** Give 1-2 concrete examples or use cases
3. **Memory Aid:** Suggest a mnemonic, analogy, or visualization technique
4. **Context:** Explain why this concept is important or how it connects to broader topics

## Your Task
1. **Explain the concept** clearly and concisely
2. **Give 1 example** if it helps understanding
3. **Suggest 2-3 follow-up questions**

## Output Format (JSON ONLY)
{
  "explanation": "Your concise explanation (2-3 sentences max). Focus on clarity.",
  "suggested_questions": [
    "First follow-up question?",
    "Second follow-up question?",
    "Third follow-up question?"
  ]
}

**CRITICAL:** Return ONLY the JSON object. No markdown, no code blocks. Keep it brief and clear.`,

  followUp: (question: string) =>
    `The student has asked a follow-up question based on the previous explanation.

## Follow-up Question
"${question}"

## Your Task
1. **Answer Directly:** Address their specific question clearly
2. **Connect to Previous:** Reference the earlier explanation if relevant
3. **Expand Understanding:** Provide additional insights or examples
4. **Encourage Curiosity:** Acknowledge their good question

## Your Task
1. **Answer directly** and concisely
2. **Connect to previous context** if relevant
3. **Suggest 1-2 related questions**

## Output Format (JSON ONLY)
{
  "explanation": "Your concise answer (2-3 sentences max).",
  "suggested_questions": [
    "Related follow-up question?",
    "Deeper exploration question?"
  ]
}

**CRITICAL:** Return ONLY the JSON object. Be brief and direct.`,
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
