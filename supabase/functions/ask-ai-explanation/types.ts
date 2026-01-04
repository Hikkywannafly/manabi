/**
 * Type definitions for AI Explanation Edge Function
 */

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface QuestionOption {
  id: string;
  text: string;
}

export interface ExplainContext {
  contentType: "quiz" | "flashcard";
  questionText: string;
  options?: QuestionOption[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  front?: string;
  back?: string;
  // RAG metadata for retrieving context from vectors
  quizId?: string;
  deckId?: string;
  questionId?: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface RequestPayload {
  context: ExplainContext;
  history?: ChatMessage[];
  question?: string;
}

export interface ExplanationResponse {
  explanation: string;
  suggestedQuestions: string[];
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

// ============================================================================
// AI SERVICE TYPES
// ============================================================================

export interface AIExplanationResult {
  explanation: string;
  suggested_questions: string[];
}

// ============================================================================
// STREAMING TYPES
// ============================================================================

export interface StreamChunk {
  type: "content" | "suggestions" | "done" | "error";
  content?: string;
  suggestions?: string[];
  error?: string;
}
