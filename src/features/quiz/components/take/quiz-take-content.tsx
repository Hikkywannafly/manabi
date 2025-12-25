"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQuizNavigationLogic } from "../../hooks/use-quiz-navigation-logic";
import { useSubmitQuizAttempt } from "../../hooks/use-submit-quiz-attempt";
import type { QuizResult, QuizTakeMode, QuizWithQuestions } from "../../types";
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

    // Calculate results thoroughly
    const resolvedAnswers = answers
      .map((answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        if (!question) return null;

        const correctAnswer = question.correct_answer || "";
        let isCorrect = false;

        // Use the same comparison logic as onAnswerSelect
        if (
          question.question_type === "fill_in_blank" ||
          question.question_type === "short_answer"
        ) {
          isCorrect =
            correctAnswer.trim().toLowerCase() ===
            answer.selectedOptionId.trim().toLowerCase();
        } else {
          const normalizedCorrectAnswer = correctAnswer.startsWith("option-")
            ? correctAnswer
            : `option-${correctAnswer}`;
          isCorrect = normalizedCorrectAnswer === answer.selectedOptionId;
        }

        // Parse options
        let options: any[] = [];
        try {
          const rawOptions =
            typeof question.options === "string"
              ? JSON.parse(question.options)
              : question.options;

          if (Array.isArray(rawOptions)) {
            if (typeof rawOptions[0] === "string") {
              options = rawOptions.map((text, idx) => ({
                id: `option-${idx}`,
                text,
              }));
            } else {
              options = rawOptions;
            }
          }
        } catch (e) {
          console.error("Error parsing options for result:", e);
        }

        return {
          questionId: answer.questionId,
          questionText: question.question_text,
          selectedOptionId: answer.selectedOptionId,
          correctOptionId: correctAnswer.startsWith("option-")
            ? correctAnswer
            : `option-${correctAnswer}`,
          isCorrect,
          options,
        };
      })
      .filter(Boolean) as QuizResult["answers"];

    const correctCount = resolvedAnswers.filter((a) => a.isCorrect).length;
    const score = (correctCount / questions.length) * 100;

    // Determine performance level
    let performanceLevel: QuizResult["performanceLevel"] = "Learning";
    if (score >= 90) performanceLevel = "Excellent";
    else if (score >= 75) performanceLevel = "Good";
    else performanceLevel = "Needs Improvement";

    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: questions.length - correctCount,
      timeSpent: totalTimeSpent,
      performanceLevel,
      personalizedFeedback:
        `Based on your score of ${Math.round(score)}%, you've shown a ${performanceLevel.toLowerCase()} understanding. ` +
        (score < 70
          ? "Focus on reviewing the incorrect answers to strengthen your knowledge."
          : "Keep up the great work! You are master of this topic."),
      answers: resolvedAnswers,
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
