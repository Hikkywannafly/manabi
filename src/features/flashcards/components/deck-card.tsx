"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Loader2, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FlashcardService } from "../services/flashcard-service";
import type { Deck } from "../types";

interface DeckCardProps {
  deck: Deck;
}

export function DeckCard({ deck }: DeckCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteDeck, isPending: isDeleting } = useMutation({
    mutationFn: () => FlashcardService.deleteDeck(deck.id),
    onSuccess: () => {
      toast.success("Deck deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      setIsDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete deck",
      );
    },
  });

  return (
    <div className="group relative rounded-lg bg-secondary p-4 shadow-md transition-all hover:shadow-lg">
      {/* More Options Button - appears on hover */}
      <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-start justify-between">
        <h3 className="line-clamp-1 font-semibold text-lg" title={deck.title}>
          {deck.title}
        </h3>
      </div>
      <div className="mt-1 text-muted-foreground text-sm">
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deck?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deck.title}" and all its
              flashcards. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDeck()}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
