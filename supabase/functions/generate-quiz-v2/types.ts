/**
 * Type definitions for Quiz Generation V2
 */

export interface ProgressStep {
  percent: number;
  message: string;
}

export interface GenerationParams {
  difficulty?: string;
  numberOfQuestions?: number;
  questionTypes?: string[];
  language?: string;
  customInstructions?: string;
  task?: "generate" | "extract";
  mode?: "quiz" | "exam";
  parsingMode?: "fast" | "balanced" | "premium";
}

export interface QuestionData {
  question_text: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string;
}

export interface QuizResponse {
  title: string;
  questions: QuestionData[];
}

export interface RequestPayload {
  filePath?: string;
  textContent?: string;
  youtubeUrl?: string;
  webpageUrl?: string;
  imageUrl?: string;
  quizId: string;
  generationParams?: GenerationParams;
}

export interface DocumentChunk {
  pageContent: string;
  metadata: Record<string, unknown>;
}

export interface VectorDocument {
  content: string;
  metadata: Record<string, unknown>;
  embedding: number[];
}
