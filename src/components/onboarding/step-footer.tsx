"use client";

import { Button } from "@/components/ui/button";

interface StepFooterProps {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  loading?: boolean;
  hasAnswer: boolean;
  isLastStep?: boolean;
  showBack?: boolean;
}

export function StepFooter({
  onBack,
  onNext,
  onSkip,
  loading = false,
  hasAnswer,
  isLastStep = false,
  showBack = true,
}: StepFooterProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 border-t bg-background">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          {showBack ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={loading}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <Button
              onClick={onNext}
              disabled={!hasAnswer || loading}
              className="rounded-2xl px-8"
            >
              {isLastStep ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </div>

      {/* Skip button below main buttons */}
      <div className="container mx-auto flex justify-center p-4 pt-0">
        <Button
          type="button"
          variant="ghost"
          onClick={onSkip}
          disabled={loading}
          className="text-muted-foreground text-xs hover:text-foreground"
        >
          Skip intro
        </Button>
      </div>
    </div>
  );
}
