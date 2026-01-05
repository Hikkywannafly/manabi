"use client";

import { Area, AreaChart, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "2024-01-01", score: 30 },
  { date: "2024-01-02", score: 45 },
  { date: "2024-01-03", score: 20 },
  { date: "2024-01-04", score: 60 },
  { date: "2024-01-05", score: 75 },
  { date: "2024-01-06", score: 50 },
  { date: "2024-01-07", score: 85 },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function QuizPerformanceChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <AreaChart accessibilityLayer data={chartData}>
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
          dataKey="date"
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
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="score"
          type="natural"
          fill="url(#fillScore)"
          fillOpacity={0.4}
          stroke="var(--color-score)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
