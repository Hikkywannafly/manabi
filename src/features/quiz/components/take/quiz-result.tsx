"use client";

import { Award, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizResult } from "../../types";

interface QuizResultProps {
  result: QuizResult;
  onRetake: () => void;
  onBackToQuizzes: () => void;
}

export function QuizResultComponent({
  result,
  onRetake,
  onBackToQuizzes,
}: QuizResultProps) {
  const percentage = Math.round(result.score);
  const passed = percentage >= 70; // Assuming 70% is passing

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      {/* Pass/Fail Status */}
      <Card
        className={`border-2 ${passed ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-red-500 bg-red-50 dark:bg-red-950/20"}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center text-2xl">
            {passed ? (
              <>
                <Award className="h-8 w-8 text-green-600" />
                <span className="text-green-600">
                  Congratulations! You Passed!
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-8 w-8 text-red-600" />
                <span className="text-red-600">Keep Practicing!</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="mb-4 font-bold text-6xl">{percentage}%</div>
            <p className="text-muted-foreground">
              {passed
                ? "Great job! You've demonstrated a solid understanding."
                : "Don't worry! Review the material and try again."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-medium text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Correct Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {result.correctAnswers} / {result.totalQuestions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-medium text-sm">
              <XCircle className="h-4 w-4 text-red-600" />
              Incorrect Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {result.incorrectAnswers} / {result.totalQuestions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-medium text-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {Math.floor(result.timeSpent / 60)}:
              {String(result.timeSpent % 60).padStart(2, "0")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={onRetake} variant="outline" size="lg">
          Retake Quiz
        </Button>
        <Button onClick={onBackToQuizzes} size="lg">
          Back to Quizzes
        </Button>
      </div>
    </div>
  );
}
