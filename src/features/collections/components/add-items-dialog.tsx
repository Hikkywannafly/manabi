"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-provider";
import { useAddItemsToCollection } from "../hooks/use-add-items-to-collection";
import { CollectionService } from "../services/collection-service";

interface AddItemsDialogProps {
  collectionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddItemsDialog({
  collectionId,
  open,
  onOpenChange,
}: AddItemsDialogProps) {
  const { user } = useAuth();
  const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>([]);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const addItems = useAddItemsToCollection();

  const { data: availableItems, isLoading } = useQuery({
    queryKey: ["available-items", user?.id, collectionId],
    queryFn: () => CollectionService.getAvailableItems(user!.id, collectionId),
    enabled: !!user && open,
  });

  // Reset selections when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedQuizIds([]);
      setSelectedDeckIds([]);
    }
  }, [open]);

  const handleSubmit = async () => {
    await addItems.mutateAsync({
      collectionId,
      quizIds: selectedQuizIds,
      deckIds: selectedDeckIds,
    });
    onOpenChange(false);
  };

  const toggleQuiz = (quizId: string) => {
    setSelectedQuizIds((prev) =>
      prev.includes(quizId)
        ? prev.filter((id) => id !== quizId)
        : [...prev, quizId],
    );
  };

  const toggleDeck = (deckId: string) => {
    setSelectedDeckIds((prev) =>
      prev.includes(deckId)
        ? prev.filter((id) => id !== deckId)
        : [...prev, deckId],
    );
  };

  const hasSelection = selectedQuizIds.length > 0 || selectedDeckIds.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Items to Collection</DialogTitle>
          <DialogDescription>
            Select quizzes and flashcard decks to add to this collection.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="quizzes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quizzes">
              Quizzes ({availableItems?.quizzes.length || 0})
            </TabsTrigger>
            <TabsTrigger value="flashcards">
              Flashcards ({availableItems?.decks.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="quizzes"
            className="max-h-[400px] overflow-y-auto"
          >
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded bg-muted"
                  />
                ))}
              </div>
            ) : availableItems?.quizzes.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                <p className="text-muted-foreground text-sm">
                  No available quizzes to add.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableItems?.quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent"
                  >
                    <Checkbox
                      id={`quiz-${quiz.id}`}
                      checked={selectedQuizIds.includes(quiz.id)}
                      onCheckedChange={() => toggleQuiz(quiz.id)}
                    />
                    <label
                      htmlFor={`quiz-${quiz.id}`}
                      className="flex-1 cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {quiz.title}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="flashcards"
            className="max-h-[400px] overflow-y-auto"
          >
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded bg-muted"
                  />
                ))}
              </div>
            ) : availableItems?.decks.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                <p className="text-muted-foreground text-sm">
                  No available flashcard decks to add.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableItems?.decks.map((deck) => (
                  <div
                    key={deck.id}
                    className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent"
                  >
                    <Checkbox
                      id={`deck-${deck.id}`}
                      checked={selectedDeckIds.includes(deck.id)}
                      onCheckedChange={() => toggleDeck(deck.id)}
                    />
                    <label
                      htmlFor={`deck-${deck.id}`}
                      className="flex-1 cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {deck.title}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!hasSelection || addItems.isPending}
          >
            {addItems.isPending ? "Adding..." : "Add Selected"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
