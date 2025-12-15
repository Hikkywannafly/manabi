"use client";

import { type Flashcard, FlashcardItem } from "./flashcard-item";

interface FlashcardListProps {
  flashcards: Flashcard[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export function FlashcardList({
  flashcards,
  onView,
  onEdit,
}: FlashcardListProps) {
  if (flashcards.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No flashcards found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {flashcards.map((flashcard) => (
        <FlashcardItem
          key={flashcard.id}
          flashcard={flashcard}
          onView={onView}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
