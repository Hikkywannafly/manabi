"use client";

import { CheckCircle } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  QuestionType,
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
  questionType?: QuestionType;
}

export function QuizQuestionComponent({
  question,
  selectedOptionId,
  onAnswerChange,
  showResult = false,
  correctOptionId,
  questionType,
}: QuizQuestionProps) {
  // Hooks must be at the top level
  const [localValue, setLocalValue] = React.useState(selectedOptionId || "");

  // Update local value when selectedOptionId changes (e.g., on retry)
  React.useEffect(() => {
    setLocalValue(selectedOptionId || "");
  }, [selectedOptionId]);

  // Determine question type from prop or question data
  const type = questionType || question.question_type || "multiple_choice";
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
        return "ring-2 ring-green-500";
      }
      if (isIncorrect) {
        return "ring-2 ring-red-500";
      }
    }

    if (isSelected) {
      return "ring-2 ring-primary";
    }

    return "";
  };

  // Render True/False question
  if (type === "true_false") {
    const trueFalseOptions: QuizQuestionOption[] = [
      { id: "true", text: "True" },
      { id: "false", text: "False" },
    ];

    return (
      <div className="relative w-full flex-1 px-4 pb-48 sm:max-w-2xl sm:px-6 sm:pb-44 md:max-w-3xl md:pb-40 lg:max-w-4xl lg:px-8">
        <div className="prose prose-sm md:prose-lg my-4 block max-w-none text-center font-semibold text-base sm:my-6 sm:text-lg md:my-8 lg:my-12 lg:text-xl">
          <p>{question.question_text}</p>
        </div>

        <div className="w-full space-y-2 md:space-y-4">
          {trueFalseOptions.map((option) => {
            const isCorrect = option.id === correctOptionId;

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
                {showResult && isCorrect && (
                  <CheckCircle className="-translate-y-1/2 absolute top-1/2 right-4 size-5 text-green-500" />
                )}
                <div className="prose prose-sm md:prose-lg max-w-none text-wrap text-start">
                  <p>{option.text}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  // Render Fill in Blank or Short Answer
  if (type === "fill_in_blank" || type === "short_answer") {
    return (
      <div className="relative w-full flex-1 px-4 pb-48 sm:max-w-2xl sm:px-6 sm:pb-44 md:max-w-3xl md:pb-40 lg:max-w-4xl lg:px-8">
        <div className="prose prose-sm md:prose-lg my-4 block max-w-none text-center font-semibold text-base sm:my-6 sm:text-lg md:my-8 lg:my-12 lg:text-xl">
          <p>{question.question_text}</p>
        </div>

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
            Switch to Choose mode
          </Button>
        </div>

        <Textarea
          className="min-h-[180px] w-full bg-secondary text-sm sm:min-h-[200px] sm:text-base md:text-lg"
          placeholder="Type your answer here..."
          value={localValue}
          onChange={(e) => {
            if (!showResult) {
              setLocalValue(e.target.value);
            }
          }}
          onBlur={(e) => {
            // Trigger feedback only when user leaves the input
            if (!showResult && e.target.value.trim()) {
              onAnswerChange(e.target.value);
            }
          }}
          disabled={showResult}
        />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-sm">
          <p>
            Use <span className="font-semibold">Enter</span> to continue
          </p>
          <div className="size-1 rounded-full bg-muted-foreground" />
          <p>
            Use <span className="font-semibold">Shift + Enter</span> to break a
            line
          </p>
        </div>
      </div>
    );
  }

  // Render Multiple Choice (default)
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
          const isCorrect = option.id === correctOptionId;

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
              {showResult && isCorrect && (
                <CheckCircle className="-translate-y-1/2 absolute top-1/2 right-4 size-5 text-green-500" />
              )}
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
