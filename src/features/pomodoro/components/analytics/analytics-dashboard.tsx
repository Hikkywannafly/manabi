"use client";

import { BarChart3, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Heatmap } from "./heatmap";
import { SessionChart } from "./session-chart";
import { StatsOverview } from "./stats-overview";

interface AnalyticsDashboardProps {
  userId?: string;
  className?: string;
}

export function AnalyticsDashboard({
  userId,
  className,
}: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold font-heading text-2xl text-white">
            Analytics
          </h2>
          <p className="text-sm text-white/60">
            Track your productivity and progress
          </p>
        </div>

        {/* Period selector */}
        <div className="flex gap-2">
          <Button
            variant={period === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("today")}
            className={cn(
              period === "today"
                ? "bg-white/10 text-white hover:bg-white/20"
                : "border-white/10 text-white/60 hover:bg-white/5 hover:text-white",
            )}
          >
            Today
          </Button>
          <Button
            variant={period === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("week")}
            className={cn(
              period === "week"
                ? "bg-white/10 text-white hover:bg-white/20"
                : "border-white/10 text-white/60 hover:bg-white/5 hover:text-white",
            )}
          >
            Week
          </Button>
          <Button
            variant={period === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("month")}
            className={cn(
              period === "month"
                ? "bg-white/10 text-white hover:bg-white/20"
                : "border-white/10 text-white/60 hover:bg-white/5 hover:text-white",
            )}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview userId={userId} period={period} />

      {/* Tabs for different views */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5">
          <TabsTrigger
            value="chart"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Chart
          </TabsTrigger>
          <TabsTrigger
            value="heatmap"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Heatmap
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="mt-6">
          <SessionChart
            userId={userId}
            period={period === "today" ? "week" : period}
          />
        </TabsContent>

        <TabsContent value="heatmap" className="mt-6">
          <div className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm">
            <Heatmap userId={userId} />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm">
            <h3 className="mb-4 font-semibold text-white">
              Productivity Insights
            </h3>
            <div className="space-y-4 text-sm text-white/70">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium text-white">Peak Hours</span>
                </div>
                <p>
                  Your most productive hours are typically between 9 AM - 12 PM.
                  Schedule your most important tasks during this time.
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="font-medium text-white">Consistency</span>
                </div>
                <p>
                  You've maintained a{" "}
                  {period === "today"
                    ? "daily"
                    : period === "week"
                      ? "weekly"
                      : "monthly"}{" "}
                  streak! Keep it up to build lasting habits.
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="font-medium text-white">Break Balance</span>
                </div>
                <p>
                  Remember to take regular breaks. Studies show that breaks
                  improve focus and prevent burnout.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
