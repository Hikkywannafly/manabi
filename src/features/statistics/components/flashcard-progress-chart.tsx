"use client";

import { Award, Target, TrendingUp } from "lucide-react";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useFlashcardProgress } from "../hooks/use-statistics";

const chartConfig = {
  count: {
    label: "Cards",
  },
  new: {
    label: "New",
    color: "hsl(271, 91%, 65%)", // Vibrant purple
  },
  learning: {
    label: "Learning",
    color: "hsl(45, 93%, 47%)", // Vibrant amber
  },
  review: {
    label: "Review",
    color: "hsl(160, 84%, 39%)", // Vibrant emerald
  },
  relearning: {
    label: "Relearning",
    color: "hsl(350, 89%, 60%)", // Vibrant rose
  },
} satisfies ChartConfig;

export function FlashcardProgressChart() {
  const { data: progressData = [], isLoading } = useFlashcardProgress();

  const chartData = progressData.map((item) => ({
    status: item.status,
    count: item.count,
    fill: `var(--color-${item.status})`,
  }));

  const totalCards = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  // Calculate retention statistics
  const stats = React.useMemo(() => {
    const masteredCount =
      progressData.find((d) => d.status === "review")?.count || 0;
    const learningCount =
      progressData.find((d) => d.status === "learning")?.count || 0;
    const retentionRate =
      totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

    return { masteredCount, learningCount, retentionRate };
  }, [progressData, totalCards]);

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (totalCards === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-center text-muted-foreground text-sm">
          No flashcard data yet.
          <br />
          Start reviewing flashcards to see your progress!
        </p>
      </div>
    );
  }

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[300px] w-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground font-bold text-3xl"
                      >
                        {totalCards.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Cards
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* Enhanced Statistics Footer */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Retention Rate Card */}
        <div className="group relative overflow-hidden rounded-lg border bg-gradient-to-br from-emerald-500/10 to-green-500/10 p-4 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">
                Retention Rate
              </p>
              <div className="flex items-baseline gap-2">
                <span className="bg-gradient-to-br from-emerald-600 to-green-600 bg-clip-text font-bold text-2xl text-transparent dark:from-emerald-400 dark:to-green-400">
                  {stats.retentionRate}%
                </span>
              </div>
            </div>
            <div className="rounded-full bg-emerald-500/20 p-2">
              <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Mastered Cards Card */}
        <div className="group relative overflow-hidden rounded-lg border bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-4 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">
                Mastered
              </p>
              <div className="flex items-baseline gap-2">
                <span className="bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text font-bold text-2xl text-transparent dark:from-violet-400 dark:to-purple-400">
                  {stats.masteredCount}
                </span>
                <span className="text-muted-foreground text-xs">cards</span>
              </div>
            </div>
            <div className="rounded-full bg-violet-500/20 p-2">
              <Award className="size-4 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </div>

        {/* Total Cards Card */}
        <div className="group relative overflow-hidden rounded-lg border bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">
                Total Cards
              </p>
              <div className="flex items-baseline gap-2">
                <span className="bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text font-bold text-2xl text-transparent dark:from-amber-400 dark:to-orange-400">
                  {totalCards}
                </span>
                <span className="text-muted-foreground text-xs">cards</span>
              </div>
            </div>
            <div className="rounded-full bg-amber-500/20 p-2">
              <Target className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
