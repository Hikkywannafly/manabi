"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  BarChart2,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuizService } from "../services/quiz-service";
import type { Quiz } from "../types";

interface QuizCardProps {
  quiz: Quiz & { quiz_attempts?: { score: number }[] };
}

export function QuizCard({ quiz }: QuizCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const difficulty = (quiz.generation_params as any)?.difficulty || "Medium";
  const questionCount = (quiz.generation_params as any)?.numberOfQuestions || 0;

  const attempts = quiz.quiz_attempts || [];
  const attemptCount = attempts.length;
  const bestScore =
    attemptCount > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

  const { mutate: deleteQuiz, isPending: isDeleting } = useMutation({
    mutationFn: () => QuizService.deleteQuiz(quiz.id),
    onSuccess: () => {
      toast.success("Quiz deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      setIsDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete quiz",
      );
    },
  });

  return (
    <div className="group relative rounded-lg border bg-card p-4 shadow-md transition-all hover:shadow-lg">
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
          <Button disabled className="h-9 rounded-2xl px-3">
            Processing...
          </Button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{quiz.title}" and all associated
              data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteQuiz()}
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
