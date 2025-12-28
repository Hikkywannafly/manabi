"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAchievementNotifier } from "@/features/achievements/hooks/use-achievement-notifier";
import { useQuizNavigationLogic } from "../../hooks/use-quiz-navigation-logic";
import { useSubmitQuizAttempt } from "../../hooks/use-submit-quiz-attempt";
import type { QuizResult, QuizTakeMode, QuizWithQuestions } from "../../types";
import { getQuizPerformance } from "../../utils";
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
  const { checkAchievements } = useAchievementNotifier();
  const questions = quiz.questions || [];

  // Store server result
  const [serverResult, setServerResult] = useState<QuizResult | null>(null);

  // Store feedback results for each question
  const [questionResults, setQuestionResults] = useState<
    Record<
      string,
      {
        isCorrect: boolean;
        correctAnswer: string;
      }
    >
  >({});

  const {
    currentQuestionIndex,
    answers,
    isCompleted,
    setIsCompleted,
    setAnswers,
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

  // Get feedback for current question
  const currentQuestionResult = currentQuestion
    ? questionResults[currentQuestion.id]
    : null;

  const showFeedback = mode === "test" && !!currentQuestionResult;

  // Handle answer selection
  const onAnswerSelect = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;

      handleAnswerChange(currentQuestion.id, optionId);

      // In TEST mode, show immediate feedback
      if (mode === "test") {
        // Handle correct_answer comparison
        // AI might return index ("0", "1") or option-id ("option-0", "option-1")
        // or actual text for fill-in-blank/short-answer
        let isCorrect = false;
        const correctAnswer = currentQuestion.correct_answer || "";
        let correctAnswerText = correctAnswer;

        if (
          currentQuestion.question_type === "fill_in_blank" ||
          currentQuestion.question_type === "short_answer"
        ) {
          // For text-based questions, do case-insensitive trim comparison
          isCorrect =
            correctAnswer.trim().toLowerCase() ===
            optionId.trim().toLowerCase();
          correctAnswerText = correctAnswer; // Already text
        } else {
          // For multiple choice/true-false, check both formats
          // If correct_answer is "0", convert to "option-0" for comparison
          const normalizedCorrectAnswer = correctAnswer.startsWith("option-")
            ? correctAnswer
            : `option-${correctAnswer}`;
          isCorrect = normalizedCorrectAnswer === optionId;

          // Get the actual text of the correct answer for display
          if (currentQuestion.options) {
            try {
              const parsedOptions =
                typeof currentQuestion.options === "string"
                  ? JSON.parse(currentQuestion.options)
                  : currentQuestion.options;

              if (Array.isArray(parsedOptions)) {
                if (typeof parsedOptions[0] === "string") {
                  // Array of strings
                  const index = parseInt(correctAnswer, 10);
                  if (!Number.isNaN(index) && parsedOptions[index]) {
                    correctAnswerText = parsedOptions[index];
                  }
                } else {
                  // Array of objects with id and text
                  const correctOption = parsedOptions.find(
                    (opt: any) => opt.id === normalizedCorrectAnswer,
                  );
                  if (correctOption) {
                    correctAnswerText = correctOption.text;
                  }
                }
              }
            } catch (e) {
              console.error("Error parsing options:", e);
            }
          }
        }

        // Store result for this question
        setQuestionResults((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            isCorrect,
            correctAnswer: correctAnswerText,
          },
        }));
      }
      // In EXAM mode, just store the answer without feedback
    },
    [currentQuestion, handleAnswerChange, mode],
  );

  // Handle retry (clear answer and reset feedback)
  const handleRetry = useCallback(() => {
    if (!currentQuestion) return;

    // Clear the answer for current question
    setAnswers((prev) =>
      prev.filter((a) => a.questionId !== currentQuestion.id),
    );

    // Clear feedback for this question
    setQuestionResults((prev) => {
      const newResults = { ...prev };
      delete newResults[currentQuestion.id];
      return newResults;
    });
  }, [currentQuestion, setAnswers]);

  // Handle next question - DON'T reset feedback
  const onNext = useCallback(() => {
    handleNext();
  }, [handleNext]);

  // Handle previous question - DON'T reset feedback
  const onPrevious = useCallback(() => {
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

      const serverResultData = result as unknown as QuizResult; // Ensure type compatibility
      setServerResult(serverResultData);
      setIsCompleted(true);
      toast.success("Quiz submitted successfully!");

      // Check for achievements
      checkAchievements();
    } catch (error: any) {
      console.error("Failed to submit quiz:", error);
      toast.error("Failed to submit quiz. Please try again.");
    }
  }, [
    answers,
    quiz.id,
    submitAttempt,
    setIsCompleted,
    getTotalTimeSpent, // Check for achievements
    checkAchievements,
  ]);

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

    // Use the actual result from the server if available to ensure DB sync
    const finalResult: QuizResult = serverResult || {
      // Fallback calculation ONLY if server result is missing (should not happen)
      score:
        (answers.filter(
          (a) =>
            questions.find((q) => q.id === a.questionId)?.correct_answer ===
            a.selectedOptionId,
        ).length /
          questions.length) *
        100,
      totalQuestions: questions.length,
      correctAnswers: answers.filter(
        (a) =>
          questions.find((q) => q.id === a.questionId)?.correct_answer ===
          a.selectedOptionId,
      ).length,
      incorrectAnswers:
        questions.length -
        answers.filter(
          (a) =>
            questions.find((q) => q.id === a.questionId)?.correct_answer ===
            a.selectedOptionId,
        ).length,
      timeSpent: totalTimeSpent,
      performanceLevel: getQuizPerformance(0).level, // placeholder
      personalizedFeedback: "",
      answers: [],
    };

    // If fallback was needed (shouldn't be), recalculate correctly
    if (!serverResult) {
      // ... existing client side logic could go here, but better to rely on server ...
      // For now, let's trust submitAttempt returns data.
    }

    // Re-assign performance level using utility to ensure consistency
    const performance = getQuizPerformance(finalResult.score);
    finalResult.performanceLevel = performance.level;
    if (!finalResult.personalizedFeedback) {
      const level = performance.level || "Learning";
      finalResult.personalizedFeedback =
        `Based on your score of ${Math.round(finalResult.score)}%, you've shown a ${level.toLowerCase()} understanding. ` +
        (finalResult.score < 70
          ? "Focus on reviewing the incorrect answers to strengthen your knowledge."
          : "Keep up the great work!");
    }

    return (
      <div className="relative flex h-full w-full flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="my-8 px-4 xl:px-8">
            <div className="container mx-auto max-w-7xl p-0">
              <QuizResultComponent
                result={finalResult}
                onRetake={handleRetake}
                onBackToQuizzes={handleBackToQuizzes}
              />
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <QuizNavigation
            currentQuestion={0}
            totalQuestions={1}
            answers={[]}
            onPrevious={() => {}}
            onNext={handleBackToQuizzes}
            onSubmit={handleBackToQuizzes}
            onRestartQuiz={handleRetake}
            mode="exam"
          />
        </div>
      </div>
    );
  }

  // Show quiz interface
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
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
              questionType={currentQuestion.question_type ?? undefined}
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
          showFeedback={showFeedback && mode === "test"}
          isCorrect={currentQuestionResult?.isCorrect}
          correctAnswer={currentQuestionResult?.correctAnswer}
          onRetry={handleRetry}
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
