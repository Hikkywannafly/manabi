"use client";

import { Award, Target, TrendingUp } from "lucide-react";
import * as React from "react";
import { Area, AreaChart, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuizPerformance } from "../hooks/use-statistics";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(217, 91%, 60%)", // Vibrant blue
  },
} satisfies ChartConfig;

export function QuizPerformanceChart() {
  const { data: performanceData = [], isLoading } = useQuizPerformance();

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (performanceData.length === 0) {
      return { avgScore: 0, totalQuizzes: 0, trend: 0 };
    }

    const totalQuizzes = performanceData.reduce((sum, d) => sum + d.count, 0);
    const totalScore = performanceData.reduce(
      (sum, d) => sum + d.score * d.count,
      0,
    );
    const avgScore = Math.round(totalScore / totalQuizzes);

    // Calculate trend (compare last 2 weeks if available)
    let trend = 0;
    if (performanceData.length >= 2) {
      const lastWeek = performanceData[performanceData.length - 1].score;
      const prevWeek = performanceData[performanceData.length - 2].score;
      trend = lastWeek - prevWeek;
    }

    return { avgScore, totalQuizzes, trend };
  }, [performanceData]);

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (performanceData.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-muted-foreground text-sm">
          No quiz data yet. Complete some quizzes to see your performance!
        </p>
      </div>
    );
  }

  return (
    <>
      <ChartContainer config={chartConfig} className="aspect-video w-full">
        <AreaChart accessibilityLayer data={performanceData}>
          <defs>
            <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-score)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-score)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return `Week of ${date.toLocaleDateString()}`;
                }}
              />
            }
          />
          <Area
            dataKey="score"
            type="natural"
            fill="url(#fillScore)"
            fillOpacity={0.4}
            stroke="var(--color-score)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>

      {/* Enhanced Statistics Footer */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Average Score Card */}
        <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">
                Average Score
              </p>
              <div className="flex items-baseline gap-2">
                <span className="bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text font-bold text-2xl text-transparent dark:from-blue-400 dark:to-cyan-400">
                  {stats.avgScore}%
                </span>
              </div>
            </div>
            <div className="rounded-full bg-blue-500/20 p-2">
              <Target className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Trend Card */}
        <div
          className={`group relative flex h-full flex-col overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md ${
            stats.trend > 0
              ? "bg-gradient-to-br from-emerald-500/10 to-green-500/10"
              : stats.trend < 0
                ? "bg-gradient-to-br from-rose-500/10 to-red-500/10"
                : "bg-gradient-to-br from-secondary to-secondary/50"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">Trend</p>
              <div className="flex items-center gap-2">
                {stats.trend !== 0 ? (
                  <>
                    <span
                      className={`font-bold text-2xl ${
                        stats.trend > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {stats.trend > 0 ? "+" : ""}
                      {stats.trend}%
                    </span>
                    <TrendingUp
                      className={`size-4 ${
                        stats.trend > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "rotate-180 text-rose-600 dark:text-rose-400"
                      }`}
                    />
                  </>
                ) : (
                  <span className="font-bold text-2xl text-muted-foreground">
                    —
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total Quizzes Card */}
        <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-4 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">
                Completed
              </p>
              <div className="flex items-baseline gap-2">
                <span className="bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text font-bold text-2xl text-transparent dark:from-violet-400 dark:to-purple-400">
                  {stats.totalQuizzes}
                </span>
                <span className="text-muted-foreground text-xs">quizzes</span>
              </div>
            </div>
            <div className="rounded-full bg-violet-500/20 p-2">
              <Award className="size-4 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
