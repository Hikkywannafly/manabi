"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQuizNavigationLogic } from "../../hooks/use-quiz-navigation-logic";
import { useSubmitQuizAttempt } from "../../hooks/use-submit-quiz-attempt";
import type { QuizTakeMode, QuizWithQuestions } from "../../types";
import { QuizHeader } from "./quiz-header";
import { QuizNavigation } from "./quiz-navigation";
import { QuizQuestionComponent } from "./quiz-question";
import { QuizResultComponent } from "./quiz-result";

interface QuizTakeContentProps {
  quiz: QuizWithQuestions;
  mode?: QuizTakeMode;
}

export function QuizTakeContent({ quiz, mode = "test" }: QuizTakeContentProps) {
  const router = useRouter();
  const questions = quiz.questions || [];
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentQuestionResult, setCurrentQuestionResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
  } | null>(null);

  const {
    currentQuestionIndex,
    answers,
    isCompleted,
    setIsCompleted,
    handleAnswerChange,
    handlePrevious,
    handleNext,
    handleRetake,
    getTotalTimeSpent,
  } = useQuizNavigationLogic({ questions });

  const { mutateAsync: submitAttempt, isPending: isSubmitting } =
    useSubmitQuizAttempt();

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id,
  );

  // Handle answer selection
  const onAnswerSelect = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;

      handleAnswerChange(currentQuestion.id, optionId);

      // In TEST mode, show immediate feedback
      if (mode === "test") {
        const isCorrect = currentQuestion.correct_answer === optionId;
        setCurrentQuestionResult({
          isCorrect,
          correctAnswer: currentQuestion.correct_answer || "",
        });
        setShowFeedback(true);
      }
    },
    [currentQuestion, handleAnswerChange, mode],
  );

  // Handle next question
  const onNext = useCallback(() => {
    setShowFeedback(false);
    setCurrentQuestionResult(null);
    handleNext();
  }, [handleNext]);

  // Handle previous question
  const onPrevious = useCallback(() => {
    setShowFeedback(false);
    setCurrentQuestionResult(null);
    handlePrevious();
  }, [handlePrevious]);

  // Handle quiz submission
  const handleSubmit = useCallback(async () => {
    try {
      const totalTimeSpent = getTotalTimeSpent();
      const submitData = answers.map((a) => ({
        questionId: a.questionId,
        selectedOptionIds: [a.selectedOptionId],
        timeSpent: a.timeSpent,
      }));

      const result = await submitAttempt({
        quizId: quiz.id,
        answers: submitData,
        totalTimeSpent,
      });

      if (!result) {
        throw new Error("Empty response from server");
      }

      setIsCompleted(true);
      toast.success("Quiz submitted successfully!");
    } catch (error: any) {
      console.error("Failed to submit quiz:", error);
      toast.error("Failed to submit quiz. Please try again.");
    }
  }, [answers, quiz.id, submitAttempt, setIsCompleted, getTotalTimeSpent]);

  const handleBackToQuizzes = useCallback(() => {
    router.push("/dashboard/quiz");
  }, [router]);

  // Error state
  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 font-bold text-2xl">No Questions Available</h2>
          <p className="mb-6 text-muted-foreground">
            This quiz doesn't have any questions yet.
          </p>
          <Button onClick={handleBackToQuizzes}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  // Show results
  if (isCompleted) {
    const totalTimeSpent = getTotalTimeSpent();
    const correctCount = answers.filter((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      return question?.correct_answer === answer.selectedOptionId;
    }).length;

    const result = {
      score: (correctCount / questions.length) * 100,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: questions.length - correctCount,
      timeSpent: totalTimeSpent,
      answers: answers.map((answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        return {
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          correctOptionId: question?.correct_answer || "",
          isCorrect: question?.correct_answer === answer.selectedOptionId,
        };
      }),
    };

    return (
      <div className="flex-1 p-6">
        <QuizResultComponent
          result={result}
          onRetake={handleRetake}
          onBackToQuizzes={handleBackToQuizzes}
        />
      </div>
    );
  }

  // Show quiz interface
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center">
          <QuizHeader
            title={quiz.title}
            currentQuestion={currentQuestionIndex}
            totalQuestions={questions.length}
            mode={mode}
          />
          {currentQuestion && (
            <QuizQuestionComponent
              question={currentQuestion}
              selectedOptionId={currentAnswer?.selectedOptionId}
              onAnswerChange={onAnswerSelect}
              showResult={showFeedback && mode === "test"}
              correctOptionId={currentQuestionResult?.correctAnswer}
              mode={mode}
            />
          )}
        </div>
      </div>
      <div className="flex-shrink-0">
        <QuizNavigation
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
          answers={answers}
          onPrevious={onPrevious}
          onNext={onNext}
          onSubmit={handleSubmit}
          onRestartQuiz={handleRetake}
          mode={mode}
        />
      </div>
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 dark:bg-gray-800">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Submitting your quiz...</p>
          </div>
        </div>
      )}
    </div>
  );
}
