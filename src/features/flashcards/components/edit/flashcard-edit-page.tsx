"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDeck } from "@/features/flashcards/actions";
import type {
  GeneratedFlashcard,
  QuestionFlashcard,
  VocabularyFlashcard,
} from "@/features/flashcards/stores/use-flashcard-store";
import { useFlashcardStore } from "@/features/flashcards/stores/use-flashcard-store";
import { FlashcardListEditor } from "./flashcard-list-editor";

// Type guard functions
function isVocabularyFlashcard(
  flashcard: GeneratedFlashcard,
): flashcard is VocabularyFlashcard {
  return "vocabulary" in flashcard && "meaning" in flashcard;
}

export function FlashcardEditPage() {
  const router = useRouter();
  const {
    generatedFlashcards,
    deckTitle,
    deckDescription,
    metadata,
    updateFlashcardMetadata,
    addFlashcard: addFlashcardToStore,
    addFlashcardAfter: addFlashcardAfterToStore,
    updateFlashcard: updateFlashcardInStore,
    deleteFlashcard: deleteFlashcardFromStore,
    moveFlashcard: moveFlashcardInStore,
    clearFlashcards,
  } = useFlashcardStore();

  const [isSaving, setIsSaving] = useState(false);

  // Redirect if no flashcards
  useEffect(() => {
    if (generatedFlashcards.length === 0) {
      router.push("/dashboard/flashcards/create");
    }
  }, [generatedFlashcards.length, router]);

  const addFlashcard = () => {
    // Determine flashcard type from existing flashcards or metadata
    let flashcardType: "VOCABULARY" | "QUESTIONS" = "QUESTIONS";

    if (metadata?.flashcardType) {
      flashcardType = metadata.flashcardType;
    } else if (generatedFlashcards.length > 0) {
      // Detect type from existing flashcards
      const hasVocabularyFields = generatedFlashcards.some((card) =>
        isVocabularyFlashcard(card),
      );
      flashcardType = hasVocabularyFields ? "VOCABULARY" : "QUESTIONS";
    }

    const newFlashcard: GeneratedFlashcard =
      flashcardType === "VOCABULARY"
        ? {
            id: `fc-${Date.now()}`,
            vocabulary: "Enter vocabulary word/phrase here",
            meaning: "Enter meaning here",
            example: "Enter example sentence here",
            explanation: "Enter additional explanation here",
          }
        : {
            id: `fc-${Date.now()}`,
            question: "Enter your flashcard question here",
            choices: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            explanation: "",
          };

    addFlashcardToStore(newFlashcard);
  };

  const addFlashcardAfter = (afterIndex: number) => {
    // Determine flashcard type from existing flashcards or metadata
    let flashcardType: "VOCABULARY" | "QUESTIONS" = "QUESTIONS";

    if (metadata?.flashcardType) {
      flashcardType = metadata.flashcardType;
    } else if (generatedFlashcards.length > 0) {
      // Detect type from existing flashcards
      const hasVocabularyFields = generatedFlashcards.some((card) =>
        isVocabularyFlashcard(card),
      );
      flashcardType = hasVocabularyFields ? "VOCABULARY" : "QUESTIONS";
    }

    const newFlashcard: GeneratedFlashcard =
      flashcardType === "VOCABULARY"
        ? {
            id: `fc-${Date.now()}`,
            vocabulary: "Enter vocabulary word/phrase here",
            meaning: "Enter meaning here",
            example: "Enter example sentence here",
            explanation: "Enter additional explanation here",
          }
        : {
            id: `fc-${Date.now()}`,
            question: "Enter your flashcard question here",
            choices: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            explanation: "",
          };

    addFlashcardAfterToStore(afterIndex, newFlashcard);
  };

  const updateFlashcard = (
    _index: number,
    updatedFlashcard: GeneratedFlashcard,
  ) => {
    updateFlashcardInStore(updatedFlashcard.id, updatedFlashcard);
  };

  const deleteFlashcard = (index: number) => {
    const flashcard = generatedFlashcards[index];
    if (flashcard) {
      deleteFlashcardFromStore(flashcard.id);
    }
  };

  const moveFlashcard = (fromIndex: number, toIndex: number) => {
    moveFlashcardInStore(fromIndex, toIndex);
  };

  const handleSave = async () => {
    if (!deckTitle.trim()) {
      toast.error("Please enter a title for your deck");
      return;
    }

    if (generatedFlashcards.length === 0) {
      toast.error("Please add at least one flashcard");
      return;
    }

    setIsSaving(true);

    try {
      const result = await createDeck({
        title: deckTitle,
        description: deckDescription,
        flashcards: generatedFlashcards.map((fc) => {
          if (isVocabularyFlashcard(fc)) {
            // Vocabulary flashcard - transform to FlashcardData format
            return {
              question: fc.vocabulary,
              answer: fc.meaning,
              explanation: `Example: ${fc.example}\n\n${fc.explanation}`,
            };
          } else {
            // Question flashcard
            const questionFc = fc as QuestionFlashcard;
            return {
              question: questionFc.question,
              answer: questionFc.choices[questionFc.correctAnswer],
              options: questionFc.choices,
              correctAnswer: questionFc.correctAnswer,
              explanation: questionFc.explanation,
            };
          }
        }),
        isPublic: false,
      });

      if (result.success) {
        toast.success("Deck created successfully!");
        clearFlashcards();
        router.push(`/dashboard/flashcards/${result.deckId}`);
      } else {
        toast.error(result.error || "Failed to create deck");
      }
    } catch (error) {
      console.error("Error saving deck:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (generatedFlashcards.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
      {/* Save Button - Positioned in top right */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Deck
            </>
          )}
        </Button>
      </div>

      {/* Title and Description */}
      <div className="space-y-4">
        <Card className="border-none">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Deck Title</Label>
                <Input
                  id="title"
                  value={deckTitle}
                  onChange={(e) =>
                    updateFlashcardMetadata({ title: e.target.value })
                  }
                  placeholder="Enter deck title..."
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={deckDescription}
                  onChange={(e) =>
                    updateFlashcardMetadata({ description: e.target.value })
                  }
                  placeholder="Enter deck description..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flashcards List */}
      <FlashcardListEditor
        flashcards={generatedFlashcards}
        onUpdateFlashcard={updateFlashcard}
        onDeleteFlashcard={deleteFlashcard}
        onMoveFlashcard={moveFlashcard}
        onAddFlashcard={addFlashcard}
        onAddFlashcardAfter={addFlashcardAfter}
      />
    </div>
  );
}
