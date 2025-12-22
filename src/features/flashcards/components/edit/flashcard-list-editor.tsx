"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GeneratedFlashcard } from "@/features/flashcards/stores/use-flashcard-store";
import { FlashcardCardEditor } from "./flashcard-card-editor";

interface FlashcardListEditorProps {
  flashcards: GeneratedFlashcard[];
  onUpdateFlashcard: (index: number, flashcard: GeneratedFlashcard) => void;
  onDeleteFlashcard: (index: number) => void;
  onMoveFlashcard: (fromIndex: number, toIndex: number) => void;
  onAddFlashcard: () => void;
  onAddFlashcardAfter?: (afterIndex: number) => void;
}

export function FlashcardListEditor({
  flashcards,
  onUpdateFlashcard,
  onDeleteFlashcard,
  onMoveFlashcard,
  onAddFlashcard,
  onAddFlashcardAfter,
}: FlashcardListEditorProps) {
  return (
    <Card className="border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Flashcards ({flashcards.length})</CardTitle>
          <Button onClick={onAddFlashcard} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Flashcard
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {flashcards.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No flashcards yet. Click "Add Flashcard" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          flashcards.map((flashcard, index) => (
            <FlashcardCardEditor
              key={flashcard.id}
              flashcard={flashcard}
              flashcardIndex={index}
              onUpdate={(updatedFlashcard) =>
                onUpdateFlashcard(index, updatedFlashcard)
              }
              onDelete={() => onDeleteFlashcard(index)}
              onMoveUp={() => onMoveFlashcard(index, index - 1)}
              onMoveDown={() => onMoveFlashcard(index, index + 1)}
              onAddFlashcard={onAddFlashcardAfter}
              canMoveUp={index > 0}
              canMoveDown={index < flashcards.length - 1}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
