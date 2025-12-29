"use client";

import {
  BookOpen,
  ChartColumn,
  CircleCheck,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FlashcardWithReview } from "../../types";

interface FlashcardSummaryProps {
  cards: FlashcardWithReview[];
  history: Record<string, "again" | "hard" | "good" | "easy">;
  onRestart: () => void;
}

export function FlashcardSummary({
  cards,
  history,
  onRestart,
}: FlashcardSummaryProps) {
  // Calculate Stats
  const stats = {
    total: Object.keys(history).length,
    easy: 0,
    good: 0,
    hard: 0, // Hard + Again
  };

  Object.values(history).forEach((r) => {
    if (r === "easy") stats.easy++;
    else if (r === "good") stats.good++;
    else stats.hard++;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 pt-8 pb-32">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="mb-2 font-bold text-2xl">Session Complete!</h1>
        <p className="text-muted-foreground">
          Great job studying your flashcards.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="flex flex-col items-center rounded-lg bg-secondary p-4">
          <ChartColumn className="mb-2 size-8 text-primary" />
          <p className="font-medium text-sm">Cards Reviewed</p>
          <p className="font-bold text-2xl text-primary">
            {stats.total}/{cards.length}
          </p>
        </div>
        {/* Easy */}
        <div className="flex flex-col items-center rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <CircleCheck className="mb-2 size-8 text-green-500" />
          <p className="font-medium text-sm">Easy</p>
          <p className="font-bold text-2xl text-green-500">{stats.easy}</p>
        </div>
        {/* Good */}
        <div className="flex flex-col items-center rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <ThumbsUp className="mb-2 size-8 text-blue-500" />
          <p className="font-medium text-sm">Good</p>
          <p className="font-bold text-2xl text-blue-500">{stats.good}</p>
        </div>
        {/* Hard */}
        <div className="flex flex-col items-center rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
          <ThumbsDown className="mb-2 size-8 text-amber-500" />
          <p className="font-medium text-sm">Hard/Again</p>
          <p className="font-bold text-2xl text-amber-500">{stats.hard}</p>
        </div>
      </div>

      {/* Cards List */}
      <div className="rounded-lg border border-border p-2 sm:p-4">
        <h2 className="mb-4 font-semibold text-lg">Review Cards</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 flex h-auto w-full flex-wrap items-center justify-start space-y-1 bg-muted p-1">
            <TabsTrigger
              value="all"
              className="flex flex-1 items-center justify-center gap-2 text-sm"
            >
              <BookOpen className="size-4" />
              <span className="whitespace-nowrap">All ({stats.total})</span>
            </TabsTrigger>
            <TabsTrigger
              value="easy"
              className="flex flex-1 items-center justify-center gap-2 text-sm"
            >
              <CircleCheck className="size-4 text-green-500" />
              <span className="whitespace-nowrap">Easy ({stats.easy})</span>
            </TabsTrigger>
            <TabsTrigger
              value="good"
              className="flex flex-1 items-center justify-center gap-2 text-sm"
            >
              <ThumbsUp className="size-4 text-blue-500" />
              <span className="whitespace-nowrap">Good ({stats.good})</span>
            </TabsTrigger>
            <TabsTrigger
              value="hard"
              className="flex flex-1 items-center justify-center gap-2 text-sm"
            >
              <ThumbsDown className="size-4 text-amber-500" />
              <span className="whitespace-nowrap">Hard ({stats.hard})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <CardReviewList cards={cards} history={history} filter="all" />
          </TabsContent>
          <TabsContent value="easy">
            <CardReviewList cards={cards} history={history} filter="easy" />
          </TabsContent>
          <TabsContent value="good">
            <CardReviewList cards={cards} history={history} filter="good" />
          </TabsContent>
          <TabsContent value="hard">
            <CardReviewList cards={cards} history={history} filter="hard" />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-center pb-8">
        <Button
          onClick={onRestart}
          className="h-10 rounded-2xl px-6 py-2"
          size="lg"
        >
          <RotateCcw className="mr-2 size-4" />
          Studying Again
        </Button>
      </div>
    </div>
  );
}

function CardReviewList({
  cards,
  history,
  filter,
}: {
  cards: FlashcardWithReview[];
  history: Record<string, string>;
  filter: "all" | "easy" | "good" | "hard";
}) {
  const filteredCards = cards.filter((card) => {
    const rating = history[card.id];
    if (!rating) return false;
    if (filter === "all") return true;
    if (filter === "easy") return rating === "easy";
    if (filter === "good") return rating === "good";
    if (filter === "hard") return rating === "hard" || rating === "again";
    return false;
  });

  if (filteredCards.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No cards in this category.
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="space-y-2">
      {filteredCards.map((card) => {
        const rating = history[card.id] as "easy" | "good" | "hard" | "again";
        return (
          <AccordionItem
            key={card.id}
            value={card.id}
            className="overflow-hidden rounded-lg border"
          >
            <AccordionTrigger className="bg-secondary/50 px-4 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
              <div className="flex w-full items-center gap-4 text-left">
                {getIconForRating(rating)}
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

function getIconForRating(rating: string) {
  if (rating === "easy")
    return <CircleCheck className="size-5 shrink-0 text-green-500" />;
  if (rating === "good")
    return <ThumbsUp className="size-5 shrink-0 text-blue-500" />;
  // hard or again
  return <ThumbsDown className="size-5 shrink-0 text-amber-500" />;
}
