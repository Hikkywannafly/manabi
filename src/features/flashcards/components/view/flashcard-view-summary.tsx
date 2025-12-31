"use client";

import { BookOpen, Eye, RotateCcw } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 pb-32 sm:px-6 lg:px-8">
      {/* Header */}
      <h2 className="font-semibold text-2xl">Viewing Complete!</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Cards Viewed */}
        <Card className="border-none bg-secondary/50 shadow-none">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm tracking-tight">
              Cards Viewed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="font-bold text-2xl">
              {stats.viewed}/{stats.total}
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="border-none bg-secondary/50 shadow-none">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm tracking-tight">
              Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="font-bold text-2xl text-green-600 dark:text-green-400">
              {stats.completion}%
            </div>
          </CardContent>
        </Card>

        {/* Session Duration */}
        <Card className="border-none bg-secondary/50 shadow-none">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm tracking-tight">
              Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="font-bold text-2xl">
              {formatDuration(sessionDuration)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards List */}
      <div className="rounded-lg border border-border p-2 sm:p-4">
        <h2 className="mb-4 font-semibold text-lg">All Cards</h2>
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
                      <BookOpen className="size-5 shrink-0 text-muted-foreground" />
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
