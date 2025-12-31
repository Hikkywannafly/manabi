"use client";

import {
  ArrowLeft,
  ArrowRight,
  Settings,
  Share,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FlashcardNavigationProps {
  currentIndex: number;
  totalCards: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function FlashcardNavigation({
  currentIndex,
  totalCards,
  onPrevious,
  onNext,
}: FlashcardNavigationProps) {
  const hasNext = currentIndex < totalCards - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <div
      className={cn(
        "z-10 flex w-full items-center justify-center border-t bg-background p-4 sm:px-6 md:p-8",
      )}
    >
      <div className="flex w-full max-w-6xl flex-wrap justify-between gap-4 md:flex-nowrap md:gap-8">
        {/* Left Section: Settings / Actions */}
        {/* <div className="flex grow items-center gap-2 md:w-3/5">
          <Button variant="ghost" className="rounded-2xl">
            <Settings className="size-4" />
          </Button>
          <Button variant="ghost" className="rounded-2xl">
            <MessageSquare className="size-4" />
          </Button>
        </div> */}
        <div className="flex grow items-center md:w-3/5">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl md:flex-initial"
            type="button"
          >
            <Settings className="mr-2 size-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            className="ml-2 flex-1 shrink-0 rounded-2xl md:flex-initial"
          >
            <Share className="mr-2" />
            Share
          </Button>
          <Button
            className={cn(
              "flex h-10 shrink-0 items-center rounded-2xl px-4 py-2 text-white",
            )}
          >
            <WandSparkles className="mr-2" size={16} />
            Ask Manabi for explanation
          </Button>
        </div>
        {/* Right Section: Navigation */}
        <div className="flex w-full items-center justify-end gap-2 md:w-2/5">
          <Button
            size="sm"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="flex shrink-0 items-center rounded-2xl px-3"
            variant="secondary"
          >
            <ArrowLeft className="mr-2 size-4" />
            Previous
          </Button>

          <Button
            size="sm"
            onClick={onNext}
            disabled={!hasNext}
            className="flex shrink-0 items-center rounded-2xl px-3"
          >
            Next
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
