"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useXPSourceBreakdown } from "../hooks/use-statistics";

const chartConfig = {
  amount: {
    label: "XP",
  },
  MISSION: {
    label: "Mission",
    color: "hsl(271, 91%, 65%)", // Vibrant purple
  },
  ACHIEVEMENT: {
    label: "Achievement",
    color: "hsl(24, 95%, 53%)", // Vibrant orange
  },
  QUIZ: {
    label: "Quiz",
    color: "hsl(330, 81%, 60%)", // Vibrant pink
  },
  STREAK: {
    label: "Streak",
    color: "hsl(160, 84%, 39%)", // Vibrant emerald
  },
  POMODORO: {
    label: "Pomodoro",
    color: "hsl(45, 93%, 47%)", // Vibrant amber
  },
} satisfies ChartConfig;

export function XPSourceBreakdown() {
  const { data: sourceData = [], isLoading } = useXPSourceBreakdown(30);

  const chartData = sourceData.map((item) => ({
    source: item.source,
    amount: item.amount,
    fill: `var(--color-${item.source})`,
  }));

  const totalXP = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (totalXP === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-center text-muted-foreground text-sm">
          No XP earned yet.
          <br />
          Complete activities to start earning XP!
        </p>
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="amount"
          nameKey="source"
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
                      {totalXP.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Total XP
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
