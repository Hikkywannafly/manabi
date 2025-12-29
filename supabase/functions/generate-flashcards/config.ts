// Environment Variables
export const ENV_VARS = {
  supabaseUrl: "SUPABASE_URL",
  supabaseKey: "SUPABASE_SERVICE_ROLE_KEY",
  openRouterApiKey: "OPENROUTER_API_KEY_FLASHCARD",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  missingSupabaseEnv: "Missing Supabase environment variables",
  missingOpenRouterKey: "Missing OpenRouter API key for flashcards",
  fileTooLarge: "File size exceeds maximum limit",
  unsupportedFileType: "Unsupported file type",
  aiGenerationFailed: "AI generation failed",
  databaseSaveFailed: "Failed to save flashcards to database",
} as const;

// Logging Configuration
export const LOGGING_CONFIG = {
  enabled: true,
  emojis: {
    rocket: "🚀",
    checkmark: "✅",
    boom: "💥",
    warning: "⚠️",
    info: "ℹ️",
  },
} as const;

// Progress Steps
export const PROGRESS_STEPS = {
  DOWNLOAD: { percent: 10, message: "Downloading file..." },
  CONVERT: { percent: 20, message: "Converting file format..." },
  ANALYZE: { percent: 40, message: "Analyzing content with AI..." },
  GENERATE: { percent: 70, message: "Generating flashcards..." },
  PARSE: { percent: 85, message: "Processing flashcards..." },
  SAVE: { percent: 95, message: "Saving to database..." },
  COMPLETE: { percent: 100, message: "Flashcards ready!" },
} as const;

// OpenRouter Configuration
export const OPENROUTER_CONFIG = {
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",
  model: "google/gemini-2.5-flash-lite",
  maxTokens: 4000,
  temperature: 0.7,
} as const;

export const STORAGE_CONFIG = {
  bucket: "uploads",
  defaultMimeType: "application/octet-stream",
  maxFileSize: 10 * 1024 * 1024, // 10MB
} as const;
