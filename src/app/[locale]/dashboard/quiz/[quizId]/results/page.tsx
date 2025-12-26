"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DashboardPage } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QuizResultsContent } from "@/features/quiz/components/results/quiz-results-content";
import { useQuizHistory } from "@/features/quiz/hooks/use-quiz-history";

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();

  const quizId = params.quizId as string;

  const {
    data: historyData,
    isLoading,
    isError,
    error,
  } = useQuizHistory(quizId);

  const handleBack = () => {
    router.push("/dashboard/quiz");
  };

  if (isLoading) {
    return (
      <DashboardPage>
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardPage>
    );
  }

  if (isError || !historyData) {
    return (
      <DashboardPage
        title="Error"
        headerAction={
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      >
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="mb-2 font-semibold text-destructive text-lg">
            Quiz not found
          </h3>
          <p className="mb-4 text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "The quiz you're looking for doesn't exist."}
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage
      headerAction={
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quizzes
        </Button>
      }
    >
      <QuizResultsContent
        quiz={historyData.quiz}
        attempts={historyData.attempts}
      />
    </DashboardPage>
  );
}
