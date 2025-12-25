"use client";

import { useCallback, useEffect, useState } from "react";
import type { QuizAnswer, QuizQuestion } from "../types";

interface UseQuizNavigationLogicProps {
  questions: QuizQuestion[];
}

export function useQuizNavigationLogic({
  questions,
}: UseQuizNavigationLogicProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [questionStartTimes, setQuestionStartTimes] = useState<
    Record<string, number>
  >({});

  // Initialize start time for first question
  useEffect(() => {
    if (questions.length > 0 && !questionStartTimes[questions[0].id]) {
      setQuestionStartTimes((prev) => ({
        ...prev,
        [questions[0].id]: Date.now(),
      }));
    }
  }, [questions, questionStartTimes]);

  const handleAnswerChange = useCallback(
    (questionId: string, selectedOptionId: string) => {
      const startTime = questionStartTimes[questionId] || Date.now();
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      setAnswers((prev) => {
        const existingIndex = prev.findIndex(
          (a) => a.questionId === questionId,
        );
        const newAnswer: QuizAnswer = {
          questionId,
          selectedOptionId,
          timeSpent,
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newAnswer;
          return updated;
        }
        return [...prev, newAnswer];
      });
    },
    [questionStartTimes],
  );

  const handleNavigateToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentQuestionIndex(index);
        const questionId = questions[index].id;
        if (!questionStartTimes[questionId]) {
          setQuestionStartTimes((prev) => ({
            ...prev,
            [questionId]: Date.now(),
          }));
        }
      }
    },
    [questions, questionStartTimes],
  );

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      handleNavigateToQuestion(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length, handleNavigateToQuestion]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      handleNavigateToQuestion(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, handleNavigateToQuestion]);

  const handleRetake = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
    setQuestionStartTimes({
      [questions[0]?.id]: Date.now(),
    });
  }, [questions]);

  const getTotalTimeSpent = useCallback(() => {
    return answers.reduce((total, answer) => total + answer.timeSpent, 0);
  }, [answers]);

  return {
    currentQuestionIndex,
    answers,
    isCompleted,
    setAnswers,
    setIsCompleted,
    handleAnswerChange,
    handleNavigateToQuestion,
    handleNext,
    handlePrevious,
    handleRetake,
    getTotalTimeSpent,
  };
}
