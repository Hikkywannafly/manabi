"use client";

import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAuth } from "@/contexts/auth-provider";
import { StatisticsService } from "../services/statistics-service";

const chartConfig = {
  efficiency: {
    label: "Efficiency",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function HourlyEfficiencyChart() {
  const { user } = useAuth();

  const { data: hourlyData = [] } = useQuery({
    queryKey: ["hourly-efficiency", user?.id],
    queryFn: () => StatisticsService.getHourlyEfficiency(user?.id ?? ""),
    enabled: !!user,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Hourly Study Efficiency</h3>
        <Info className="size-4 text-muted-foreground" />
      </div>

      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <AreaChart
          data={hourlyData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              // Show only 00:00, 04:00, 08:00, 12:00, 16:00, 20:00
              const hour = Number.parseInt(value.split(":")[0], 10);
              return hour % 4 === 0 ? value : "";
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            ticks={[0, 25, 50, 75, 100]}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="line"
                labelFormatter={(value) => `Time: ${value}`}
              />
            }
          />
          <defs>
            <linearGradient id="fillEfficiency" x1="0" y1="0" x2="0" y2="1">
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
          </defs>
          <Area
            type="monotone"
            dataKey="efficiency"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            fill="url(#fillEfficiency)"
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
