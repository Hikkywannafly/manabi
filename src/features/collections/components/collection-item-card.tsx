"use client";

import { Lock, Pencil, Play, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRemoveItemFromCollection } from "../hooks/use-remove-item-from-collection";
import type { CollectionDeck, CollectionQuiz } from "../types";

interface CollectionItemCardProps {
  item: (CollectionQuiz | CollectionDeck) & { type: "quiz" | "deck" };
  collectionId: string;
}

export function CollectionItemCard({
  item,
  collectionId,
}: CollectionItemCardProps) {
  const removeItem = useRemoveItemFromCollection();

  const handleRemove = () => {
    removeItem.mutate({
      itemId: item.id,
      itemType: item.type,
    });
  };

  const isQuiz = item.type === "quiz";
  const editUrl = isQuiz
    ? `/dashboard/quiz/${item.id}/edit`
    : `/dashboard/flashcards/${item.id}/edit`;
  const startUrl = isQuiz ? `/quiz/${item.id}` : `/flashcards/${item.id}/study`;

  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString("vi-VN")
    : "";

  const visibilityLabel = item.visibility === "public" ? "Public" : "Private";

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-secondary text-card-foreground shadow-sm">
      <div className="flex grow flex-col justify-between p-4">
        <div>
          <h3 className="mb-1 truncate font-semibold">{item.title}</h3>
          <p className="mb-2 line-clamp-2 text-muted-foreground text-sm">
            {formattedDate} •{" "}
            <span className="inline-flex items-center">
              <Lock className="mr-1 size-3" /> {visibilityLabel}
            </span>
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Link href={editUrl}>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-2xl border border-input px-3"
              >
                <Pencil className="mr-1 size-3" /> Edit
              </Button>
            </Link>
            <Link href={startUrl}>
              <Button size="sm" className="h-9 rounded-2xl px-3">
                <Play className="mr-1 size-3" /> Start
              </Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-2xl px-3 hover:bg-accent hover:text-accent-foreground"
            onClick={handleRemove}
          >
            <Trash className="size-4" />
            <span className="sr-only">Remove Item</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
