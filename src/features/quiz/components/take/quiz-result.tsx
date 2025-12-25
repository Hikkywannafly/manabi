"use client";

import {
  BookOpen,
  BrainCircuit,
  ChartColumn,
  CircleCheck,
  CircleX,
  Crown,
  MessageSquare,
  Sparkles,
  Timer,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { QuizResult } from "../../types";

interface QuizResultProps {
  result: QuizResult;
  onRetake: () => void;
  onBackToQuizzes: () => void;
}

export function QuizResultComponent({ result }: QuizResultProps) {
  const percentage = Math.round(result.score);

  const getPerformanceColor = (level?: string) => {
    switch (level) {
      case "Excellent":
        return "text-green-500 bg-green-100 dark:bg-green-900/50";
      case "Good":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/50";
      case "Learning":
      case "Needs Improvement":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50";
      default:
        return "bg-secondary";
    }
  };

  const getPercentageColor = (pct: number) => {
    if (pct >= 80) return "text-green-500 bg-green-100 dark:bg-green-900/50";
    if (pct >= 60) return "text-blue-500 bg-blue-100 dark:bg-blue-900/50";
    return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50";
  };

  const formattedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-32">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Final Score */}
        <div
          className={cn(
            "col-span-1 flex flex-col items-center rounded-lg p-4",
            getPercentageColor(percentage),
          )}
        >
          <ChartColumn className="mb-2 size-8" />
          <p className="font-medium text-sm">Final Score</p>
          <p className="font-bold text-2xl">{percentage}%</p>
        </div>

        {/* Correct Answers */}
        <div className="flex flex-col items-center rounded-lg bg-secondary p-4">
          <CircleCheck className="mb-2 size-8 text-green-500" />
          <p className="font-medium text-sm">Correct Answers</p>
          <p className="font-bold text-2xl text-green-500">
            {result.correctAnswers}/{result.totalQuestions}
          </p>
        </div>

        {/* Time Spent */}
        <div className="flex flex-col items-center rounded-lg bg-secondary p-4">
          <Timer className="mb-2 size-8 text-blue-500" />
          <p className="font-medium text-sm">Time Spent</p>
          <p className="font-bold text-2xl text-blue-500">
            {formattedTime(result.timeSpent)}
          </p>
        </div>

        {/* Performance Level */}
        <div
          className={cn(
            "flex flex-col items-center rounded-lg p-4",
            getPerformanceColor(result.performanceLevel),
          )}
        >
          <BrainCircuit className="mb-2 size-8" />
          <p className="font-medium text-sm">Performance Level</p>
          <p className="font-bold text-2xl">
            {result.performanceLevel || "Determining..."}
          </p>
        </div>
      </div>

      {/* Personalized Feedback AI Section */}
      <Accordion type="single" collapsible className="rounded-lg border">
        <AccordionItem value="feedback" className="border-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MessageSquare className="size-5 text-blue-500" />
                <Crown className="-right-1 -top-1 absolute size-3 text-amber-500" />
              </div>
              <h2 className="font-semibold text-foreground text-lg">
                Personalized Feedback
              </h2>
              <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-700 text-xs dark:bg-amber-900/20 dark:text-amber-300">
                <Sparkles className="size-3" />
                <span>Pro</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 text-sm">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {result.personalizedFeedback ||
                "AI is analyzing your performance to provide tailored feedback..."}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Answer Review Section */}
      <div className="rounded-lg border p-2 sm:p-4">
        <h2 className="mb-4 font-semibold text-lg">Review Answers</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap items-center justify-start space-y-1 bg-muted p-1">
            <TabsTrigger
              value="all"
              className="flex flex-1 items-center justify-center gap-2 text-sm"
            >
              <BookOpen className="size-4" />
              <span className="whitespace-nowrap">
                All ({result.totalQuestions})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="correct"
              className="flex flex-1 items-center justify-center gap-2 text-sm"
            >
              <CircleCheck className="size-4 text-green-500" />
              <span className="whitespace-nowrap">
                Correct ({result.correctAnswers})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="incorrect"
              className="flex flex-1 items-center justify-center gap-2 text-sm"
            >
              <CircleX className="size-4 text-red-500" />
              <span className="whitespace-nowrap">
                Incorrect ({result.incorrectAnswers})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <AnswerList answers={result.answers} />
          </TabsContent>
          <TabsContent value="correct" className="mt-4">
            <AnswerList answers={result.answers.filter((a) => a.isCorrect)} />
          </TabsContent>
          <TabsContent value="incorrect" className="mt-4">
            <AnswerList answers={result.answers.filter((a) => !a.isCorrect)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AnswerList({ answers }: { answers: QuizResult["answers"] }) {
  if (answers.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No questions to display.
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="space-y-2">
      {answers.map((answer, _index) => (
        <AccordionItem
          key={answer.questionId}
          value={answer.questionId}
          className="overflow-hidden rounded-lg border"
        >
          <AccordionTrigger className="bg-secondary/50 px-4 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
            <div className="flex items-center gap-4 text-left">
              {answer.isCorrect ? (
                <CircleCheck className="shrink-0 text-green-500" />
              ) : (
                <CircleX className="shrink-0 text-red-500" />
              )}
              <div className="prose prose-sm md:prose-base !text-foreground line-clamp-2 max-w-none font-medium">
                {answer.questionText}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-background px-4 pt-4 pb-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {answer.options.map((option, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isUserSelection = option.id === answer.selectedOptionId;
                  const isCorrectAnswer = option.id === answer.correctOptionId;

                  return (
                    <div
                      key={option.id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-sm transition-colors",
                        isCorrectAnswer &&
                          "border-green-500 bg-green-50/50 dark:bg-green-900/20",
                        isUserSelection &&
                          !isCorrectAnswer &&
                          "border-red-500 bg-red-50/50 dark:bg-red-900/20",
                        !(isUserSelection || isCorrectAnswer) &&
                          "bg-secondary/30",
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full font-bold text-xs",
                          isCorrectAnswer
                            ? "bg-green-500 text-white"
                            : isUserSelection
                              ? "bg-red-500 text-white"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {letter}
                      </div>
                      <span className="flex-1 opacity-90">{option.text}</span>
                      {isCorrectAnswer && (
                        <CircleCheck className="size-4 text-green-500" />
                      )}
                      {isUserSelection && !isCorrectAnswer && (
                        <CircleX className="size-4 text-red-500" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Feedback if available */}
              {!answer.isCorrect && (
                <div className="rounded-lg bg-blue-50 p-3 text-blue-700 text-xs dark:bg-blue-900/20 dark:text-blue-300">
                  <p className="font-semibold">Explaination:</p>
                  <p>
                    In this question, the correct answer is indeed "
                    {
                      answer.options.find(
                        (o) => o.id === answer.correctOptionId,
                      )?.text
                    }
                    ". Review this topic to improve next time.
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
