/**
 * Configuration for Quiz Generation Edge Function
 * Centralized config for easy maintenance and updates
 */

import type { ProgressStep } from "./types.ts";

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  // CORS settings
  cors: {
    allowOrigin: "*",
    allowHeaders: "authorization, x-client-info, apikey, content-type",
  },

  // Request timeout (ms)
  timeout: 300000, // 5 minutes
} as const;

// ============================================================================
// OPENROUTER AI CONFIGURATION
// ============================================================================

export const AI_CONFIG = {
  // OpenRouter API endpoint
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",

  // Model selection (using free tier)
  model: "google/gemini-2.5-flash-lite",

  // Generation settings
  generation: {
    temperature: 0.7, // 0.0 - 1.0 (higher = more creative)
    max_tokens: 8192,
    top_p: 0.95,
  },

  // Default quiz generation parameters
  defaults: {
    difficulty: "Medium",
    numberOfQuestions: 5,
    questionType: "Mixed",
    language: "English",
    mode: "quiz",
    parsingMode: "fast",
    task: "generate",
  },
} as const;

// ============================================================================
// STORAGE CONFIGURATION
// ============================================================================

export const STORAGE_CONFIG = {
  // Supabase storage bucket name
  bucket: "uploads",

  // Supported file types
  supportedMimeTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/msword", // DOC
    "image/jpeg",
    "image/png",
    "image/webp",
    "text/plain",
  ],

  // Max file size (bytes) - 10MB
  maxFileSize: 10 * 1024 * 1024,

  // Default mime type fallback
  defaultMimeType: "application/pdf",
} as const;

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

export const DATABASE_CONFIG = {
  tables: {
    quizzes: "quizzes",
    questions: "quiz_questions",
  },

  // Batch insert size
  batchSize: 100,
} as const;

// ============================================================================
// PROGRESS TRACKING CONFIGURATION
// ============================================================================

export const PROGRESS_STEPS: Record<string, ProgressStep> = {
  START: { percent: 0, message: "Initializing..." },
  DOWNLOAD: { percent: 10, message: "Fetching file from storage..." },
  CONVERT: { percent: 20, message: "Converting file format..." },
  ANALYZE: { percent: 40, message: "Analyzing content with AI..." },
  PARSE: { percent: 70, message: "Parsing AI response..." },
  SAVE: { percent: 80, message: "Saving generated quiz..." },
  UPDATE: { percent: 95, message: "Updating quiz status..." },
  COMPLETE: { percent: 100, message: "Done!" },
} as const;

// ============================================================================
// LOGGING CONFIGURATION
// ============================================================================

export const LOGGING_CONFIG = {
  // Enable detailed logging
  verbose: true,

  // Log levels
  levels: {
    info: true,
    success: true,
    error: true,
    debug: false, // Set to true for development
  },

  // Emojis for log messages
  emojis: {
    info: "ℹ️",
    success: "✅",
    error: "❌",
    warning: "⚠️",
    step: "📍",
    rocket: "🚀",
    celebrate: "🎉",
    boom: "💥",
  },
} as const;

// ============================================================================
// PROMPT TEMPLATES
// ============================================================================

export const PROMPT_TEMPLATES = {
  quiz: (params: {
    difficulty: string;
    numberOfQuestions: number;
    questionType: string;
    language?: string;
    customInstructions?: string;
  }) =>
    `You are an expert educational content generator.
Task: Create a quiz based on the attached document.

Settings:
- Difficulty: ${params.difficulty}
- Number of Questions: ${params.numberOfQuestions}
- Question Type: ${params.questionType}
- Language: ${params.language || "English"}
${
  params.customInstructions
    ? `- Custom Instructions: ${params.customInstructions}`
    : ""
}

Output Format: JSON Object ONLY.
Schema:
{
  "title": "A short, descriptive title for this quiz (max 10 words)",
  "questions": [
    {
      "question_text": "string",
      "question_type": "multiple_choice" | "true_false" | "fill_in_blank" | "short_answer",
      "options": ["Option A", "Option B", "Option C", "Option D"] (or null if not MCQ),
      "correct_answer": "string" (or index for MCQ like "0"),
      "explanation": "string"
    }
  ]
}

IMPORTANT:
- Return ONLY the JSON object
- No markdown code blocks
- No explanations outside the JSON
- Ensure all questions are relevant to the document content
- If "language" is specified, translate the questions, options, and title to that language.
- Make sure correct_answer matches one of the options (for MCQ)`,

  extract: (params: { language?: string }) =>
    `You are an expert educational content extractor.
Task: Extract quiz questions and answers from the attached document.
The document contains existing questions. Your job is to parse them into the structured JSON format.

Settings:
- Language: ${params.language || "Keep original"}

Output Format: JSON Object ONLY.
Schema:
{
  "title": "A title extracted from the document or generated based on topic",
  "questions": [
    {
      "question_text": "string",
      "question_type": "multiple_choice" | "true_false" | "fill_in_blank" | "short_answer",
      "options": ["Option A", "Option B", "Option C", "Option D"] (or null if not MCQ),
      "correct_answer": "string" (or index for MCQ like "0"). If not found, leave empty string.
      "explanation": "string" (if found)
    }
  ]
}

IMPORTANT:
- Return ONLY the JSON object
- No markdown code blocks
- If multiple choices are present, map them to options.
- Try to identify the correct answer if marked.`,
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  missingFields: "Missing required fields: filePath or quizId",
  missingSupabaseEnv: "Missing Supabase environment variables",
  missingOpenRouterKey: "Missing OPENROUTER_API_KEY environment variable",
  fileDownloadFailed: (message: string) => `File download failed: ${message}`,
  aiGenerationFailed: (message: string) => `AI generation failed: ${message}`,
  parseResponseFailed: (message: string) =>
    `Failed to parse AI response: ${message}`,
  databaseInsertFailed: (message: string) =>
    `Database insert failed: ${message}`,
  invalidFileType: (type: string) => `Unsupported file type: ${type}`,
  fileTooLarge: (size: number, max: number) =>
    `File too large: ${size} bytes (max: ${max} bytes)`,
} as const;

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

export const ENV_VARS = {
  supabaseUrl: "SUPABASE_URL",
  supabaseKey: "SUPABASE_SERVICE_ROLE_KEY",
  openRouterApiKey: "OPENROUTER_API_KEY",
} as const;
