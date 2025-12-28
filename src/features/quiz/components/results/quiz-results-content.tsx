"use client";

import { formatDistanceToNow } from "date-fns";
import { Calendar, Clock, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Quiz, QuizAttempt } from "../../types";

interface QuizResultsContentProps {
  quiz: Quiz;
  attempts: QuizAttempt[];
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

import { getQuizPerformance } from "../../utils";

export function QuizResultsContent({
  quiz,
  attempts,
}: QuizResultsContentProps) {
  // Calculate Stats
  const totalAttempts = attempts.length;
  const bestScore =
    totalAttempts > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

  const averageScoreRaw =
    totalAttempts > 0
      ? attempts.reduce((acc, a) => acc + a.score, 0) / totalAttempts
      : 0;
  const averageScore = Math.round(averageScoreRaw);

  const totalTimeSeconds = attempts.reduce(
    (acc, a) => acc + (a.duration_seconds || 0),
    0,
  );

  // Format Total Time
  const totalTimeHours = Math.floor(totalTimeSeconds / 3600);
  const totalTimeMinutes = Math.floor((totalTimeSeconds % 3600) / 60);
  const totalTimeDisplay =
    totalTimeHours > 0
      ? `${totalTimeHours}h ${totalTimeMinutes}m`
      : `${totalTimeMinutes}m`;

  const bestPerformance = getQuizPerformance(bestScore);
  const averagePerformance = getQuizPerformance(averageScore);

  return (
    <div className="py-4">
      {/* Stats Grid */}
      {/* display quizz name */}
      <h2 className="mb-8 font-semibold text-2xl">{quiz.title}</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-none bg-secondary/50 shadow-none">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm tracking-tight">
              Total Attempts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="font-bold text-2xl">{totalAttempts}</div>
          </CardContent>
        </Card>

        <Card className="border-none bg-secondary/50 shadow-none">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm tracking-tight">
              Best Score
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div
              className={`font-bold text-2xl ${bestPerformance.config.color}`}
            >
              {Math.round(bestScore)}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-secondary/50 shadow-none">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm tracking-tight">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div
              className={`font-bold text-2xl ${averagePerformance.config.color}`}
            >
              {averageScore}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-secondary/50 shadow-none">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm tracking-tight">
              Total Time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="font-bold text-2xl">{totalTimeDisplay}</div>
          </CardContent>
        </Card>
      </div>

      {/* Attempts List */}
      <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold text-lg leading-none tracking-tight">
            All Attempts
          </h3>
        </div>
        <div className="p-0">
          <div className="divide-y">
            {attempts.map((attempt, index) => {
              const isBest = attempt.score === bestScore && bestScore > 0;
              const isLatest = index === 0;
              const performance = getQuizPerformance(attempt.score);

              // Calculate correct answers
              const logs = (attempt.answers_log as any[]) || [];
              const totalQuestions = logs.length;
              const correctAnswers = logs.filter(
                (a: any) => a.isCorrect,
              ).length;

              return (
                <Link
                  key={attempt.id}
                  href={`/dashboard/quiz/${quiz.id}/${quiz.slug || "view"}/results/${attempt.id}`}
                  className="block p-6 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        {isLatest && (
                          <span className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 font-semibold text-primary-foreground text-xs transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            Latest
                          </span>
                        )}
                        {!isLatest && (
                          <span className="inline-flex items-center rounded-full border border-transparent bg-secondary px-2.5 py-0.5 font-semibold text-secondary-foreground text-xs transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            Attempt {totalAttempts - index}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${performance.config.bg} ${performance.config.color} ${performance.config.border}`}
                        >
                          {performance.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          {attempt.completed_at
                            ? formatDistanceToNow(
                                new Date(attempt.completed_at),
                                {
                                  addSuffix: true,
                                },
                              )
                            : "Unknown date"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          {formatDuration(attempt.duration_seconds || 0)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="size-4" />
                          {correctAnswers} / {totalQuestions} correct
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold text-2xl ${performance.config.color}`}
                      >
                        {Math.round(attempt.score)}%
                      </div>
                      {isBest && (
                        <div className="mt-1 inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 font-semibold text-foreground text-green-700 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:border-green-900 dark:bg-green-900/30 dark:text-green-400">
                          <TrendingUp className="mr-1 size-3" />
                          Best
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}

            {attempts.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No attempts yet. Take the quiz to see your history!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center">
        <Link
          href={
            quiz.slug
              ? `/dashboard/quiz/${quiz.id}/${quiz.slug}/take?mode=test`
              : `/dashboard/quiz/${quiz.id}/take?mode=test`
          }
        >
          <Button className="h-10 rounded-2xl px-6 py-2">
            Take Quiz Again
          </Button>
        </Link>
      </div>
    </div>
  );
}
