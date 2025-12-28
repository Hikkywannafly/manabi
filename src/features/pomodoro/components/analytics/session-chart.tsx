"use client";

import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ChartData {
  label: string;
  focus: number;
  shortBreak: number;
  longBreak: number;
}

interface SessionChartProps {
  userId?: string;
  period?: "week" | "month";
  className?: string;
}

export function SessionChart({
  userId,
  period = "week",
  className,
}: SessionChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChartData = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) return;

      const now = new Date();
      const days = period === "week" ? 7 : 30;
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - days);

      const { data: sessions, error } = await supabase
        .from("pomodoro_sessions")
        .select("start_time, mode")
        .eq("user_id", targetUserId)
        .gte("start_time", startDate.toISOString())
        .order("start_time", { ascending: true });

      if (error) throw error;

      // Group by day
      const dailyMap = new Map<
        string,
        { focus: number; shortBreak: number; longBreak: number }
      >();

      sessions?.forEach((session) => {
        const date = new Date(session.start_time).toISOString().split("T")[0];
        const current = dailyMap.get(date) || {
          focus: 0,
          shortBreak: 0,
          longBreak: 0,
        };

        if (session.mode === "focus") current.focus++;
        else if (session.mode === "short_break") current.shortBreak++;
        else if (session.mode === "long_break") current.longBreak++;

        dailyMap.set(date, current);
      });

      // Generate chart data
      const chartData: ChartData[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const label =
          period === "week"
            ? date.toLocaleDateString("en-US", { weekday: "short" })
            : date.getDate().toString();

        const dayData = dailyMap.get(dateStr) || {
          focus: 0,
          shortBreak: 0,
          longBreak: 0,
        };

        chartData.push({
          label,
          ...dayData,
        });
      }

      setData(chartData);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, period]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  if (isLoading) {
    return <Skeleton className={cn("h-64 w-full", className)} />;
  }

  const maxValue = Math.max(
    ...data.map((d) => d.focus + d.shortBreak + d.longBreak),
    1,
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mb-6">
        <h3 className="font-semibold text-white">Session Activity</h3>
        <p className="text-sm text-white/50">
          Sessions completed over the last{" "}
          {period === "week" ? "7 days" : "30 days"}
        </p>
      </div>

      <div className="space-y-4">
        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-blue-500" />
            <span className="text-white/70">Focus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-green-500" />
            <span className="text-white/70">Short Break</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-purple-500" />
            <span className="text-white/70">Long Break</span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex h-48 items-end gap-2">
          {data.map((item, index) => {
            const total = item.focus + item.shortBreak + item.longBreak;
            const focusHeight = (item.focus / maxValue) * 100;
            const shortBreakHeight = (item.shortBreak / maxValue) * 100;
            const longBreakHeight = (item.longBreak / maxValue) * 100;

            return (
              <div
                key={index}
                className="group flex flex-1 flex-col items-center gap-2"
              >
                {/* Stacked bars */}
                <div
                  className="relative flex w-full flex-col items-center justify-end"
                  style={{ height: "100%" }}
                >
                  {total > 0 && (
                    <div className="relative w-full">
                      {/* Long Break */}
                      {item.longBreak > 0 && (
                        <div
                          className="w-full rounded-t-sm bg-purple-500 transition-all duration-300 group-hover:bg-purple-400"
                          style={{ height: `${longBreakHeight}px` }}
                        />
                      )}
                      {/* Short Break */}
                      {item.shortBreak > 0 && (
                        <div
                          className={cn(
                            "w-full bg-green-500 transition-all duration-300 group-hover:bg-green-400",
                            item.longBreak === 0 && "rounded-t-sm",
                          )}
                          style={{ height: `${shortBreakHeight}px` }}
                        />
                      )}
                      {/* Focus */}
                      {item.focus > 0 && (
                        <div
                          className={cn(
                            "w-full bg-blue-500 transition-all duration-300 group-hover:bg-blue-400",
                            item.shortBreak === 0 &&
                              item.longBreak === 0 &&
                              "rounded-t-sm",
                          )}
                          style={{ height: `${focusHeight}px` }}
                        />
                      )}
                    </div>
                  )}

                  {/* Tooltip */}
                  <div className="-top-16 -translate-x-1/2 pointer-events-none absolute left-1/2 z-10 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-3 py-2 text-white text-xs opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-white/70">Focus: {item.focus}</div>
                    <div className="text-white/70">
                      Short: {item.shortBreak}
                    </div>
                    <div className="text-white/70">Long: {item.longBreak}</div>
                  </div>
                </div>

                {/* Label */}
                <span className="text-center text-white/50 text-xs">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
