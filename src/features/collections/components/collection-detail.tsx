"use client";

import { Pen, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollectionDetail } from "../hooks/use-collection-detail";
import { AddItemsDialog } from "./add-items-dialog";
import { CollectionItemCard } from "./collection-item-card";
import { RenameCollectionDialog } from "./rename-collection-dialog";

interface CollectionDetailProps {
  collectionId: string;
}

type SortOption = "newest" | "oldest" | "alphabetical";

export function CollectionDetail({ collectionId }: CollectionDetailProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isAddItemsDialogOpen, setIsAddItemsDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  const {
    data: collection,
    isLoading,
    isError,
  } = useCollectionDetail(collectionId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !collection) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-destructive">
        <p>Failed to load collection. Please try again.</p>
      </div>
    );
  }

  const allItems = [
    ...collection.quizzes.map((q) => ({ ...q, type: "quiz" as const })),
    ...collection.decks.map((d) => ({ ...d, type: "deck" as const })),
  ];

  const sortItems = (items: typeof allItems) => {
    const sorted = [...items];
    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime(),
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime(),
        );
      case "alphabetical":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const filterAndSort = (items: typeof allItems) => {
    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
    return sortItems(filtered);
  };

  const filteredAllItems = filterAndSort(allItems);
  const filteredQuizzes = filterAndSort(
    collection.quizzes.map((q) => ({ ...q, type: "quiz" as const })),
  );
  const filteredDecks = filterAndSort(
    collection.decks.map((d) => ({ ...d, type: "deck" as const })),
  );

  return (
    <>
      <div>
        {/* Actions */}
        <div className="mb-8 flex items-center justify-end">
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <Button
              variant="outline"
              className="h-10 rounded-2xl border border-input px-4 py-2"
              onClick={() => setIsAddItemsDialogOpen(true)}
            >
              <Plus className="mr-2 size-4" />
              Add Items
            </Button>
            <Button
              variant="secondary"
              className="h-9 rounded-2xl px-3"
              onClick={() => setIsRenameDialogOpen(true)}
            >
              <Pen className="mr-2 size-4" />
              Rename
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="mb-4 flex items-center justify-between gap-4">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                <TabsTrigger value="all">
                  All Studies ({allItems.length})
                </TabsTrigger>
                <TabsTrigger value="flashcards">
                  Flashcards ({collection.decks.length})
                </TabsTrigger>
                <TabsTrigger value="quizzes">
                  Quizzes ({collection.quizzes.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Search and Sort */}
            <div className="mb-4 flex items-center gap-4 md:justify-end">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  className="flex-1"
                  placeholder="Search in this tab..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Newest First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* All Studies Tab */}
            <TabsContent value="all" className="mt-2">
              {filteredAllItems.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mt-4 font-semibold text-lg">No items found</h3>
                  <p className="mt-2 mb-4 text-muted-foreground text-sm">
                    {search
                      ? "Try adjusting your search terms."
                      : "Add quizzes or flashcards to this collection."}
                  </p>
                  {!search && (
                    <Button
                      variant="outline"
                      onClick={() => setIsAddItemsDialogOpen(true)}
                    >
                      Add Items
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAllItems.map((item) => (
                    <CollectionItemCard
                      key={`${item.type}-${item.id}`}
                      item={item}
                      collectionId={collectionId}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Flashcards Tab */}
            <TabsContent value="flashcards" className="mt-2">
              {filteredDecks.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mt-4 font-semibold text-lg">
                    No flashcards found
                  </h3>
                  <p className="mt-2 mb-4 text-muted-foreground text-sm">
                    {search
                      ? "Try adjusting your search terms."
                      : "Add flashcard decks to this collection."}
                  </p>
                  {!search && (
                    <Button
                      variant="outline"
                      onClick={() => setIsAddItemsDialogOpen(true)}
                    >
                      Add Flashcards
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDecks.map((item) => (
                    <CollectionItemCard
                      key={`deck-${item.id}`}
                      item={item}
                      collectionId={collectionId}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="mt-2">
              {filteredQuizzes.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mt-4 font-semibold text-lg">
                    No quizzes found
                  </h3>
                  <p className="mt-2 mb-4 text-muted-foreground text-sm">
                    {search
                      ? "Try adjusting your search terms."
                      : "Add quizzes to this collection."}
                  </p>
                  {!search && (
                    <Button
                      variant="outline"
                      onClick={() => setIsAddItemsDialogOpen(true)}
                    >
                      Add Quizzes
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredQuizzes.map((item) => (
                    <CollectionItemCard
                      key={`quiz-${item.id}`}
                      item={item}
                      collectionId={collectionId}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddItemsDialog
        collectionId={collectionId}
        open={isAddItemsDialogOpen}
        onOpenChange={setIsAddItemsDialogOpen}
      />

      <RenameCollectionDialog
        collection={collection}
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
      />
    </>
  );
}
