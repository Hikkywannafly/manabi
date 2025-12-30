import { useMutation } from "@tanstack/react-query";
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

  const { mutate: fetchExplanation, isPending: isLoadingExplanation } =
    useMutation({
      mutationFn: async () => {
        if (!context) throw new Error("No context provided");
        return AIExplanationService.getExplanation(context);
      },
      onSuccess: (data) => {
        setExplanation(data);
        setMessages([{ role: "assistant", content: data.explanation }]);
      },
    });

  const { mutate: askFollowUp, isPending: isLoadingFollowUp } = useMutation({
    mutationFn: async (question: string) => {
      if (!context) throw new Error("No context provided");
      return AIExplanationService.askFollowUp(context, messages, question);
    },
    onSuccess: (data, question) => {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: data.explanation },
      ]);
      setExplanation(data);
    },
  });

  const reset = useCallback(() => {
    setMessages([]);
    setExplanation(null);
  }, []);

  return {
    messages,
    explanation,
    isLoading: isLoadingExplanation || isLoadingFollowUp,
    fetchExplanation,
    askFollowUp,
    reset,
  };
}
