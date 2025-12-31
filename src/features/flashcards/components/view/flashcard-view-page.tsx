"use client";

import { useQuery } from "@tanstack/react-query";
import { MoreVertical, Shuffle, SlidersHorizontal } from "lucide-react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type AIExplanationContext,
  AIExplanationPanel,
} from "@/components/ai-explanation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFlashcards } from "../../hooks/use-flashcards";
import { FlashcardService } from "../../services/flashcard-service";
import type { FlashcardWithReview } from "../../types";
import { FlashcardNavigation } from "./flashcard-navigation";
import { FlashcardViewSummary } from "./flashcard-view-summary";
import { FlashcardViewer } from "./flashcard-viewer";

interface FlashcardViewPageProps {
  deckId: string;
}

export function FlashcardViewPage({ deckId }: FlashcardViewPageProps) {
  const { data: deck, isLoading: isDeckLoading } = useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => FlashcardService.getDeck(deckId),
  });

  const { data: originalCards, isLoading: isCardsLoading } =
    useFlashcards(deckId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardOrder, setCardOrder] = useState<number[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);

  // View session tracking
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  // AI Explanation Panel state
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

  // Use ref to track if we've initialized to prevent re-initialization
  const isInitialized = useRef(false);

  // Initialize card order and start time when cards load (only once)
  useEffect(() => {
    if (originalCards && !isInitialized.current) {
      setCardOrder(originalCards.map((_, i) => i));
      setStartTime(new Date());
      isInitialized.current = true;
    }
  }, [originalCards]);

  // Check if all cards have been viewed
  const isFinished = originalCards && viewedCards.size === originalCards.length;

  // Update session duration every second (stop when finished)
  useEffect(() => {
    if (!startTime || isFinished) return;

    const interval = setInterval(() => {
      const now = new Date();
      const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setSessionDuration(duration);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  // Get ordered cards - memoize to prevent recreation on every render
  const cards = useMemo(
    () => cardOrder.map((index) => originalCards?.[index]).filter(Boolean),
    [cardOrder, originalCards],
  );

  // Mark current card as viewed when index changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want to track when currentIndex changes
  useEffect(() => {
    if (originalCards && cardOrder[currentIndex] !== undefined) {
      const actualIndex = cardOrder[currentIndex];
      const currentCard = originalCards[actualIndex];
      if (currentCard) {
        setViewedCards((prev) => {
          // Only add if not already in the set
          if (prev.has(currentCard.id)) {
            return prev;
          }
          const newSet = new Set(prev);
          newSet.add(currentCard.id);
          return newSet;
        });
      }
    }
  }, [currentIndex]);

  // Build AI explanation context for current card
  const aiExplanationContext = useMemo((): AIExplanationContext | null => {
    const currentCard = cards?.[currentIndex];
    if (!currentCard) return null;

    return {
      contentType: "flashcard",
      questionText: currentCard.front,
      front: currentCard.front,
      back: currentCard.back,
      correctAnswer: currentCard.back,
    };
  }, [cards, currentIndex]);

  const handleShuffle = () => {
    if (!originalCards) return;
    const shuffled = [...cardOrder];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCardOrder(shuffled);
    setCurrentIndex(0);
  };

  const handleFlipOrder = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setViewedCards(new Set());
    setStartTime(new Date());
    setSessionDuration(0);
  }, []);

  const handleFinish = useCallback(() => {
    // Manually trigger finish - mark all cards as viewed
    if (originalCards) {
      const allCardIds = new Set(originalCards.map((card) => card.id));
      setViewedCards(allCardIds);
    }
  }, [originalCards]);

  const isLoading = isDeckLoading || isCardsLoading;

  if (isLoading) {
    return (
      <div className="relative flex h-full w-full flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center">
            {/* Header Skeleton */}
            <div className="w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto h-6 w-48 animate-pulse rounded bg-muted" />

              {/* Progress Bar Skeleton */}
              <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4 md:flex-nowrap">
                <div className="h-4 w-full flex-1 animate-pulse rounded-full bg-muted" />
                <div className="h-6 w-16 shrink-0 animate-pulse rounded bg-muted" />
                <div className="flex gap-2">
                  <div className="size-10 animate-pulse rounded-2xl bg-muted" />
                  <div className="size-10 animate-pulse rounded-2xl bg-muted" />
                  <div className="size-10 animate-pulse rounded-2xl bg-muted" />
                </div>
              </div>
            </div>

            {/* Card Skeleton */}
            <div className="flex w-full justify-center px-4">
              <div className="h-[400px] w-full max-w-3xl animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!(cards && deck)) return <div>Deck not found</div>;

  // Show summary when all cards have been viewed
  if (isFinished) {
    return (
      <FlashcardViewSummary
        cards={originalCards || []}
        viewedCards={viewedCards}
        onRestart={handleRestart}
        sessionDuration={sessionDuration}
        deckId={deckId}
        deckSlug={deck?.slug || "view"}
      />
    );
  }

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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10 rounded-2xl"
                      onClick={handleFlipOrder}
                    >
                      <SlidersHorizontal className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Flip Order</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10 rounded-2xl"
                      onClick={handleShuffle}
                    >
                      <Shuffle className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Randomize questions</p>
                  </TooltipContent>
                </Tooltip>
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
                <FlashcardViewer card={currentCard} isFlipped={isFlipped} />
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
              {cards
                .filter(
                  (card): card is FlashcardWithReview => card !== undefined,
                )
                .map((card, i) => (
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
          onFinish={handleFinish}
          onAskAI={() => setIsAIPanelOpen(true)}
        />
      </div>

      {/* AI Explanation Panel */}
      <AIExplanationPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        context={aiExplanationContext}
      />
    </div>
  );
}
