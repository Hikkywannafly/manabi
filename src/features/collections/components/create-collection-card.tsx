"use client";

import { FolderPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CreateCollectionCard() {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg border border-border border-dashed bg-card p-6 text-center text-card-foreground shadow-sm transition-colors hover:border-primary">
      <div className="mb-4 rounded-lg bg-muted p-3">
        <FolderPlus className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 font-semibold text-lg tracking-tight">
        Create Collection
      </h3>
      <p className="mb-4 text-muted-foreground text-sm">
        Group related quizzes and flashcards together
      </p>
      <Link href="/dashboard/collections/new" className="w-full">
        <Button className="h-11 w-full rounded-2xl px-8">
          Create Collection
        </Button>
      </Link>
    </div>
  );
}
