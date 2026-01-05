/**
 * Configuration for Flashcard Generation V2 (RAG Pipeline)
 */

import type { ProgressStep } from "./types.ts";

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  cors: {
    allowOrigin: "*",
    allowHeaders: "authorization, x-client-info, apikey, content-type",
  },
  timeout: 300000, // 5 minutes
} as const;

// ============================================================================
// GITHUB MODELS AI CONFIGURATION
// ============================================================================

export const AI_CONFIG = {
  // GitHub Models API endpoints
  chatUrl: "https://models.github.ai/inference/chat/completions",
  embeddingsUrl: "https://models.github.ai/inference/embeddings",

  // Model selection
  generationModel: "gpt-4o-mini",
  visionModel: "gpt-4o-mini",
  embeddingModel: "text-embedding-3-small",

  // Generation settings
  generation: {
    temperature: 0.7,
    max_tokens: 8192,
    top_p: 0.95,
  },

  // Default flashcard generation parameters
  defaults: {
    difficulty: "easy",
    numberOfCards: 10,
    flashcardType: "QUESTIONS",
    language: "English",
    parsingMode: "balanced",
    task: "generate",
  },
} as const;

// ============================================================================
// STORAGE CONFIGURATION
// ============================================================================

export const STORAGE_CONFIG = {
  bucket: "uploads",
  supportedMimeTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "image/jpeg",
    "image/png",
    "image/webp",
    "text/plain",
  ],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  defaultMimeType: "application/pdf",
} as const;

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

export const DATABASE_CONFIG = {
  tables: {
    decks: "decks",
    flashcards: "flashcards",
    documents: "documents",
  },
  batchSize: 5,
} as const;

// ============================================================================
// PROGRESS TRACKING
// ============================================================================

export const PROGRESS_STEPS: Record<string, ProgressStep> = {
  START: { percent: 0, message: "Initializing..." },
  DOWNLOAD: { percent: 10, message: "Fetching content..." },
  EXTRACT: { percent: 20, message: "Extracting text..." },
  SPLIT: { percent: 35, message: "Splitting into chunks..." },
  EMBED: { percent: 50, message: "Generating embeddings..." },
  STORE: { percent: 60, message: "Storing vectors..." },
  RETRIEVE: { percent: 70, message: "Retrieving context..." },
  GENERATE: { percent: 80, message: "Generating flashcards with AI..." },
  SAVE: { percent: 90, message: "Saving deck..." },
  COMPLETE: { percent: 100, message: "Done!" },
} as const;

// ============================================================================
// LOGGING CONFIGURATION
// ============================================================================

export const LOGGING_CONFIG = {
  verbose: true,
  levels: {
    info: true,
    success: true,
    error: true,
    debug: false,
  },
  emojis: {
    info: "ℹ️",
    success: "✅",
    error: "❌",
    warning: "⚠️",
    step: "📍",
    rocket: "🚀",
    celebrate: "🎉",
    boom: "💥",
    brain: "🧠",
    search: "🔍",
    save: "💾",
  },
} as const;

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

export const ENV_VARS = {
  supabaseUrl: "SUPABASE_URL",
  supabaseKey: "SUPABASE_SERVICE_ROLE_KEY",
  githubToken: "GITHUB_TOKEN",
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  missingFields: "Missing required fields: content source or deckId",
  missingSupabaseEnv: "Missing Supabase environment variables",
  missingApiKey: "Missing GITHUB_TOKEN environment variable",
  fileDownloadFailed: (message: string) => `File download failed: ${message}`,
  extractionFailed: (message: string) =>
    `Content extraction failed: ${message}`,
  embeddingFailed: (message: string) => `Embedding failed: ${message}`,
  aiGenerationFailed: (message: string) => `AI generation failed: ${message}`,
  parseResponseFailed: (message: string) =>
    `Failed to parse AI response: ${message}`,
  databaseInsertFailed: (message: string) =>
    `Database insert failed: ${message}`,
} as const;
