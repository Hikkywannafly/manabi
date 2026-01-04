"use client";

import { ChevronRight, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { AIExplanationContext } from "./types";
import { useAIExplanation } from "./use-ai-explanation";

interface AIExplanationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context: AIExplanationContext | null;
}

export function AIExplanationPanel({
  isOpen,
  onClose,
  context,
}: AIExplanationPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const {
    messages,
    explanation,
    isLoading,
    fetchExplanation,
    askFollowUp,
    reset,
  } = useAIExplanation(context);

  // Auto-scroll to bottom when messages update
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  });

  // Fetch explanation when panel opens with new context
  useEffect(() => {
    if (isOpen && context && messages.length === 0) {
      fetchExplanation();
    }
  }, [isOpen, context, messages.length, fetchExplanation]);

  // Reset when context changes (new question)
  const contextKey = context?.questionText || context?.front || "";
  useEffect(() => {
    if (contextKey) {
      reset();
    }
  }, [contextKey, reset]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    askFollowUp(inputValue.trim());
    setInputValue("");
  };

  const handleSuggestedQuestion = (question: string) => {
    if (isLoading) return;
    askFollowUp(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex h-full w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="shrink-0 border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base">Manabi Explanation</SheetTitle>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full">
            <div className="space-y-4 p-4">
              {/* Messages */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-lg p-3",
                    message.role === "assistant"
                      ? "bg-muted"
                      : "ml-8 bg-primary text-primary-foreground",
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              )}

              {/* Suggested Questions */}
              {explanation?.suggestedQuestions &&
                explanation.suggestedQuestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {explanation.suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestedQuestion(question)}
                        disabled={isLoading}
                        className="flex w-full items-start gap-1 text-left text-xs hover:underline disabled:opacity-50"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>{question}</p>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="shrink-0 border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask a follow-up question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
