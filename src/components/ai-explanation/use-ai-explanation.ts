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
    if (!context) {
      return;
    }

    setIsStreaming(true);

    // Show loading immediately
    setMessages([{ role: "assistant", content: "" }]);

    let fullContent = "";
    let suggestions: string[] = [];

    try {
      const stream = AIExplanationService.getExplanationStream(context);

      // Stream chunks and get final suggestions
      for await (const chunk of stream) {
        fullContent += chunk;

        // Try to extract explanation from partial JSON
        let displayContent = fullContent;

        // Match explanation value in JSON (even if incomplete)
        const explanationMatch = displayContent.match(
          /"explanation"\s*:\s*"([^"]*)"/,
        );
        if (explanationMatch) {
          displayContent = explanationMatch[1];
        }

        // Update message progressively with extracted text only
        setMessages([{ role: "assistant", content: displayContent }]);
      }

      // Generator is exhausted, get return value
      const result = await stream.return([]);
      suggestions = (result.value || []) as string[];

      // Final parse - extract clean explanation
      let finalExplanation = fullContent;
      try {
        const parsed = JSON.parse(
          fullContent
            .replace(/```json\s*/g, "")
            .replace(/```\s*/g, "")
            .trim(),
        );
        if (parsed.explanation) {
          finalExplanation = parsed.explanation;
          // Override suggestions if in JSON
          if (
            parsed.suggested_questions &&
            Array.isArray(parsed.suggested_questions)
          ) {
            suggestions = parsed.suggested_questions;
          }
        }
      } catch {
        // Fallback: try regex extraction
        const match = fullContent.match(/"explanation"\s*:\s*"([^"]*)"/);
        if (match) {
          finalExplanation = match[1];
        }
      }

      // Update with final parsed content
      setMessages([{ role: "assistant", content: finalExplanation }]);
      setExplanation({
        explanation: finalExplanation,
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
        setMessages([
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
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

      // Add user message and assistant placeholder immediately
      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: "" },
      ]);

      try {
        const stream = AIExplanationService.askFollowUpStream(
          context,
          messages,
          question,
        );

        // Stream chunks and get final suggestions
        for await (const chunk of stream) {
          fullContent += chunk;

          // Try to extract explanation from partial JSON
          let displayContent = fullContent;

          // Match explanation value in JSON (even if incomplete)
          const explanationMatch = displayContent.match(
            /"explanation"\s*:\s*"([^"]*)"/,
          );
          if (explanationMatch) {
            displayContent = explanationMatch[1];
          }

          // Update assistant message progressively with extracted text only
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: displayContent },
          ]);
        }

        // Generator is exhausted, get return value
        const result = await stream.return([]);
        suggestions = (result.value || []) as string[];

        // Final parse - extract clean explanation
        let finalExplanation = fullContent;
        try {
          const parsed = JSON.parse(
            fullContent
              .replace(/```json\s*/g, "")
              .replace(/```\s*/g, "")
              .trim(),
          );
          if (parsed.explanation) {
            finalExplanation = parsed.explanation;
            // Override suggestions if in JSON
            if (
              parsed.suggested_questions &&
              Array.isArray(parsed.suggested_questions)
            ) {
              suggestions = parsed.suggested_questions;
            }
          }
        } catch {
          // Fallback: try regex extraction
          const match = fullContent.match(/"explanation"\s*:\s*"([^"]*)"/);
          if (match) {
            finalExplanation = match[1];
          }
        }

        // Update with final parsed content
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: finalExplanation },
        ]);
        setExplanation({
          explanation: finalExplanation,
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
            ...prev.slice(0, -1),
            { role: "assistant", content: data.explanation },
          ]);
          setExplanation(data);
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again.",
            },
          ]);
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
