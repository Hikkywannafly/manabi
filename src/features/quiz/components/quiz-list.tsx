"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useQuizzes } from "../hooks/use-quizzes";
import { QuizCard } from "./quiz-card";

const ITEMS_PER_PAGE = 9;

export function QuizList() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: quizzes = [], isLoading, isError } = useQuizzes();

  const filteredQuizzes = quizzes.filter((q) =>
    q.title?.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE);
  const currentItems = filteredQuizzes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const Pagination = () => {
    // Always show pagination even if single page
    const effectiveTotalPages = Math.max(1, totalPages);

    return (
      <nav
        aria-label="pagination"
        className="mx-auto mt-6 flex w-full justify-center"
      >
        <ul className="flex flex-row items-center gap-1">
          <li>
            <Button
              variant="ghost"
              className={cn(
                "h-10 gap-1 rounded-2xl px-4 py-2 pl-2.5 font-medium transition hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50",
                currentPage === 1 && "pointer-events-none opacity-50",
              )}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="size-4" />
              <span>Previous</span>
            </Button>
          </li>

          {Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map(
            (page) => {
              if (
                page === 1 ||
                page === effectiveTotalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <li key={page}>
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      className={cn(
                        "size-10 cursor-pointer rounded-md border font-medium text-sm transition hover:bg-accent hover:text-accent-foreground",
                        currentPage === page &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                      )}
                      onClick={() => handlePageChange(page)}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  </li>
                );
              }
              if (
                (page === 2 && currentPage > 3) ||
                (page === effectiveTotalPages - 1 &&
                  currentPage < effectiveTotalPages - 2)
              ) {
                return (
                  <li key={`ellipsis-${page}`}>
                    <span className="flex size-10 items-center justify-center text-muted-foreground">
                      ...
                    </span>
                  </li>
                );
              }
              return null;
            },
          )}

          <li>
            <Button
              variant="ghost"
              className={cn(
                "h-10 gap-1 rounded-2xl px-4 py-2 pr-2.5 font-medium transition hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50",
                currentPage === effectiveTotalPages &&
                  "pointer-events-none opacity-50",
              )}
              onClick={() =>
                handlePageChange(Math.min(effectiveTotalPages, currentPage + 1))
              }
              disabled={currentPage === effectiveTotalPages}
              aria-label="Go to next page"
            >
              <span>Next</span>
              <ChevronRight className="size-4" />
            </Button>
          </li>
        </ul>
      </nav>
    );
  };

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

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search quizzes..."
            className="bg-secondary pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="w-[180px] justify-between rounded-md bg-secondary"
          >
            Most Recent
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
          <div className="flex gap-1">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-2xl"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl hover:bg-accent"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
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
        <div className="space-y-6">
          <Pagination />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
