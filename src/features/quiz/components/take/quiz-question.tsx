"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  QuizQuestion,
  QuizQuestionOption,
  QuizTakeMode,
} from "../../types";

interface QuizQuestionProps {
  question: QuizQuestion;
  selectedOptionId?: string;
  onAnswerChange: (optionId: string) => void;
  showResult?: boolean;
  correctOptionId?: string;
  mode?: QuizTakeMode;
}

export function QuizQuestionComponent({
  question,
  selectedOptionId,
  onAnswerChange,
  showResult = false,
  correctOptionId,
  mode: _mode = "test",
}: QuizQuestionProps) {
  // Parse options from JSON - handle both string and already parsed object
  let options: QuizQuestionOption[] = [];

  if (question.options) {
    let rawOptions: any;

    // First, parse if it's a string
    if (typeof question.options === "string") {
      rawOptions = JSON.parse(question.options);
    } else {
      rawOptions = question.options;
    }

    // Then, handle the parsed data
    if (Array.isArray(rawOptions)) {
      // Check if it's array of strings or array of objects
      if (typeof rawOptions[0] === "string") {
        // Convert string array to QuizQuestionOption array
        options = rawOptions.map((text, index) => ({
          id: `option-${index}`,
          text: text,
        }));
      } else {
        // Already array of objects
        options = rawOptions as QuizQuestionOption[];
      }
    } else {
      // It's an object, cast it
      options = rawOptions as unknown as QuizQuestionOption[];
    }
  }

  const getOptionClasses = (optionId: string) => {
    const isSelected = optionId === selectedOptionId;
    const isCorrect = optionId === correctOptionId;
    const isIncorrect = isSelected && !isCorrect && showResult;

    if (showResult) {
      if (isCorrect) {
        return "ring-2 ring-primary";
      }
      if (isIncorrect) {
        return "ring-2 ring-primary";
      }
    }

    if (isSelected) {
      return "ring-2 ring-primary";
    }

    return "";
  };

  return (
    <div className="relative w-full flex-1 px-4 pb-48 sm:max-w-2xl sm:px-6 sm:pb-44 md:max-w-3xl md:pb-40 lg:max-w-4xl lg:px-8">
      {/* Question Text */}
      <div className="prose prose-sm md:prose-lg my-4 block max-w-none text-center font-semibold text-base sm:my-6 sm:text-lg md:my-8 lg:my-12 lg:text-xl">
        <p>{question.question_text}</p>
      </div>

      {/* Switch to Type Mode Button */}
      <div className="mb-4 flex justify-center">
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-2xl px-4 py-2"
          disabled
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 8h.01" />
            <path d="M12 12h.01" />
            <path d="M14 8h.01" />
            <path d="M16 12h.01" />
            <path d="M18 8h.01" />
            <path d="M6 8h.01" />
            <path d="M7 16h10" />
            <path d="M8 12h.01" />
            <rect width="20" height="16" x="2" y="4" rx="2" />
          </svg>
          Switch to Type mode
        </Button>
      </div>

      {/* Options */}
      <div className="w-full space-y-2 md:space-y-4">
        {options.map((option, index) => {
          const letter = String.fromCharCode(65 + index);

          return (
            <Button
              key={option.id}
              variant="secondary"
              className={cn(
                "relative size-auto w-full justify-start rounded-2xl p-3 text-sm sm:p-3.5 sm:text-base md:p-4 md:text-lg lg:text-xl",
                getOptionClasses(option.id),
              )}
              onClick={() => !showResult && onAnswerChange(option.id)}
              disabled={showResult}
            >
              <div className="prose prose-sm md:prose-lg max-w-none text-wrap text-start">
                <p>
                  {letter}. {option.text}
                </p>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-muted-foreground text-xs sm:mt-4 sm:gap-3 sm:text-sm md:gap-4">
        <p>
          Use <span className="font-semibold">A B C D</span> to select
        </p>
        <div className="size-1 rounded-full bg-muted-foreground" />
        <p>
          Use <span className="font-semibold">1 2 3 4</span> to select
        </p>
        <div className="size-1 rounded-full bg-muted-foreground" />
        <p>
          Use <span className="font-semibold">↑</span> and{" "}
          <span className="font-semibold">↓</span> to navigate
        </p>
        <div className="size-1 rounded-full bg-muted-foreground" />
        <p>
          Use <span className="font-semibold">Enter</span> to continue
        </p>
      </div>
    </div>
  );
}
