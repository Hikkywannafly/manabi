"use client";

import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuizService } from "../services/quiz-service";

export function QuizList() {
  const [search, setSearch] = useState("");

  const {
    data: quizzes = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => QuizService.getQuizzes(),
  });

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

      {loading ? (
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
            <Card
              key={quiz.id}
              className="group relative transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-2 h-14 font-semibold text-lg">
                    {quiz.title}
                  </CardTitle>
                  {/* Status Badge */}
                  {quiz.status !== "ready" && (
                    <Badge
                      variant={
                        quiz.status === "failed" ? "destructive" : "secondary"
                      }
                    >
                      {quiz.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-muted-foreground text-sm">
                  {/* Placeholder for question count/difficulty */}
                  <span>
                    {(quiz.generation_params as any)?.difficulty || "Medium"}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {(quiz.generation_params as any)?.numberOfQuestions || "?"}{" "}
                    questions
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {quiz.created_at &&
                      formatDistanceToNow(new Date(quiz.created_at), {
                        addSuffix: true,
                      })}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4">
                <Link href={`/dashboard/quiz/${quiz.id}`}>
                  <Button size="sm" className="gap-1">
                    Open <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
