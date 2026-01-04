import { useCallback, useState } from "react";
import { AIExplanationService } from "./service";
import type {
  AIExplanationContext,
  AIExplanationMessage,
  AIExplanationResponse,
} from "./types";

export function useAIExplanation(context: AIExplanationContext | null) {
  const [messages, setMessages] = useState<AIExplanationMessage[]>([]);
  const [explanation, setExplanation] = useState<AIExplanationResponse | null>(
    null,
  );
  const [isStreaming, setIsStreaming] = useState(false);

  const fetchExplanation = useCallback(async () => {
    if (!context) return;

    setIsStreaming(true);
    let fullContent = "";
    let suggestions: string[] = [];

    try {
      const stream = AIExplanationService.getExplanationStream(context);

      // Stream chunks and get final suggestions
      for await (const chunk of stream) {
        fullContent += chunk;
        // Update message progressively
        setMessages([{ role: "assistant", content: fullContent }]);
      }

      // Generator is exhausted, get return value
      const result = await stream.return([]);
      suggestions = (result.value || []) as string[];

      setExplanation({
        explanation: fullContent,
        suggestedQuestions: suggestions,
      });
    } catch (error) {
      console.error("Streaming error:", error);
      // Fallback to non-streaming
      try {
        const data = await AIExplanationService.getExplanation(context);
        setExplanation(data);
        setMessages([{ role: "assistant", content: data.explanation }]);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
    } finally {
      setIsStreaming(false);
    }
  }, [context]);

  const askFollowUp = useCallback(
    async (question: string) => {
      if (!context) return;

      setIsStreaming(true);
      let fullContent = "";
      let suggestions: string[] = [];

      // Add user message immediately
      setMessages((prev) => [...prev, { role: "user", content: question }]);

      try {
        const stream = AIExplanationService.askFollowUpStream(
          context,
          messages,
          question,
        );

        // Stream chunks and get final suggestions
        for await (const chunk of stream) {
          fullContent += chunk;
          // Update assistant message progressively
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: fullContent },
          ]);
        }

        // Generator is exhausted, get return value
        const result = await stream.return([]);
        suggestions = (result.value || []) as string[];

        setExplanation({
          explanation: fullContent,
          suggestedQuestions: suggestions,
        });
      } catch (error) {
        console.error("Streaming error:", error);
        // Fallback to non-streaming
        try {
          const data = await AIExplanationService.askFollowUp(
            context,
            messages,
            question,
          );
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.explanation },
          ]);
          setExplanation(data);
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [context, messages],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setExplanation(null);
  }, []);

  return {
    messages,
    explanation,
    isLoading: isStreaming,
    fetchExplanation,
    askFollowUp,
    reset,
  };
}
