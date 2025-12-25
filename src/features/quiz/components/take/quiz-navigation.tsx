"use client";

import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  RotateCcw,
  Settings,
  Share,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { QuizAnswer, QuizTakeMode } from "../../types";

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  answers: QuizAnswer[];
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onRestartQuiz: () => void;
  mode?: QuizTakeMode;
  showFeedback?: boolean;
  isCorrect?: boolean;
  correctAnswer?: string;
  onRetry?: () => void;
}

export function QuizNavigation({
  currentQuestion,
  totalQuestions,
  answers: _answers,
  onPrevious,
  onNext,
  onSubmit,
  onRestartQuiz,
  mode = "test",
  showFeedback = false,
  isCorrect = false,
  correctAnswer,
  onRetry,
}: QuizNavigationProps) {
  const hasNextQuestion = currentQuestion < totalQuestions - 1;
  const hasPreviousQuestion = currentQuestion > 0;

  // Determine background color based on feedback
  const bgColor = showFeedback
    ? isCorrect
      ? "!bg-green-900"
      : "!bg-red-900"
    : "bg-secondary";

  // Determine button color based on feedback
  const buttonColor = showFeedback
    ? isCorrect
      ? "bg-green-600 text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-700"
      : "bg-red-600 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-700"
    : "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <div
      className={cn(
        "z-10 flex w-full items-center justify-center p-4 sm:px-6 md:p-8",
        bgColor,
      )}
    >
      <div className="flex w-full max-w-6xl flex-wrap justify-between gap-4 md:flex-nowrap md:gap-8">
        {/* Feedback Section (TEST mode only) */}
        {showFeedback && mode === "test" ? (
          <div className="flex grow items-center md:w-3/5">
            <ScrollArea
              className={cn(
                "relative max-h-[60vh] overflow-hidden",
                isCorrect
                  ? "!text-green-200 dark:!text-green-300 [&_ol>li::marker]:text-green-200 dark:[&_ol>li::marker]:text-green-300 [&_ul>li::marker]:text-green-200 dark:[&_ul>li::marker]:text-green-300"
                  : "!text-red-200 dark:!text-red-300 [&_ol>li::marker]:text-red-200 dark:[&_ol>li::marker]:text-red-300 [&_ul>li::marker]:text-red-200 dark:[&_ul>li::marker]:text-red-300",
              )}
            >
              <p className="font-semibold text-xl">
                {isCorrect ? "Correct!" : "Incorrect!"}
              </p>
              <div className="space-y-2">
                <span className="block">
                  The answer is:{" "}
                  <div
                    className={cn(
                      "prose prose-sm md:prose-lg inline-block max-w-none font-semibold",
                      isCorrect
                        ? "!text-green-200 dark:!text-green-300 prose-strong:text-green-200 dark:prose-strong:text-green-300 [&_ol>li::marker]:text-green-200 dark:[&_ol>li::marker]:text-green-300 [&_ul>li::marker]:text-green-200 dark:[&_ul>li::marker]:text-green-300"
                        : "!text-red-200 dark:!text-red-300 prose-strong:text-red-200 dark:prose-strong:text-red-300 [&_ol>li::marker]:text-red-200 dark:[&_ol>li::marker]:text-red-300 [&_ul>li::marker]:text-red-200 dark:[&_ul>li::marker]:text-red-300",
                    )}
                  >
                    <p>{correctAnswer}</p>
                  </div>
                </span>
                <Button
                  className={cn(
                    "flex h-10 shrink-0 items-center rounded-2xl px-4 py-2 text-white",
                    buttonColor,
                  )}
                >
                  <WandSparkles className="mr-2" size={16} />
                  Ask AI for explanation
                </Button>
              </div>
            </ScrollArea>
          </div>
        ) : (
          /* Settings/Share Section (EXAM mode or no feedback) */
          <div className="flex grow items-center md:w-3/5">
            <Button
              variant="default"
              className="flex-1 rounded-2xl md:flex-initial"
              type="button"
            >
              <Settings className="mr-2 size-4" />
              Settings
            </Button>
            <Button
              variant="default"
              className="ml-2 flex-1 shrink-0 rounded-2xl md:flex-initial"
            >
              <Share className="mr-2" />
              Share
            </Button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex w-full items-center justify-end gap-1 sm:gap-2 md:w-2/5">
          {/* Previous Button - Always show if not first question */}
          {hasPreviousQuestion && (
            <Button
              size="sm"
              onClick={onPrevious}
              className={cn(
                "flex shrink-0 items-center rounded-2xl px-2 sm:px-3 md:flex-initial",
                showFeedback
                  ? buttonColor
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              <ArrowLeft className="sm:mr-2" size={16} />
              <span className="hidden sm:inline">Previous</span>
            </Button>
          )}

          {/* Restart Quiz Button */}
          <Button
            size="sm"
            onClick={onRestartQuiz}
            className={cn(
              "flex shrink-0 items-center rounded-2xl px-2 sm:px-3 md:flex-initial",
              showFeedback
                ? buttonColor
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            type="button"
          >
            <RotateCcw className="sm:mr-2" size={16} />
            <span className="hidden sm:inline">Restart quiz</span>
          </Button>

          {/* Retry Button (only for incorrect answers in TEST mode) */}
          {showFeedback && !isCorrect && onRetry && (
            <Button
              size="sm"
              onClick={onRetry}
              className={cn(
                "flex shrink-0 items-center rounded-2xl px-2 sm:px-3 md:flex-initial",
                buttonColor,
              )}
            >
              <RefreshCw className="mr-2" size={16} />
              <span>Retry</span>
            </Button>
          )}

          {/* Next/Submit Button */}
          {hasNextQuestion ? (
            <Button
              size="sm"
              onClick={onNext}
              className={cn(
                "flex min-w-0 flex-1 items-center rounded-2xl px-3 sm:min-w-fit sm:flex-initial",
                showFeedback
                  ? buttonColor
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              <span className="truncate">
                {showFeedback ? "Next" : "See answer"}
              </span>
              <ArrowRight className="ml-2 shrink-0" size={16} />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onSubmit}
              className={cn(
                "flex min-w-0 flex-1 items-center rounded-2xl px-3 sm:min-w-fit sm:flex-initial",
                showFeedback
                  ? buttonColor
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              <span className="truncate">Submit</span>
              <ArrowRight className="ml-2 shrink-0" size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
