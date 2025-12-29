"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFlashcards } from "../../hooks/use-flashcards";
import { useStudySession } from "../../hooks/use-study-session";
import { FlashcardActions } from "./flashcard-actions";
import { FlashcardSummary } from "./flashcard-summary";

interface FlashcardStudyModeProps {
  deckId: string;
}

export function FlashcardStudyMode({ deckId }: FlashcardStudyModeProps) {
  const { data: cards, isLoading } = useFlashcards(deckId);
  const {
    currentCard,
    currentIndex,
    totalCards,
    isRevealed,
    isFinished,
    reveal,
    rate,
    restart,
    history,
  } = useStudySession(cards);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading || !currentCard || isFinished) return;

      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (!isRevealed) {
          reveal();
        }
      } else if (isRevealed) {
        if (e.key === "1") rate("again");
        if (e.key === "2") rate("hard");
        if (e.key === "3") rate("good");
        if (e.key === "4") rate("easy");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRevealed, isFinished, isLoading, currentCard, reveal, rate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No cards in this deck.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <FlashcardSummary cards={cards} history={history} onRestart={restart} />
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center">
          <h1 className="hidden">Flashcard Study</h1>

          <div className="prose prose-sm md:prose-lg mt-4 max-w-none text-center font-medium text-base text-muted-foreground sm:text-lg md:mt-8 lg:mt-12">
            <p>
              Card {currentIndex + 1} of {totalCards}
            </p>
          </div>

          <div className="mt-4 w-full px-4 sm:max-w-2xl md:max-w-3xl md:px-6 lg:max-w-4xl lg:px-0">
            <div className="flex h-full flex-col items-center justify-center pt-8 md:pt-0">
              <div className="@container group relative mx-auto mb-6 w-full max-w-lg">
                {/* Stack Effect Backgrounds */}
                <div className="-z-20 absolute size-full translate-x-1.5 translate-y-1.5 rotate-2 rounded-lg bg-muted transition-transform duration-300 ease-out group-hover:translate-x-2.5 group-hover:translate-y-2.5 group-hover:rotate-3" />
                <div className="-z-10 absolute size-full translate-x-0.5 translate-y-0.5 rotate-1 rounded-lg bg-muted/70 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:translate-y-1 group-hover:rotate-1" />

                {/* Main Card */}
                <button
                  type="button"
                  className="relative flex min-h-[400px] w-full cursor-pointer flex-col overflow-hidden rounded-lg bg-secondary text-left shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={reveal}
                >
                  <div className="flex h-full w-full flex-grow flex-col">
                    {/* Front Content */}
                    <div className="flex min-h-[200px] flex-grow flex-col items-center justify-center border-border/50 border-b p-8 text-center">
                      <span className="mb-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Front
                      </span>
                      <div className="prose prose-sm md:prose-lg dark:prose-invert max-w-none font-medium text-foreground text-lg md:text-xl">
                        <p>{currentCard?.front}</p>
                      </div>
                    </div>

                    {/* Back Content (Revealed) */}
                    {isRevealed && (
                      <div className="fade-in slide-in-from-top-2 flex min-h-[200px] flex-grow animate-in flex-col items-center justify-center bg-primary/5 p-8 text-center duration-300 dark:bg-primary/10">
                        <span className="mb-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                          Back
                        </span>
                        <div className="prose prose-sm md:prose-lg dark:prose-invert max-w-none overflow-y-auto text-foreground text-lg md:text-xl">
                          <p>{currentCard?.back}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <FlashcardActions
          isRevealed={isRevealed}
          onReveal={reveal}
          onRate={rate}
          onRestart={restart}
          disabled={isLoading || isFinished}
        />
      </div>
    </div>
  );
}
