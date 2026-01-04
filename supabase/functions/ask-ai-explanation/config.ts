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
- Provide clear, accurate, and encouraging explanations
- Adapt your teaching style to the student's level
- Use examples and analogies to clarify concepts
- Encourage critical thinking and deeper understanding
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

4. **Suggest Follow-ups:** Provide 2-3 thoughtful questions to deepen understanding

## Output Format (JSON ONLY)
{
  "explanation": "Your detailed, structured explanation here. Use clear paragraphs and examples.",
  "suggested_questions": [
    "A deeper question about the concept?",
    "A related application question?",
    "An extension or edge case?"
  ]
}

**CRITICAL:** Return ONLY the JSON object. No markdown, no code blocks, no extra text.`;
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
5. **Suggest Follow-ups:** Provide 2-3 questions to test understanding

## Output Format (JSON ONLY)
{
  "explanation": "Your comprehensive explanation with examples and memory techniques.",
  "suggested_questions": [
    "A question to test basic understanding?",
    "A question about practical application?",
    "A question connecting to related concepts?"
  ]
}

**CRITICAL:** Return ONLY the JSON object. No markdown, no code blocks, no extra text.`,

  followUp: (question: string) =>
    `The student has asked a follow-up question based on the previous explanation.

## Follow-up Question
"${question}"

## Your Task
1. **Answer Directly:** Address their specific question clearly
2. **Connect to Previous:** Reference the earlier explanation if relevant
3. **Expand Understanding:** Provide additional insights or examples
4. **Encourage Curiosity:** Acknowledge their good question
5. **Suggest Next Steps:** Provide 1-2 related questions to continue learning

## Output Format (JSON ONLY)
{
  "explanation": "Your clear, contextual answer to their follow-up question.",
  "suggested_questions": [
    "A related follow-up question?",
    "A deeper exploration question?"
  ]
}

**CRITICAL:** Return ONLY the JSON object. No markdown, no code blocks, no extra text.`,
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
