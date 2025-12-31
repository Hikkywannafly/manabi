"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Deck } from "../types";

interface DeckCardProps {
  deck: Deck;
}

export function DeckCard({ deck }: DeckCardProps) {
  return (
    <div className="rounded-lg bg-secondary p-4 shadow-md transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <h3 className="line-clamp-1 font-semibold text-lg" title={deck.title}>
          {deck.title}
        </h3>
      </div>
      <div className="mt-1 text-muted-foreground text-sm">
        {/* Placeholder for card count until we have it - maybe "Deck" or type */}
        <span>Flashcard Deck</span> •{" "}
        {deck.created_at
          ? formatDistanceToNow(new Date(deck.created_at), { addSuffix: true })
          : "Recently"}
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <Link href={`/dashboard/flashcards/${deck.id}/edit`}>
          <Button
            variant="ghost"
            className="h-9 rounded-2xl bg-tertiary px-3 text-tertiary-foreground hover:bg-tertiary/80"
          >
            Edit
          </Button>
        </Link>
        <Link href={`/dashboard/flashcards/${deck.id}/${deck.slug || "view"}`}>
          <Button className="h-9 rounded-2xl px-3">
            Open
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
