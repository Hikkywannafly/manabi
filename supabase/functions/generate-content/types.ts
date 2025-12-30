/**
 * Type definitions for Quiz Generation Edge Function
 */

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface GenerationParams {
  difficulty?: "Easy" | "Medium" | "Hard";
  numberOfQuestions?: number;
  questionTypes?: (
    | "mixed"
    | "multiple_choice"
    | "true_false"
    | "fill_in_blank"
    | "short_answer"
  )[];
  language?: string; // e.g. "English", "Vietnamese", "Japanese" or "auto"
  mode?: "quiz" | "exam";
  parsingMode?: "fast" | "balanced" | "premium";
  task?: "generate" | "extract";
  customInstructions?: string;
  progress?: number;
  step?: string;
}

export interface RequestPayload {
  action?: string;
  filePath?: string; // Optional now - can be null if textContent is provided
  textContent?: string; // Direct text input (bypasses storage)
  quizId: string;
  generationParams?: GenerationParams;
}

export interface SuccessResponse {
  success: true;
  count: number;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

// ============================================================================
// QUIZ TYPES
// ============================================================================

export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "fill_in_blank"
  | "short_answer";

export interface QuestionData {
  question_text: string;
  question_type?: QuestionType;
  options?: string[];
  correct_answer: string;
  explanation?: string;
}

export interface QuizQuestion {
  quiz_id: string;
  question_text: string;
  question_type?: QuestionType;
  options: string | null; // JSONB stored as string
  correct_answer: string;
  explanation?: string;
  order_index: number;
}

// ============================================================================
// DATABASE TYPES
// ============================================================================

export type QuizStatus = "draft" | "generating" | "ready" | "failed";

export interface Quiz {
  id: string;
  status: QuizStatus;
  generation_params?: GenerationParams;
  title: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// PROGRESS TYPES
// ============================================================================

export interface ProgressStep {
  percent: number;
  message: string;
}

export interface ProgressPayload {
  progress: number;
  message: string;
}

// ============================================================================
// FILE TYPES
// ============================================================================

export interface FileData {
  data: Blob;
  mimeType: string;
}

export type SupportedMimeType =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/msword"
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "text/plain";

// ============================================================================
// AI SERVICE TYPES
// ============================================================================

export interface AIGenerationOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  topK?: number;
  topP?: number;
}

export interface AIResponse {
  text: string;
  metadata?: {
    model: string;
    tokensUsed?: number;
  };
}
