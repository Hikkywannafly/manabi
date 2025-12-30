// AI Explanation Types - Shared across Quiz and Flashcard features
export interface AIExplanationContext {
  contentType: "quiz" | "flashcard";
  questionText: string;
  options?: Array<{ id: string; text: string }>;
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  // For flashcards
  front?: string;
  back?: string;
}

export interface AIExplanationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIExplanationResponse {
  explanation: string;
  suggestedQuestions: string[];
}
