"use client";

import { ArrowRight, RotateCcw, Settings, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

export function QuizNavigation({
  currentQuestion,
  totalQuestions,
  answers: _answers,
  onPrevious: _onPrevious,
  onNext,
  onSubmit,
  onRestartQuiz,
  mode: _mode = "test",
}: QuizNavigationProps) {
  const hasNextQuestion = currentQuestion < totalQuestions - 1;

  return (
    <div className="z-10 flex w-full items-center justify-center bg-secondary p-4 sm:px-6 md:p-8">
      <div className="flex w-full max-w-6xl flex-wrap justify-between gap-4 md:flex-nowrap md:gap-8">
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
        <div className="flex w-full items-center justify-end gap-1 sm:gap-2 md:w-2/5">
          <Button
            variant="default"
            size="sm"
            onClick={onRestartQuiz}
            className="flex shrink-0 items-center rounded-2xl px-2 sm:px-3 md:flex-initial"
            type="button"
          >
            <RotateCcw className="sm:mr-2" />
            <span className="hidden sm:inline">Restart quiz</span>
          </Button>

          {hasNextQuestion ? (
            <Button
              variant="default"
              size="sm"
              onClick={onNext}
              className="flex min-w-0 flex-1 items-center rounded-2xl px-3 sm:min-w-fit sm:flex-initial"
            >
              <span className="truncate">See answer</span>
              <ArrowRight className="ml-2 shrink-0" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onSubmit}
              className="flex min-w-0 flex-1 items-center rounded-2xl px-3 sm:min-w-fit sm:flex-initial"
            >
              <span className="truncate">Submit</span>
              <ArrowRight className="ml-2 shrink-0" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
