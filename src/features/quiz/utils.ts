import type { QuizResult } from "./types";

export const GRADE_CONFIG = {
  EXCELLENT: {
    min: 90,
    label: "Excellent",
    color: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-200",
  },
  GOOD: {
    min: 75,
    label: "Good",
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
  },
  AVERAGE: {
    min: 50,
    label: "Average",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    border: "border-yellow-200",
  },
  POOR: {
    min: 0,
    label: "Needs Improvement",
    color: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-200",
  },
} as const;

export function getQuizPerformance(score: number): {
  level: QuizResult["performanceLevel"];
  config: (typeof GRADE_CONFIG)[keyof typeof GRADE_CONFIG];
} {
  if (score >= GRADE_CONFIG.EXCELLENT.min) {
    return { level: "Excellent", config: GRADE_CONFIG.EXCELLENT };
  }
  if (score >= GRADE_CONFIG.GOOD.min) {
    return { level: "Good", config: GRADE_CONFIG.GOOD };
  }
  if (score >= GRADE_CONFIG.AVERAGE.min) {
    return { level: "Average", config: GRADE_CONFIG.AVERAGE };
  }
  return { level: "Needs Improvement", config: GRADE_CONFIG.POOR };
}

export function normalizeAnswer(answer: string): string {
  return answer?.trim().toLowerCase() || "";
}
