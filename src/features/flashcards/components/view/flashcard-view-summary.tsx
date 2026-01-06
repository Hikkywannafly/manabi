"use client";

import { BookOpen, ChartColumn, Eye, RotateCcw, Timer } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { FlashcardWithReview } from "../../types";

interface FlashcardViewSummaryProps {
  cards: FlashcardWithReview[];
  viewedCards: Set<string>;
  onRestart: () => void;
  sessionDuration: number;
  deckId: string;
  deckSlug: string;
}

export function FlashcardViewSummary({
  cards,
  viewedCards,
  onRestart,
  sessionDuration,
  deckId,
  deckSlug,
}: FlashcardViewSummaryProps) {
  // Calculate Stats
  const stats = {
    total: cards.length,
    viewed: viewedCards.size,
    completion: Math.round((viewedCards.size / cards.length) * 100),
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getCompletionColor = (pct: number) => {
    if (pct >= 80) return "text-green-500 bg-green-100 dark:bg-green-900/50";
    if (pct >= 50) return "text-blue-500 bg-blue-100 dark:bg-blue-900/50";
    return "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50";
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 pb-32 sm:px-6 lg:px-8">
      {/* Header */}
      <h2 className="font-semibold text-2xl">Viewing Complete!</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Completion Rate */}
        <div
          className={cn(
            "flex flex-col items-center rounded-lg p-4",
            getCompletionColor(stats.completion),
          )}
        >
          <ChartColumn className="mb-2 size-8" />
          <p className="font-medium text-sm">Completion</p>
          <p className="font-bold text-2xl">{stats.completion}%</p>
        </div>

        {/* Cards Viewed */}
        <div className="flex flex-col items-center rounded-lg bg-secondary p-4">
          <BookOpen className="mb-2 size-8 text-blue-500" />
          <p className="font-medium text-sm">Cards Viewed</p>
          <p className="font-bold text-2xl text-blue-500">
            {stats.viewed}/{stats.total}
          </p>
        </div>

        {/* Time Spent */}
        <div className="flex flex-col items-center rounded-lg bg-secondary p-4">
          <Timer className="mb-2 size-8 text-amber-500" />
          <p className="font-medium text-sm">Time Spent</p>
          <p className="font-bold text-2xl text-amber-500">
            {formatDuration(sessionDuration)}
          </p>
        </div>
      </div>

      {/* Cards List */}
      <div className="rounded-lg border border-border p-2 sm:p-4">
        <h2 className="mb-4 font-semibold text-lg">Review Cards</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap items-center justify-start space-y-1 bg-muted p-1">
            <TabsTrigger
              value="all"
              className="flex flex-1 items-center justify-center gap-2 text-sm"
            >
              <BookOpen className="size-4" />
              <span className="whitespace-nowrap">All ({stats.total})</span>
            </TabsTrigger>
            <TabsTrigger
              value="viewed"
              className="flex flex-1 items-center justify-center gap-2 text-sm"
            >
              <Eye className="size-4 text-green-500" />
              <span className="whitespace-nowrap">Viewed ({stats.viewed})</span>
            </TabsTrigger>
            <TabsTrigger
              value="not-viewed"
              className="flex flex-1 items-center justify-center gap-2 text-sm"
            >
              <RotateCcw className="size-4 text-muted-foreground" />
              <span className="whitespace-nowrap">
                Left ({stats.total - stats.viewed})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <CardList cards={cards} viewedCards={viewedCards} />
          </TabsContent>
          <TabsContent value="viewed" className="mt-4">
            <CardList
              cards={cards.filter((c) => viewedCards.has(c.id))}
              viewedCards={viewedCards}
            />
          </TabsContent>
          <TabsContent value="not-viewed" className="mt-4">
            <CardList
              cards={cards.filter((c) => !viewedCards.has(c.id))}
              viewedCards={viewedCards}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/dashboard/flashcards">
          <Button variant="outline" className="h-10 rounded-2xl px-6 py-2">
            Back to Decks
          </Button>
        </Link>
        <Link href={`/dashboard/flashcards/${deckId}/${deckSlug}`}>
          <Button variant="outline" className="h-10 rounded-2xl px-6 py-2">
            View Deck
          </Button>
        </Link>
        <Button
          onClick={onRestart}
          className="h-10 rounded-2xl px-6 py-2"
          size="lg"
        >
          <RotateCcw className="mr-2 size-4" />
          View Again
        </Button>
      </div>
    </div>
  );
}

function CardList({
  cards,
  viewedCards,
}: {
  cards: FlashcardWithReview[];
  viewedCards: Set<string>;
}) {
  if (cards.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No cards to display.
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="space-y-2">
      {cards.map((card) => {
        const wasViewed = viewedCards.has(card.id);
        return (
          <AccordionItem
            key={card.id}
            value={card.id}
            className="overflow-hidden rounded-lg border"
          >
            <AccordionTrigger className="bg-secondary/50 px-4 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
              <div className="flex w-full items-center gap-4 text-left">
                {wasViewed ? (
                  <Eye className="size-5 shrink-0 text-green-500" />
                ) : (
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {card.front}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-background px-4 pt-4 pb-6">
              <div className="space-y-4">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="mb-1 font-semibold text-muted-foreground text-sm">
                    Front
                  </p>
                  <p className="text-foreground">{card.front}</p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="mb-1 font-semibold text-muted-foreground text-sm">
                    Back
                  </p>
                  <p className="text-foreground">{card.back}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
