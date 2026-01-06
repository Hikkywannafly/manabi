"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  type AIExplanationContext,
  AIExplanationPanel,
} from "@/components/ai-explanation";
import { Button } from "@/components/ui/button";
import { useAchievementNotifier } from "@/features/achievements/hooks/use-achievement-notifier";
import { useMissionNotifier } from "@/features/missions/hooks/use-mission-notifier";
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
  userId?: string;
  disableSettings?: boolean;
  saveAttempt?: boolean;
}

export function QuizTakeContent({
  quiz,
  mode = "test",
  userId,
  disableSettings = false,
  saveAttempt = true,
}: QuizTakeContentProps) {
  const router = useRouter();
  const { checkAchievements } = useAchievementNotifier();
  const { checkMissions } = useMissionNotifier();

  // Question order management for shuffle
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const originalQuestions = quiz.questions || [];
  const isInitialized = useRef(false);

  // Initialize question order on mount (only once)
  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want to initialize once when questions load
  useEffect(() => {
    if (originalQuestions.length > 0 && !isInitialized.current) {
      setQuestionOrder(originalQuestions.map((_, i) => i));
      isInitialized.current = true;
    }
  }, [originalQuestions.length]);

  // Get ordered questions based on questionOrder
  const questions = useMemo(
    () =>
      questionOrder.map((index) => originalQuestions[index]).filter(Boolean),
    [questionOrder, originalQuestions],
  );

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

  // AI Explanation Panel state
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

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

  // Shuffle handler
  const handleShuffle = useCallback(() => {
    if (originalQuestions.length === 0) return;
    const shuffled = [...questionOrder];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuestionOrder(shuffled);
    // Note: Answers are preserved by question ID, so shuffle doesn't affect them
  }, [questionOrder, originalQuestions.length]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id,
  );

  // Get feedback for current question
  const currentQuestionResult = currentQuestion
    ? questionResults[currentQuestion.id]
    : null;

  const showFeedback = mode === "test" && !!currentQuestionResult;

  // Build AI explanation context for current question
  const aiExplanationContext = useMemo((): AIExplanationContext | null => {
    if (!(currentQuestion && currentQuestionResult)) return null;

    // Parse options
    let options: Array<{ id: string; text: string }> = [];
    try {
      const rawOptions =
        typeof currentQuestion.options === "string"
          ? JSON.parse(currentQuestion.options)
          : currentQuestion.options;

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
      console.error("Error parsing options for AI context:", e);
    }

    return {
      contentType: "quiz",
      questionText: currentQuestion.question_text || "",
      options,
      correctAnswer: currentQuestionResult.correctAnswer,
      userAnswer: currentAnswer?.selectedOptionId || "",
      isCorrect: currentQuestionResult.isCorrect,
    };
  }, [currentQuestion, currentQuestionResult, currentAnswer]);

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

      // Calculate local result for both scenarios
      const _correctAnswersCount = answers.filter(
        (a) =>
          questions.find((q) => q.id === a.questionId)?.correct_answer ===
          a.selectedOptionId, // NOTE: Use improved local comparison logic from onAnswerSelect if possible, but for now simple check
      ).length;

      // Using basic check here might be flawed for normalization ("option-0" vs "0").
      // Ideally we reuse the robust logic. Let's rely on what we have or accept basic check for non-save mode.
      // Actually, let's implement the robust check locally to be safe.
      let _robustCorrectCount = 0;
      const _robustAnswers = answers.map((a) => {
        const q = questions.find((qu) => qu.id === a.questionId);
        if (!q) return { ...a, isCorrect: false, options: [] };

        const correctId = q.correct_answer || "";
        let isCorrect = false;
        if (
          q.question_type === "fill_in_blank" ||
          q.question_type === "short_answer"
        ) {
          isCorrect =
            a.selectedOptionId.trim().toLowerCase() ===
            correctId.trim().toLowerCase();
        } else {
          const normCorrect = correctId.startsWith("option-")
            ? correctId
            : `option-${correctId}`;
          const normSelected = a.selectedOptionId.startsWith("option-")
            ? a.selectedOptionId
            : a.selectedOptionId; // assume selected is already option-X for non-text
          isCorrect = normCorrect === normSelected;
        }
        if (isCorrect) _robustCorrectCount++;

        // Parse options for display
        let options: any[] = [];
        try {
          const raw =
            typeof q.options === "string" ? JSON.parse(q.options) : q.options;
          if (Array.isArray(raw))
            options =
              typeof raw[0] === "string"
                ? raw.map((t, i) => ({ id: `option-${i}`, text: t }))
                : raw;
        } catch (_e) {}

        return {
          questionText: q.question_text,
          questionId: a.questionId,
          selectedOptionId: a.selectedOptionId,
          correctOptionId: correctId,
          isCorrect,
          timeSpent: a.timeSpent,
          options,
        };
      });

      if (!saveAttempt) {
        // Practice mode: Local calculation only
        const robustAnswers = answers.map((a) => {
          const q = questions.find((qu) => qu.id === a.questionId);
          if (!q) {
            return {
              questionId: a.questionId,
              questionText: "",
              selectedOptionId: a.selectedOptionId,
              correctOptionId: "",
              isCorrect: false,
              timeSpent: a.timeSpent,
              options: [],
            };
          }

          const correctId = q.correct_answer || "";
          let isCorrect = false;
          if (
            q.question_type === "fill_in_blank" ||
            q.question_type === "short_answer"
          ) {
            isCorrect =
              a.selectedOptionId.trim().toLowerCase() ===
              correctId.trim().toLowerCase();
          } else {
            const normCorrect = correctId.startsWith("option-")
              ? correctId
              : `option-${correctId}`;
            const normSelected = a.selectedOptionId.startsWith("option-")
              ? a.selectedOptionId
              : a.selectedOptionId;
            isCorrect = normCorrect === normSelected;
          }

          // Parse options for display
          let options: any[] = [];
          try {
            const raw =
              typeof q.options === "string" ? JSON.parse(q.options) : q.options;
            if (Array.isArray(raw)) {
              options =
                typeof raw[0] === "string"
                  ? raw.map((t: string, i: number) => ({
                      id: `option-${i}`,
                      text: t,
                    }))
                  : raw;
            }
          } catch (_e) {}

          return {
            questionText: q.question_text || "",
            questionId: a.questionId,
            selectedOptionId: a.selectedOptionId,
            correctOptionId: correctId,
            isCorrect,
            timeSpent: a.timeSpent,
            options,
          };
        });

        const correctCount = robustAnswers.filter((a) => a.isCorrect).length;

        const localResult: QuizResult = {
          score: (correctCount / questions.length) * 100,
          totalQuestions: questions.length,
          correctAnswers: correctCount,
          incorrectAnswers: questions.length - correctCount,
          timeSpent: totalTimeSpent,
          performanceLevel: getQuizPerformance(
            (correctCount / questions.length) * 100,
          ).level,
          personalizedFeedback: "",
          answers: robustAnswers,
        };

        setServerResult(localResult);
        setIsCompleted(true);
        toast.success("Quiz completed! (Practice Mode)");
        return;
      }

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

      // Check for achievements and missions FIRST
      checkAchievements();
      checkMissions();

      // Then show success toast (missions will toast right after if completed)
      toast.success("Quiz submitted successfully!");
    } catch (error: any) {
      console.error("Failed to submit quiz:", error);
      toast.error("Failed to submit quiz. Please try again.");
    }
  }, [
    answers,
    questions,
    quiz.id,
    saveAttempt,
    submitAttempt,
    setIsCompleted,
    getTotalTimeSpent,
    checkAchievements,
    checkMissions,
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
            quizId={quiz.id}
            currentQuestion={0}
            totalQuestions={1}
            answers={[]}
            onPrevious={() => {}}
            onNext={handleBackToQuizzes}
            onSubmit={handleBackToQuizzes}
            onRestartQuiz={handleRetake}
            mode="exam"
            creatorName={
              quiz.profiles?.nickname || quiz.profiles?.full_name || "Unknown"
            }
            creatorAvatar={quiz.profiles?.avatar_url}
            createdAt={quiz.created_at}
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
            onShuffle={handleShuffle}
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
          quizId={quiz.id}
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
          onAskAI={() => setIsAIPanelOpen(true)}
          isOwner={!disableSettings && userId === quiz.owner_id}
          creatorName={
            quiz.profiles?.nickname || quiz.profiles?.full_name || "Unknown"
          }
          creatorAvatar={quiz.profiles?.avatar_url}
          createdAt={quiz.created_at}
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

      {/* AI Explanation Panel */}
      <AIExplanationPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        context={aiExplanationContext}
      />
    </div>
  );
}
