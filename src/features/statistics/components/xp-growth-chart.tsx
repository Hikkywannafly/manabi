"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useXPGrowth } from "../hooks/use-statistics";

const chartConfig = {
  mission: {
    label: "Mission",
    color: "hsl(271, 91%, 65%)", // Vibrant purple
  },
  achievement: {
    label: "Achievement",
    color: "hsl(24, 95%, 53%)", // Vibrant orange
  },
  quiz: {
    label: "Quiz",
    color: "hsl(330, 81%, 60%)", // Vibrant pink
  },
} satisfies ChartConfig;

export function XPGrowthChart() {
  const { data: xpData = [], isLoading } = useXPGrowth(30);

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (xpData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-center text-muted-foreground text-sm">
          No XP data yet.
          <br />
          Complete missions and quizzes to start earning XP!
        </p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart
        data={xpData}
        margin={{
          top: 10,
          right: 10,
          left: -20,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
          }
        />
        <defs>
          <linearGradient id="fillMission" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--chart-1))"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--chart-1))"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillAchievement" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--chart-2))"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--chart-2))"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillQuiz" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--chart-3))"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--chart-3))"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="mission"
          stackId="1"
          stroke="hsl(var(--chart-1))"
          fill="url(#fillMission)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="achievement"
          stackId="1"
          stroke="hsl(var(--chart-2))"
          fill="url(#fillAchievement)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="quiz"
          stackId="1"
          stroke="hsl(var(--chart-3))"
          fill="url(#fillQuiz)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
