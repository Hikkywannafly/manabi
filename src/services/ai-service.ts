import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type GenerationParams = {
  difficulty: "Easy" | "Medium" | "Hard";
  numberOfQuestions: number;
  questionType: "Mixed" | "Multiple Choice" | "True/False";
};

export type ProgressPayload = {
  progress: number;
  message: string;
};

export const AIService = {
  /**
   * Triggers the AI content generation Edge Function.
   * @returns The initial task response (e.g., successful start).
   */
  async generateContent(
    filePath: string,
    quizId: string,
    params: GenerationParams,
  ) {
    const { data, error } = await supabase.functions.invoke(
      "generate-content",
      {
        body: {
          action: "generate_quiz",
          filePath,
          quizId,
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
};
