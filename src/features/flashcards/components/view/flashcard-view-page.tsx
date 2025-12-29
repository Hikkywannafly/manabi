"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, MoreVertical } from "lucide-react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useFlashcards } from "../../hooks/use-flashcards";
import { FlashcardService } from "../../services/flashcard-service";
import { FlashcardNavigation } from "./flashcard-navigation";
import { FlashcardViewer } from "./flashcard-viewer";

interface FlashcardViewPageProps {
  deckId: string;
}

export function FlashcardViewPage({ deckId }: FlashcardViewPageProps) {
  const { data: deck, isLoading: isDeckLoading } = useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => FlashcardService.getDeck(deckId),
  });

  const { data: cards, isLoading: isCardsLoading } = useFlashcards(deckId);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLoading = isDeckLoading || isCardsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!(cards && deck)) return <div>Deck not found</div>;

  const currentCard = cards[currentIndex];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center">
          {/* Header Section matching QuizHeader */}
          <div className="w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="prose prose-sm md:prose-lg mx-auto max-w-none text-center font-medium text-base text-muted-foreground sm:text-lg">
              <p>{deck.title}</p>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4 md:flex-nowrap">
              <div
                role="progressbar"
                className="relative h-4 w-full flex-1 overflow-hidden rounded-full bg-secondary"
              >
                <div
                  className="size-full flex-1 bg-primary transition-all"
                  style={{
                    transform: `translateX(-${100 - ((currentIndex + 1) / cards.length) * 100}%)`,
                  }}
                />
              </div>
              <div className="shrink-0 text-right font-semibold text-lg sm:text-xl">
                {currentIndex + 1} / {cards.length}
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10 rounded-2xl"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete Deck
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Flashcard Viewer */}
          <div className="flex w-full justify-center px-4">
            {currentCard ? (
              <div className="w-full max-w-3xl">
                <FlashcardViewer card={currentCard} />
              </div>
            ) : (
              <div className="flex h-64 w-full items-center justify-center rounded-xl border bg-muted/20">
                <p className="text-muted-foreground">No cards available</p>
              </div>
            )}
          </div>

          {/* Cards List (Below viewer) */}
          <div className="container mx-auto max-w-4xl space-y-4 p-4 pt-8 pb-20">
            <h3 className="font-semibold text-xl">
              Cards in this deck ({cards.length})
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card, i) => (
                <button
                  type="button"
                  key={card.id}
                  className={`flex cursor-pointer flex-col justify-between rounded-lg border bg-card p-4 text-left shadow-sm transition-colors ${i === currentIndex ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"}`}
                  onClick={() => setCurrentIndex(i)}
                >
                  <div className="mb-4">
                    <span className="mb-2 block font-medium text-muted-foreground text-xs uppercase">
                      Term
                    </span>
                    <p className="line-clamp-3 font-medium">{card.front}</p>
                  </div>
                  <Separator className="my-2" />
                  <div>
                    <span className="mb-2 block font-medium text-muted-foreground text-xs uppercase">
                      Definition
                    </span>
                    <p className="line-clamp-3 text-muted-foreground text-sm">
                      {card.back}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Fixed) */}
      <div className="flex-shrink-0">
        <FlashcardNavigation
          currentIndex={currentIndex}
          totalCards={cards.length}
          onPrevious={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          onNext={() =>
            setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1))
          }
          onShuffle={() => {
            // Shuffle logic (placeholder)
          }}
          onFlipOrder={() => {
            // Flip logic placeholder
          }}
        />
      </div>
    </div>
  );
}
