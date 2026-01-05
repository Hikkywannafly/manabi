"use client";

import { Bar, BarChart, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useWeeklyStudyHours } from "../hooks/use-statistics";

const chartConfig = {
  quiz: {
    label: "Quiz",
    color: "hsl(330, 81%, 60%)", // Vibrant pink
  },
  flashcard: {
    label: "Flashcard",
    color: "hsl(271, 91%, 65%)", // Vibrant purple
  },
  pomodoro: {
    label: "Pomodoro",
    color: "hsl(24, 95%, 53%)", // Vibrant orange
  },
} satisfies ChartConfig;

export function WeeklyStudyHoursChart() {
  const { data: weeklyData = [], isLoading } = useWeeklyStudyHours();

  // Convert minutes to hours
  const chartData = weeklyData.map((d) => ({
    day: d.day,
    quiz: Math.round((d.quiz / 60) * 10) / 10,
    flashcard: Math.round((d.flashcard / 60) * 10) / 10,
    pomodoro: Math.round((d.pomodoro / 60) * 10) / 10,
  }));

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="pomodoro"
          stackId="a"
          fill="var(--color-pomodoro)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="quiz"
          stackId="a"
          fill="var(--color-quiz)"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="flashcard"
          stackId="a"
          fill="var(--color-flashcard)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
