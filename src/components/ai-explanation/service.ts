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
   * Get initial AI explanation with streaming
   */
  async *getExplanationStream(
    context: AIExplanationContext,
  ): AsyncGenerator<string, string[], void> {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) throw new Error("Not authenticated");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) throw new Error("Supabase URL not configured");

    const url = new URL(
      `${supabaseUrl}/functions/v1/ask-ai-explanation?stream=true`,
    );

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context,
        history: [],
      }),
    });

    // Check if we're actually getting SSE
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      // Fallback to non-streaming
      const jsonResponse = await response.json();
      // Return the response as if it was streamed
      yield jsonResponse.explanation || "";
      return jsonResponse.suggestedQuestions || [];
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let suggestions: string[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const decoded = decoder.decode(value, { stream: true });

      buffer += decoded;
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);

            if (parsed.type === "content") {
              yield parsed.content;
            } else if (parsed.type === "suggestions") {
              suggestions = parsed.suggestions;
            } else if (parsed.type === "error") {
              throw new Error(parsed.error);
            }
          } catch (_e) {
            // Skip invalid JSON
          }
        }
      }
    }

    return suggestions;
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

  /**
   * Ask a follow-up question with streaming
   */
  async *askFollowUpStream(
    context: AIExplanationContext,
    history: AIExplanationMessage[],
    question: string,
  ): AsyncGenerator<string, string[], void> {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) throw new Error("Not authenticated");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) throw new Error("Supabase URL not configured");

    const url = new URL(
      `${supabaseUrl}/functions/v1/ask-ai-explanation?stream=true`,
    );

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context,
        history,
        question,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let suggestions: string[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);

            if (parsed.type === "content") {
              yield parsed.content;
            } else if (parsed.type === "suggestions") {
              suggestions = parsed.suggestions;
            } else if (parsed.type === "error") {
              throw new Error(parsed.error);
            }
          } catch (_e) {
            // Skip invalid JSON
          }
        }
      }
    }

    return suggestions;
  },
};
