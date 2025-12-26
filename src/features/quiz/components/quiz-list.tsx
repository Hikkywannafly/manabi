"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuizzes } from "../hooks/use-quizzes";
import { QuizCard } from "./quiz-card";

export function QuizList() {
  const [search, setSearch] = useState("");

  const { data: quizzes = [], isLoading, isError } = useQuizzes();

  const filteredQuizzes = quizzes.filter((q) =>
    q.title?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isError) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-destructive">
        <p>Failed to load quizzes. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">Quizzes</h1>
        <Link href="/dashboard/quiz/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Quiz
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search quizzes..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="fade-in-50 flex min-h-[300px] animate-in flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 font-semibold text-lg">No quizzes found</h3>
          <p className="mt-2 mb-4 text-muted-foreground text-sm">
            {search
              ? "Try adjusting your search terms."
              : "You haven't created any quizzes yet."}
          </p>
          {!search && (
            <Link href="/dashboard/quiz/create">
              <Button variant="outline">Create your first quiz</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
