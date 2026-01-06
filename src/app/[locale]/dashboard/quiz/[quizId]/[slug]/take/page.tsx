"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DashboardPage } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-provider";
import { QuizTakeContent } from "@/features/quiz/components/take/quiz-take-content";
import { useQuizDetail } from "@/features/quiz/hooks/use-quiz-detail";
import type { QuizTakeMode } from "@/features/quiz/types";

export default function QuizTakeWithSlugPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const quizId = params.quizId as string;
  const mode = (searchParams.get("mode") as QuizTakeMode) || "test";

  const {
    data: quiz,
    isLoading,
    isError,
    error,
  } = useQuizDetail({
    quizId,
  });

  const handleBack = () => {
    router.back();
  };

  const { user } = useAuth();

  if (isLoading) {
    return (
      <DashboardPage>
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardPage>
    );
  }

  if (isError || !quiz) {
    return (
      <DashboardPage title="Error">
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

  return <QuizTakeContent quiz={quiz} mode={mode} userId={user?.id} />;
}
