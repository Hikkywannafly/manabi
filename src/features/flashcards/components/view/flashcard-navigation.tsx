"use client";

import {
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  RotateCcw,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FlashcardNavigationProps {
  currentIndex: number;
  totalCards: number;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle?: () => void;
  onFlipOrder?: () => void;
  showBack?: boolean;
}

export function FlashcardNavigation({
  currentIndex,
  totalCards,
  onPrevious,
  onNext,
  onShuffle,
  onFlipOrder,
  showBack: _showBack = false,
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
        <div className="flex grow items-center gap-2 md:w-3/5">
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={onFlipOrder}
            title="Flip Order"
          >
            <SlidersHorizontal className="mr-2 size-4" />
            <span className="hidden sm:inline">Flip Order</span>
          </Button>
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={onShuffle}
            title="Shuffle"
          >
            <RotateCcw className="mr-2 size-4" />
            <span className="hidden sm:inline">Shuffle</span>
          </Button>
          <Button variant="ghost" className="rounded-2xl">
            <Settings className="size-4" />
          </Button>
          <Button variant="ghost" className="rounded-2xl">
            <MessageSquare className="size-4" />
          </Button>
        </div>

        {/* Right Section: Navigation */}
        <div className="flex w-full items-center justify-end gap-2 md:w-2/5">
          <span className="mr-4 font-medium text-muted-foreground text-sm">
            {currentIndex + 1} / {totalCards}
          </span>

          <Button
            size="sm"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="flex shrink-0 items-center rounded-2xl px-3"
            variant="secondary"
          >
            <ArrowLeft className="mr-2 size-4" />
            Prev
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
