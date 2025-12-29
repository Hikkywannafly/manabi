"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChartColumn,
  CircleCheckBig,
  Loader2,
  Play,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFlashcards } from "../../hooks/use-flashcards";
import { FlashcardService } from "../../services/flashcard-service";

interface FlashcardViewPageProps {
  deckId: string;
}

export function FlashcardViewPage({ deckId }: FlashcardViewPageProps) {
  const { data: deck, isLoading: isDeckLoading } = useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => FlashcardService.getDeck(deckId),
  });

  const { data: cards, isLoading: isCardsLoading } = useFlashcards(deckId);
  const [activeTab, setActiveTab] = useState<"all" | "easy" | "good" | "hard">(
    "all",
  );

  const isLoading = isDeckLoading || isCardsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!cards) return <div>No cards found</div>;

  // Process Stats (Simplified logic)
  // Logic:
  // - status 'review' + high ease -> Easy
  // - status 'review' -> Good
  // - status 'learning' -> Hard
  // - no review -> New (Counted as Hard/Again or separate? HTML doesn't have 'New')
  // We'll group New into 'Hard/Again' or just ignore for stats?
  // Let's group New into 'Hard/Again' for this UI since typically you need to learn them.

  const processedCards = cards.map((c) => {
    const review = c.flashcard_reviews?.[0];
    let rating: "easy" | "good" | "hard" = "hard";

    if (review) {
      if (review.status === "review") {
        if ((review.ease_factor || 2.5) > 2.5) rating = "easy";
        else rating = "good";
      } else {
        rating = "hard";
      }
    } else {
      rating = "hard"; // New cards
    }
    return { ...c, rating };
  });

  const stats = {
    total: cards.length,
    easy: processedCards.filter((c) => c.rating === "easy").length,
    good: processedCards.filter((c) => c.rating === "good").length,
    hard: processedCards.filter((c) => c.rating === "hard").length,
  };

  const filteredCards = processedCards.filter((c) => {
    if (activeTab === "all") return true;
    return c.rating === activeTab;
  });

  return (
    <div className="container mx-auto space-y-8 p-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl">
            {deck?.title || "Flashcard Deck"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {deck?.description || "No description provided."}
          </p>
        </div>
        <Link href={`/dashboard/flashcards/${deckId}/study`}>
          <Button size="lg" className="rounded-2xl">
            <Play className="mr-2 size-4" /> Start Study
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center rounded-lg bg-secondary p-4">
          <ChartColumn className="mb-2 size-8 text-primary" />
          <p className="font-medium text-sm">Total Cards</p>
          <p className="font-bold text-2xl text-primary">{stats.total}</p>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-secondary p-4">
          <CircleCheckBig className="mb-2 size-8 text-blue-500" />
          <p className="font-medium text-sm">Easy Cards</p>
          <p className="font-bold text-2xl text-blue-500">{stats.easy}</p>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-secondary p-4">
          <ThumbsUp className="mb-2 size-8 text-green-500" />
          <p className="font-medium text-sm">Good Cards</p>
          <p className="font-bold text-2xl text-green-500">{stats.good}</p>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-secondary p-4">
          <ThumbsDown className="mb-2 size-8 text-amber-500" />
          <p className="font-medium text-sm">Hard/New Cards</p>
          <p className="font-bold text-2xl text-amber-500">{stats.hard}</p>
        </div>
      </div>

      {/* Cards List */}
      <div className="rounded-lg border border-border p-2 sm:p-4">
        <h2 className="mb-4 font-semibold text-lg">Cards List</h2>
        <div className="w-full">
          {/* Tabs */}
          <div className="mb-4 flex h-auto flex-wrap items-center justify-start space-y-1 rounded-md bg-muted p-1 text-muted-foreground">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              data-state={activeTab === "all" ? "active" : "inactive"}
              className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <BookOpen className="size-4" />
              All ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("easy")}
              data-state={activeTab === "easy" ? "active" : "inactive"}
              className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <CircleCheckBig className="size-4 text-blue-500" />
              Easy ({stats.easy})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("good")}
              data-state={activeTab === "good" ? "active" : "inactive"}
              className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <ThumbsUp className="size-4 text-green-500" />
              Good ({stats.good})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hard")}
              data-state={activeTab === "hard" ? "active" : "inactive"}
              className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <ThumbsDown className="size-4 text-amber-500" />
              Hard/New ({stats.hard})
            </button>
          </div>

          {/* List Content */}
          <div className="space-y-2">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="group overflow-hidden rounded-lg border"
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between bg-secondary/50 px-4 py-4">
                    <div className="flex w-full items-center gap-4">
                      {getIconForRating(card.rating)}
                      <div className="flex-1">
                        <p className="font-medium">{card.front}</p>
                      </div>
                    </div>
                  </div>
                  {/* Always show back or maybe on hover/expand? HTML suggests accordion. I'll just show it statically for now or use details */}
                  <div className="border-t bg-background px-4 py-2 text-muted-foreground text-sm">
                    {card.back}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getIconForRating(rating: string) {
  if (rating === "easy")
    return <CircleCheckBig className="!text-blue-500 size-5 shrink-0" />;
  if (rating === "good")
    return <ThumbsUp className="!text-green-500 size-5 shrink-0" />;
  return <ThumbsDown className="!text-amber-500 size-5 shrink-0" />; // Hard/Again
}
