"use client";

import type { Deck } from "../types";
import { DeckCard } from "./deck-card";

interface DeckListProps {
  decks: Deck[];
  viewMode: "grid" | "list";
}

export function DeckList({ decks, viewMode }: DeckListProps) {
  if (decks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No flashcard decks found.</p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 ${
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      }`}
    >
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} />
      ))}
    </div>
  );
}
