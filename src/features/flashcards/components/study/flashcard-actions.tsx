"use client";

import { ArrowRight, RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlashcardActionsProps {
  isRevealed: boolean;
  onReveal: () => void;
  onRate: (rating: "again" | "hard" | "good" | "easy") => void;
  onRestart: () => void;
  disabled?: boolean;
}

export function FlashcardActions({
  isRevealed,
  onReveal,
  onRate,
  onRestart,
  disabled,
}: FlashcardActionsProps) {
  return (
    <div className="z-10 flex w-full items-center justify-center bg-secondary p-4 sm:px-6 md:p-8">
      <div className="flex w-full max-w-6xl flex-wrap justify-between gap-4 md:flex-nowrap md:gap-8">
        {/* Left Side: Tools/Settings */}
        <div className="flex grow items-center gap-2 md:w-1/3">
          <Button
            variant="outline"
            className="rounded-2xl bg-background"
            onClick={onRestart}
            type="button"
          >
            <RotateCcw className="mr-2 size-4" />
            Restart
          </Button>
          <Button
            variant="outline"
            className="rounded-2xl border-tertiary/20 bg-background text-tertiary-foreground hover:bg-tertiary/10"
            type="button"
          >
            <WandSparkles className="mr-2 size-4 text-tertiary" />
            Ask AI
          </Button>
        </div>

        {/* Right Side: Main Actions */}
        <div className="flex w-full items-center justify-end gap-2 md:w-2/3">
          {!isRevealed ? (
            <Button
              size="lg"
              onClick={onReveal}
              disabled={disabled}
              className="flex w-full items-center justify-center rounded-2xl md:w-auto md:min-w-[200px]"
              type="button"
            >
              Show Answer
              <ArrowRight className="ml-2 size-4" />
            </Button>
          ) : (
            <div className="grid w-full grid-cols-4 gap-2 md:flex md:w-auto md:gap-3">
              <Button
                variant="secondary"
                onClick={() => onRate("again")}
                className="flex h-auto flex-col items-center justify-center rounded-xl border border-border bg-background py-2 hover:border-red-200 hover:bg-accent hover:text-red-600 dark:hover:border-red-900/50"
                type="button"
              >
                <span className="mb-0.5 font-semibold text-muted-foreground text-xs">
                  Again
                </span>
                <span className="text-xs opacity-70">1m</span>
              </Button>

              <Button
                variant="secondary"
                onClick={() => onRate("hard")}
                className="flex h-auto flex-col items-center justify-center rounded-xl border border-border bg-background py-2 hover:border-amber-200 hover:bg-accent hover:text-amber-600 dark:hover:border-amber-900/50"
                type="button"
              >
                <span className="mb-0.5 font-semibold text-muted-foreground text-xs">
                  Hard
                </span>
                <span className="text-xs opacity-70">10m</span>
              </Button>

              <Button
                variant="secondary"
                onClick={() => onRate("good")}
                className="flex h-auto flex-col items-center justify-center rounded-xl border border-border bg-background py-2 hover:border-green-200 hover:bg-accent hover:text-green-600 dark:hover:border-green-900/50"
                type="button"
              >
                <span className="mb-0.5 font-semibold text-muted-foreground text-xs">
                  Good
                </span>
                <span className="text-xs opacity-70">1d</span>
              </Button>

              <Button
                variant="secondary"
                onClick={() => onRate("easy")}
                className="flex h-auto flex-col items-center justify-center rounded-xl border border-border bg-background py-2 hover:border-blue-200 hover:bg-accent hover:text-blue-600 dark:hover:border-blue-900/50"
                type="button"
              >
                <span className="mb-0.5 font-semibold text-muted-foreground text-xs">
                  Easy
                </span>
                <span className="text-xs opacity-70">4d</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
