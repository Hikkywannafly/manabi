import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type GenerationParams = {
  difficulty: "Easy" | "Medium" | "Hard";
  numberOfQuestions: number;
  questionType: string;
  language: string;
  mode: "quiz" | "exam";
  parsingMode: "fast" | "balanced" | "premium";
  task: "generate" | "extract";
  customInstructions?: string;
};

export type FlashcardGenerationParams = {
  difficulty: "Easy" | "Medium" | "Hard";
  numberOfCards: number; // or string if handled that way, but edge function expects number
  language: string;
  parsingMode: "fast" | "balanced";
  customInstructions?: string;
};

export type ProgressPayload = {
  progress: number;
  message: string;
  data?: any;
};

export const AIService = {
  /**
   * Triggers the AI content generation Edge Function.
   * @returns The initial task response (e.g., successful start).
   */
  async generateContent(
    filePath: string | undefined,
    textContent: string | undefined,
    quizId: string,
    params: GenerationParams,
  ) {
    const { data, error } = await supabase.functions.invoke(
      "generate-content",
      {
        body: {
          action: "generate_quiz",
          filePath,
          textContent,
          quizId,
          generationParams: params,
        },
      },
    );

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Triggers the AI Flashcard generation Edge Function.
   */
  async generateFlashcards(
    filePath: string | undefined,
    textContent: string | undefined,
    deckId: string,
    params: FlashcardGenerationParams,
  ) {
    const { data, error } = await supabase.functions.invoke(
      "generate-flashcards",
      {
        body: {
          filePath,
          textContent,
          deckId,
          generationParams: params,
        },
      },
    );

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Subscribes to Realtime progress events for a specific Quiz ID.
   * @param quizId The ID of the quiz/task being generated.
   * @param onProgress Callback function to handle progress updates.
   * @returns Unsubscribe function.
   */
  subscribeToProgress(
    quizId: string,
    onProgress: (payload: ProgressPayload) => void,
  ) {
    const channel = supabase
      .channel(`quiz:${quizId}`)
      .on("broadcast", { event: "progress" }, (payload) => {
        if (payload.payload) {
          onProgress(payload.payload as ProgressPayload);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribes to Realtime progress events for a specific Flashcard Deck ID.
   */
  subscribeToDeckProgress(
    deckId: string,
    onProgress: (payload: ProgressPayload) => void,
  ) {
    const channel = supabase
      .channel(`deck:${deckId}`)
      .on("broadcast", { event: "progress" }, (payload) => {
        if (payload.payload) {
          onProgress(payload.payload as ProgressPayload);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
