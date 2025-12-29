"use client";

import { BookOpenCheck, Folder, Layers, Zap } from "lucide-react";
import Link from "next/link";

interface StatsGridProps {
  quizzesCount: number;
  flashcardsCount: number;
  collectionsCount: number;
  streak: number;
}

export function StatsGrid({
  quizzesCount,
  flashcardsCount,
  collectionsCount,
  streak,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Quizzes */}
      <div className="rounded-lg border bg-secondary p-4 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-medium text-muted-foreground text-sm">Quizzes</p>
            <p className="font-bold text-3xl text-foreground tracking-tight">
              {quizzesCount}
            </p>
            <p className="text-muted-foreground text-xs">Created quizzes</p>
          </div>
          <div className="rounded-md bg-primary/10 p-2">
            <BookOpenCheck className="size-5 text-primary" />
          </div>
        </div>
        <Link
          className="font-medium text-primary text-sm hover:underline"
          href="/dashboard/quiz/create"
        >
          Create Quiz
        </Link>
      </div>

      {/* Flashcards */}
      <div className="rounded-lg border bg-secondary p-4 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-medium text-muted-foreground text-sm">
              Flashcards
            </p>
            <p className="font-bold text-3xl text-foreground tracking-tight">
              {flashcardsCount}
            </p>
            <p className="text-muted-foreground text-xs">Flashcard sets</p>
          </div>
          <div className="rounded-md bg-primary/10 p-2">
            <Layers className="size-5 text-primary" />
          </div>
        </div>
        <Link
          className="font-medium text-primary text-sm hover:underline"
          href="/dashboard/flashcards/create"
        >
          Create Flashcards
        </Link>
      </div>

      {/* Collections */}
      <div className="rounded-lg border bg-secondary p-4 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-medium text-muted-foreground text-sm">
              Collections
            </p>
            <p className="font-bold text-3xl text-foreground tracking-tight">
              {collectionsCount}
            </p>
            <p className="text-muted-foreground text-xs">Active collections</p>
          </div>
          <div className="rounded-md bg-primary/10 p-2">
            <Folder className="size-5 text-primary" />
          </div>
        </div>
        <Link
          className="font-medium text-primary text-sm hover:underline"
          href="/dashboard/collections/new"
        >
          Create Collection
        </Link>
      </div>

      {/* Study Streak */}
      <div className="rounded-lg border bg-secondary p-4 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-medium text-muted-foreground text-sm">
              Study Streak
            </p>
            <p className="font-bold text-3xl text-foreground tracking-tight">
              {streak}
            </p>
            <p className="text-muted-foreground text-xs">days</p>
          </div>
          <div className="rounded-md bg-primary/10 p-2">
            <Zap className="size-5 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">
            Longest: {streak} days
          </p>
          {/* Mock percentile for now */}
          <p className="font-semibold text-green-600 text-xs dark:text-green-400">
            Ahead of 98% of students
          </p>
        </div>
      </div>
    </div>
  );
}
