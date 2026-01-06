"use client";

import { formatDistanceToNow } from "date-fns";
import {
  BookText,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  SquareStack,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
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
import { cn } from "@/lib/utils";

interface ExploreViewProps {
  quizzes: any[]; // Using any temporarily to avoid complex type issues, but should be QuizWithQuestions with profiles & questions count
  decks: any[]; // PublicDeck
}

const ITEMS_PER_PAGE = 9;

export function ExploreView({ quizzes, decks }: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [activeTab, setActiveTab] = useState("quizzes");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and Sort
  const filteredData = useMemo(() => {
    let data = activeTab === "quizzes" ? [...quizzes] : [...decks];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.profiles?.full_name?.toLowerCase().includes(lowerQuery) ||
          item.profiles?.nickname?.toLowerCase().includes(lowerQuery),
      );
    }

    if (sortOrder === "newest") {
      data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else {
      data.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    }

    return data;
  }, [quizzes, decks, searchQuery, sortOrder, activeTab]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentItems = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Pagination = () => {
    if (totalPages < 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="text-muted-foreground"
        >
          <ChevronLeft className="mr-1 size-4" />
          Previous
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Simple pagination logic: show all for now? Or implement better ellipsis later?
          // The image shows 1, 2, 3, 4 ... 46
          // For now, let's just show max 5 pages dynamically to avoid clutter
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "min-w-[32px]",
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground",
                )}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            );
          }
          if (
            (page === 2 && currentPage > 3) ||
            (page === totalPages - 1 && currentPage < totalPages - 2)
          ) {
            return (
              <span key={`ellipsis-${page}`} className="text-muted-foreground">
                ...
              </span>
            );
          }
          return null;
        })}

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          className="text-muted-foreground"
        >
          Next
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>
    );
  };

  return (
    <div>
      <div className="space-y-6">
        <Tabs
          defaultValue="quizzes"
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            setCurrentPage(1);
          }}
          className="space-y-6"
        >
          <div className="w-full rounded-lg bg-secondary/50 p-1">
            <TabsList className="w-full justify-start bg-transparent p-0">
              <TabsTrigger
                value="quizzes"
                className="flex-1 py-2 transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <BookText className="size-4" />
                  <span>Quizzes</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="flashcards"
                className="flex-1 py-2 transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <SquareStack className="size-4" />
                  <span>Flashcards</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
              <Input
                className="border-none bg-secondary/50 pl-9 shadow-none"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full border-none bg-secondary/50 shadow-none md:w-[140px]">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Sort" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-[400px]">
            <TabsContent value="quizzes" className="m-0 space-y-4">
              <Pagination />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentItems.map((quiz) => (
                  <Link key={quiz.id} href={`/quiz/${quiz.id}/${quiz.slug}`}>
                    <div className="group flex h-full flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="text-sm">
                            {formatDistanceToNow(new Date(quiz.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                          <BookText className="size-4" />
                        </div>
                        <h3 className="line-clamp-2 font-semibold text-base leading-tight">
                          {quiz.title}
                        </h3>
                      </div>
                      <div className="mt-4 pt-4 text-muted-foreground text-sm">
                        {/* Accessing count from join. Note: Supabase join select key might need checking */}
                        {quiz.quiz_questions?.[0]?.count ?? 0} questions
                      </div>
                    </div>
                  </Link>
                ))}
                {currentItems.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    No quizzes found.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="flashcards" className="m-0 space-y-4">
              <Pagination />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentItems.map((deck) => (
                  <Link key={deck.id} href={`/dashboard/flashcards/${deck.id}`}>
                    <div className="group flex h-full flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="text-sm">
                            {formatDistanceToNow(new Date(deck.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                          <SquareStack className="size-4" />
                        </div>
                        <h3 className="line-clamp-2 font-semibold text-base leading-tight">
                          {deck.title}
                        </h3>
                      </div>
                      <div className="mt-4 pt-4 text-muted-foreground text-sm">
                        {deck.flashcards?.[0]?.count ?? 0} cards
                      </div>
                    </div>
                  </Link>
                ))}
                {currentItems.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    No flashcards found.
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
