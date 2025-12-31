"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-provider";
import { useAddItemsToCollection } from "../hooks/use-add-items-to-collection";
import { useCreateCollection } from "../hooks/use-create-collection";
import { CollectionService } from "../services/collection-service";

export function CreateCollectionForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [collectionName, setCollectionName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>([]);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);

  const createCollection = useCreateCollection();
  const addItems = useAddItemsToCollection();

  // Fetch available items
  const { data: availableItems, isLoading } = useQuery({
    queryKey: ["available-items", user?.id],
    queryFn: () => CollectionService.getAvailableItems(user?.id || ""),
    enabled: !!user,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!collectionName.trim()) {
      toast.error("Please enter a collection name");
      return;
    }

    try {
      // Create collection
      const collection = await createCollection.mutateAsync({
        name: collectionName,
        isPublic: false,
      });

      // Add selected items if any
      if (selectedQuizIds.length > 0 || selectedDeckIds.length > 0) {
        await addItems.mutateAsync({
          collectionId: collection.id,
          quizIds: selectedQuizIds,
          deckIds: selectedDeckIds,
        });
      }

      // Navigate to collection detail page
      router.push(`/dashboard/collections/${collection.id}`);
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/collections");
  };

  const totalSelected = selectedQuizIds.length + selectedDeckIds.length;

  // Filter items based on search
  const filteredQuizzes =
    availableItems?.quizzes.filter((quiz) =>
      quiz.title.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const filteredDecks =
    availableItems?.decks.filter((deck) =>
      deck.title.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Collection Name */}
        <div className="grid gap-2">
          <Label htmlFor="name" className="font-semibold text-base">
            Collection Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter collection name..."
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Select Studies */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="search-materials"
              className="font-semibold text-base"
            >
              Select Studies
            </Label>
            <span className="text-muted-foreground text-sm">
              {totalSelected} Selected
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-2.5 size-4 text-muted-foreground" />
            <Input
              id="search-materials"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-8 pl-9"
            />
          </div>
        </div>

        {/* Accordion for Quizzes and Flashcards */}
        <div className="mt-4 space-y-4">
          <Accordion
            type="multiple"
            defaultValue={["quizzes", "flashcards"]}
            className="w-full"
          >
            {/* Quizzes */}
            <AccordionItem value="quizzes">
              <AccordionTrigger className="font-medium text-sm hover:no-underline">
                Quizzes ({filteredQuizzes.length})
              </AccordionTrigger>
              <AccordionContent>
                {isLoading ? (
                  <div className="space-y-2 pt-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 animate-pulse rounded bg-muted"
                      />
                    ))}
                  </div>
                ) : filteredQuizzes.length === 0 ? (
                  <div className="py-4 text-center text-muted-foreground text-sm">
                    No quizzes found
                  </div>
                ) : (
                  <div className="grid gap-2 pt-2">
                    {filteredQuizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="flex items-center space-x-3 rounded-md p-2 hover:bg-accent"
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
                          <div className="prose prose-sm !prose-sm md:prose-lg md:!prose-sm prose-p:m-0 max-w-none">
                            <p>{quiz.title}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Flashcard Sets */}
            <AccordionItem value="flashcards">
              <AccordionTrigger className="font-medium text-sm hover:no-underline">
                Flashcard Sets ({filteredDecks.length})
              </AccordionTrigger>
              <AccordionContent>
                {isLoading ? (
                  <div className="space-y-2 pt-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 animate-pulse rounded bg-muted"
                      />
                    ))}
                  </div>
                ) : filteredDecks.length === 0 ? (
                  <div className="py-4 text-center text-muted-foreground text-sm">
                    No flashcard sets found
                  </div>
                ) : (
                  <div className="grid gap-2 pt-2">
                    {filteredDecks.map((deck) => (
                      <div
                        key={deck.id}
                        className="flex items-center space-x-3 rounded-md p-2 hover:bg-accent"
                      >
                        <Checkbox
                          id={`set-${deck.id}`}
                          checked={selectedDeckIds.includes(deck.id)}
                          onCheckedChange={() => toggleDeck(deck.id)}
                        />
                        <label
                          htmlFor={`set-${deck.id}`}
                          className="flex-1 cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <div className="prose prose-sm !prose-sm md:prose-lg md:!prose-sm prose-p:m-0 max-w-none">
                            <p>{deck.title}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            className="h-10 rounded-2xl px-4 py-2"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-10 rounded-2xl px-4 py-2"
            disabled={createCollection.isPending || addItems.isPending}
          >
            {createCollection.isPending || addItems.isPending
              ? "Creating..."
              : "Create Collection"}
          </Button>
        </div>
      </form>
    </div>
  );
}
