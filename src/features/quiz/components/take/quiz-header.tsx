"use client";

import { FileDown, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { QuizTakeMode } from "../../types";

interface QuizHeaderProps {
  title: string;
  currentQuestion: number;
  totalQuestions: number;
  mode?: QuizTakeMode;
  onShuffle?: () => void;
}

export function QuizHeader({
  title,
  currentQuestion,
  totalQuestions,
  mode: _mode = "test",
  onShuffle,
}: QuizHeaderProps) {
  const router = useRouter();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleExitQuiz = () => {
    router.back();
  };

  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 className="hidden">{title}</h1>
      <div className="prose prose-sm md:prose-lg mt-4 max-w-none text-center font-medium text-base text-muted-foreground sm:text-lg md:mt-8 lg:mt-12">
        <p>{title}</p>
      </div>
      <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4 md:flex-nowrap">
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          role="progressbar"
          data-state="indeterminate"
          data-max="100"
          className="relative h-4 w-full flex-1 overflow-hidden rounded-full bg-secondary"
        >
          <div
            data-state="indeterminate"
            data-max="100"
            className="size-full flex-1 bg-primary transition-all"
            style={{
              transform: `translateX(-${100 - ((currentQuestion + 1) / totalQuestions) * 100}%)`,
            }}
          />
        </div>
        <div className="shrink-0 text-right font-semibold text-lg sm:text-xl">
          {currentQuestion + 1} / {totalQuestions}
        </div>
        <div className="flex gap-2">
          {onShuffle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-2xl"
                  onClick={onShuffle}
                >
                  <Shuffle className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Randomize questions</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Button
            className="inline-flex size-10 shrink-0 select-none items-center justify-center rounded-2xl border border-input font-medium text-sm ring-offset-background transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleExitQuiz}
            variant="outline"
            size="icon"
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
              className="size-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
          <Button
            className="inline-flex size-10 shrink-0 select-none items-center justify-center rounded-2xl border border-input font-medium text-sm ring-offset-background transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleCopyLink}
            variant="outline"
            size="icon"
          >
            <FileDown className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
