import { createClient } from "@/lib/supabase/client";
import type {
  AIExplanationContext,
  AIExplanationMessage,
  AIExplanationResponse,
} from "./types";

export const AIExplanationService = {
  /**
   * Get initial AI explanation for quiz question or flashcard
   */
  async getExplanation(
    context: AIExplanationContext,
  ): Promise<AIExplanationResponse> {
    const supabase = createClient();

    const { data, error } = await supabase.functions.invoke(
      "ask-ai-explanation",
      {
        body: {
          context,
          history: [],
        },
      },
    );

    if (error) throw new Error(error.message);
    return data as AIExplanationResponse;
  },

  /**
   * Ask a follow-up question
   */
  async askFollowUp(
    context: AIExplanationContext,
    history: AIExplanationMessage[],
    question: string,
  ): Promise<AIExplanationResponse> {
    const supabase = createClient();

    const { data, error } = await supabase.functions.invoke(
      "ask-ai-explanation",
      {
        body: {
          context,
          history,
          question,
        },
      },
    );

    if (error) throw new Error(error.message);
    return data as AIExplanationResponse;
  },
};
