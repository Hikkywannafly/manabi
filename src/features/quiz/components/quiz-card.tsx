"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowRight, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Quiz } from "../types";

interface QuizCardProps {
  quiz: Quiz & { quiz_attempts?: { score: number }[] };
}

export function QuizCard({ quiz }: QuizCardProps) {
  const difficulty = (quiz.generation_params as any)?.difficulty || "Medium";
  const questionCount = (quiz.generation_params as any)?.numberOfQuestions || 0;

  const attempts = quiz.quiz_attempts || [];
  const attemptCount = attempts.length;
  const bestScore =
    attemptCount > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

  return (
    // rounded-lg bg-secondary p-4 shadow-md
    <div className="rounded-lg border bg-card p-4 shadow-md transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <h3
          className="line-clamp-1 font-semibold text-lg"
          title={quiz.title || "Untitled Quiz"}
        >
          {quiz.title}
        </h3>
        {quiz.status !== "ready" && (
          <Badge
            variant={quiz.status === "failed" ? "destructive" : "secondary"}
          >
            {quiz.status}
          </Badge>
        )}
      </div>

      <div className="mt-1 text-muted-foreground text-sm">
        <span className="capitalize">{difficulty}</span> • {questionCount}{" "}
        questions •{" "}
        {quiz.created_at &&
          formatDistanceToNow(new Date(quiz.created_at), { addSuffix: true })}
      </div>

      {/* Placeholder for stats - To be implemented when backend supports aggregation */}
      {attemptCount > 0 && (
        <div className="mt-2 flex items-center gap-2 text-primary text-sm">
          <BarChart2 className="h-4 w-4" />
          Best: {Math.round(bestScore)}% ({attemptCount} attempts)
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link href={`/dashboard/quiz/${quiz.id}/edit`}>
          <Button variant="secondary" className="h-9 rounded-2xl px-3">
            Edit
          </Button>
        </Link>

        {attemptCount > 0 && (
          <Link href={`/dashboard/quiz/${quiz.id}/results`}>
            <Button variant="secondary" className="h-9 rounded-2xl px-3">
              <BarChart2 className="mr-2 h-4 w-4" />
              Results
            </Button>
          </Link>
        )}

        {quiz.status === "ready" ? (
          <Link
            href={
              quiz.slug
                ? `/dashboard/quiz/${quiz.id}/${quiz.slug}/take?mode=test`
                : `/dashboard/quiz/${quiz.id}/take?mode=test`
            }
          >
            <Button className="h-9 rounded-2xl px-3">
              Open
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          // Disabled button if not ready
          <Button disabled className="h-9 rounded-2xl px-3">
            Processing...
          </Button>
        )}
      </div>
    </div>
  );
}
