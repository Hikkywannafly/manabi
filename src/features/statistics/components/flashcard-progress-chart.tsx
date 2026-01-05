"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { status: "new", count: 5, fill: "var(--color-new)" },
  { status: "learning", count: 12, fill: "var(--color-learning)" },
  { status: "mastered", count: 8, fill: "var(--color-mastered)" },
];

const chartConfig = {
  count: {
    label: "Cards",
  },
  new: {
    label: "New",
    color: "hsl(220, 90%, 56%)", // Vibrant blue
  },
  learning: {
    label: "Learning",
    color: "hsl(45, 93%, 47%)", // Vibrant yellow/orange
  },
  mastered: {
    label: "Mastered",
    color: "hsl(142, 71%, 45%)", // Vibrant green
  },
} satisfies ChartConfig;

export function FlashcardProgressChart() {
  const totalCards = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

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
  );
}
