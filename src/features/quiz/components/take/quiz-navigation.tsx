"use client";

import {
  ArrowLeft,
  ArrowRight,
  Edit,
  RefreshCw,
  RotateCcw,
  Settings,
  Share,
  Trash,
  WandSparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { QuizAnswer, QuizTakeMode } from "../../types";

interface QuizNavigationProps {
  quizId: string;
  currentQuestion: number;
  totalQuestions: number;
  answers: QuizAnswer[];
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onRestartQuiz: () => void;
  mode?: QuizTakeMode;
  showFeedback?: boolean;
  isCorrect?: boolean;
  correctAnswer?: string;
  onRetry?: () => void;
  onAskAI?: () => void;
}

export function QuizNavigation({
  quizId,
  currentQuestion,
  totalQuestions,
  answers: _answers,
  onPrevious,
  onNext,
  onSubmit,
  onRestartQuiz,
  mode = "test",
  showFeedback = false,
  isCorrect = false,
  correctAnswer,
  onRetry,
  onAskAI,
}: QuizNavigationProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const hasNextQuestion = currentQuestion < totalQuestions - 1;
  const hasPreviousQuestion = currentQuestion > 0;

  // Determine background color based on feedback
  const bgColor = showFeedback
    ? isCorrect
      ? "!bg-green-900"
      : "!bg-red-900"
    : "bg-secondary";

  // Determine button color based on feedback
  const buttonColor = showFeedback
    ? isCorrect
      ? "bg-green-600 text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-700"
      : "bg-red-600 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-700"
    : "bg-muted text-primary-foreground hover:bg-primary/90";

  const handleEditQuiz = () => {
    router.push(`/dashboard/quiz/${quizId}/edit`);
  };

  const handleShareQuiz = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleDeleteQuiz = async () => {
    try {
      const { QuizService } = await import("../../services/quiz-service");
      await QuizService.deleteQuiz(quizId);
      toast.success("Quiz deleted successfully");
      router.push("/dashboard/quiz");
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div
      className={cn(
        "z-10 flex w-full items-center justify-center p-4 sm:px-6 md:p-8",
        bgColor,
      )}
    >
      <div className="flex w-full max-w-6xl flex-wrap justify-between gap-4 md:flex-nowrap md:gap-8">
        {/* Feedback Section (TEST mode only) */}
        {showFeedback && mode === "test" ? (
          <div className="flex grow items-center md:w-3/5">
            <ScrollArea
              className={cn(
                "relative max-h-[60vh] overflow-hidden",
                isCorrect
                  ? "!text-green-200 dark:!text-green-300 [&_ol>li::marker]:text-green-200 dark:[&_ol>li::marker]:text-green-300 [&_ul>li::marker]:text-green-200 dark:[&_ul>li::marker]:text-green-300"
                  : "!text-red-200 dark:!text-red-300 [&_ol>li::marker]:text-red-200 dark:[&_ol>li::marker]:text-red-300 [&_ul>li::marker]:text-red-200 dark:[&_ul>li::marker]:text-red-300",
              )}
            >
              <p className="font-semibold text-xl">
                {isCorrect ? "Correct!" : "Incorrect!"}
              </p>
              <div className="space-y-2">
                <span className="block">
                  The answer is:{" "}
                  <div
                    className={cn(
                      "prose prose-sm md:prose-lg inline-block max-w-none font-semibold",
                      isCorrect
                        ? "!text-green-200 dark:!text-green-300 prose-strong:text-green-200 dark:prose-strong:text-green-300 [&_ol>li::marker]:text-green-200 dark:[&_ol>li::marker]:text-green-300 [&_ul>li::marker]:text-green-200 dark:[&_ul>li::marker]:text-green-300"
                        : "!text-red-200 dark:!text-red-300 prose-strong:text-red-200 dark:prose-strong:text-red-300 [&_ol>li::marker]:text-red-200 dark:[&_ol>li::marker]:text-red-300 [&_ul>li::marker]:text-red-200 dark:[&_ul>li::marker]:text-red-300",
                    )}
                  >
                    <p>{correctAnswer}</p>
                  </div>
                </span>
                <Button
                  onClick={onAskAI}
                  className={cn(
                    "flex h-10 shrink-0 items-center rounded-2xl px-4 py-2 text-white",
                    buttonColor,
                  )}
                >
                  <WandSparkles className="mr-2" size={16} />
                  Ask Manabi for explanation
                </Button>
              </div>
            </ScrollArea>
          </div>
        ) : (
          /* Settings/Share Section (EXAM mode or no feedback) */
          <div className="flex grow items-center md:w-3/5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 rounded-2xl md:flex-initial"
                  type="button"
                >
                  <Settings className="mr-2 size-4" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={handleEditQuiz}>
                  <Edit className="mr-2 size-4" />
                  Edit Quiz
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareQuiz}>
                  <Share className="mr-2 size-4" />
                  Share Quiz
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 size-4" />
                  Delete Quiz
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex w-full items-center justify-end gap-1 sm:gap-2 md:w-2/5">
          {/* Previous Button - Always show if not first question */}
          {hasPreviousQuestion && (
            <Button
              size="sm"
              onClick={onPrevious}
              className={cn(
                "flex shrink-0 items-center rounded-2xl px-2 sm:px-3 md:flex-initial",
                showFeedback
                  ? buttonColor
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              <ArrowLeft className="sm:mr-2" size={16} />
              <span className="hidden sm:inline">Previous</span>
            </Button>
          )}

          {/* Restart Quiz Button */}
          <Button
            size="sm"
            onClick={onRestartQuiz}
            className={cn(
              "flex shrink-0 items-center rounded-2xl px-2 sm:px-3 md:flex-initial",
              showFeedback
                ? buttonColor
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            type="button"
          >
            <RotateCcw className="sm:mr-2" size={16} />
            <span className="hidden sm:inline">Restart quiz</span>
          </Button>

          {/* Retry Button (only for incorrect answers in TEST mode) */}
          {showFeedback && !isCorrect && onRetry && (
            <Button
              size="sm"
              onClick={onRetry}
              className={cn(
                "flex shrink-0 items-center rounded-2xl px-2 sm:px-3 md:flex-initial",
                buttonColor,
              )}
            >
              <RefreshCw className="mr-2" size={16} />
              <span>Retry</span>
            </Button>
          )}

          {/* Next/Submit Button */}
          {hasNextQuestion ? (
            <Button
              size="sm"
              onClick={onNext}
              className={cn(
                "flex min-w-0 flex-1 items-center rounded-2xl px-3 sm:min-w-fit sm:flex-initial",
                showFeedback
                  ? buttonColor
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              <span className="truncate">
                {showFeedback ? "Next" : "See answer"}
              </span>
              <ArrowRight className="ml-2 shrink-0" size={16} />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onSubmit}
              className={cn(
                "flex min-w-0 flex-1 items-center rounded-2xl px-3 sm:min-w-fit sm:flex-initial",
                showFeedback
                  ? buttonColor
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              <span className="truncate">Submit</span>
              <ArrowRight className="ml-2 shrink-0" size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz and all associated questions and attempts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuiz}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
