"use client";

import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface DayData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface HeatmapProps {
  userId?: string;
  className?: string;
}

export function Heatmap({ userId, className }: HeatmapProps) {
  const [data, setData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  const fetchYearlyStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) return;

      // Get sessions from the last year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data: sessions, error } = await supabase
        .from("pomodoro_sessions")
        .select("start_time, mode, duration_minutes")
        .eq("user_id", targetUserId)
        .gte("start_time", oneYearAgo.toISOString())
        .order("start_time", { ascending: true });

      if (error) throw error;

      // Process data into daily counts
      const dailyMap = new Map<string, number>();

      sessions?.forEach((session) => {
        const date = new Date(session.start_time).toISOString().split("T")[0];
        const current = dailyMap.get(date) || 0;
        // Only count focus sessions
        if (session.mode === "focus") {
          dailyMap.set(date, current + 1);
        }
      });

      // Generate all days for the last year
      const days: DayData[] = [];
      const today = new Date();
      for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const count = dailyMap.get(dateStr) || 0;

        // Calculate level (0-4) based on session count
        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count > 0) level = 1;
        if (count >= 2) level = 2;
        if (count >= 4) level = 3;
        if (count >= 6) level = 4;

        days.push({ date: dateStr, count, level });
      }

      setData(days);
    } catch (error) {
      console.error("Failed to fetch yearly stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchYearlyStats();
  }, [fetchYearlyStats]);

  const getLevelColor = (level: number) => {
    const colors = {
      0: "bg-white/5",
      1: "bg-green-500/20",
      2: "bg-green-500/40",
      3: "bg-green-500/60",
      4: "bg-green-500/80",
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Group days by week
  const weeks: DayData[][] = [];
  let currentWeek: DayData[] = [];

  // Add empty cells for the first week to align with Sunday
  const firstDay = new Date(data[0]?.date);
  const firstDayOfWeek = firstDay.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: "", count: 0, level: 0 });
  }

  data.forEach((day, _index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Add remaining days to last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: 0, level: 0 });
    }
    weeks.push(currentWeek);
  }

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className={cn("relative", className)}>
      <div className="mb-4">
        <h3 className="font-semibold text-white">Activity Heatmap</h3>
        <p className="text-sm text-white/50">
          {data.filter((d) => d.count > 0).length} days active in the last year
        </p>
      </div>

      <div className="relative overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="mb-2 flex gap-1 pl-8">
            {monthLabels.map((month, i) => (
              <div key={i} className="flex-1 text-center text-white/40 text-xs">
                {month}
              </div>
            ))}
          </div>

          {/* Day labels */}
          <div className="flex gap-1">
            <div className="flex flex-col justify-around pr-2 text-white/40 text-xs">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Heatmap grid */}
            <div className="flex flex-1 gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      role={day.date ? "button" : "presentation"}
                      tabIndex={day.date ? 0 : -1}
                      className={cn(
                        "h-3 w-3 rounded-sm transition-all duration-200",
                        day.date
                          ? cn(
                              getLevelColor(day.level),
                              "cursor-pointer hover:ring-1 hover:ring-white/50",
                            )
                          : "bg-transparent",
                      )}
                      {...(day.date && {
                        onMouseEnter: () => setHoveredDay(day),
                        onMouseLeave: () => setHoveredDay(null),
                        onKeyDown: (e: React.KeyboardEvent) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setHoveredDay(day);
                          }
                        },
                      })}
                      title={
                        day.date
                          ? `${day.date}: ${day.count} session${day.count !== 1 ? "s" : ""}`
                          : ""
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-2 text-white/40 text-xs">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn("h-3 w-3 rounded-sm", getLevelColor(level))}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div className="pointer-events-none fixed z-50 rounded-md border border-white/10 bg-black/90 px-3 py-2 text-sm text-white shadow-lg backdrop-blur-sm">
          <div className="font-medium">{hoveredDay.date}</div>
          <div className="text-white/70">
            {hoveredDay.count} session{hoveredDay.count !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
