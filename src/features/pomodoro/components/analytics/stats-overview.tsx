"use client";

import { Clock, Target, TrendingUp, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { PomodoroSessionDB } from "../../services/timer-service";
import {
  calculateDailyStats,
  formatFocusTime,
  getProductivityScore,
} from "../../utils/stats-calculations";

interface StatsOverviewProps {
  userId?: string;
  period?: "today" | "week" | "month";
  className?: string;
}

export function StatsOverview({
  userId,
  period = "today",
  className,
}: StatsOverviewProps) {
  const [stats, setStats] = useState({
    focusTime: 0,
    completedSessions: 0,
    totalSessions: 0,
    completionRate: 0,
    productivityScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) return;

      // Calculate date range based on period
      const now = new Date();
      const startDate = new Date();

      switch (period) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setDate(now.getDate() - 30);
          break;
      }

      const { data: sessions, error } = await supabase
        .from("pomodoro_sessions")
        .select("*")
        .eq("user_id", targetUserId)
        .gte("start_time", startDate.toISOString())
        .order("start_time", { ascending: false });

      if (error) throw error;

      const dailyStats = calculateDailyStats(
        (sessions as PomodoroSessionDB[]) || [],
      );
      const productivityScore = getProductivityScore(dailyStats);

      setStats({
        ...dailyStats,
        productivityScore,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return (
      <div
        className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: Clock,
      label: "Focus Time",
      value: formatFocusTime(stats.focusTime),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Target,
      label: "Completed",
      value: `${stats.completedSessions}/${stats.totalSessions}`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: TrendingUp,
      label: "Completion Rate",
      value: `${stats.completionRate}%`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Zap,
      label: "Productivity",
      value: `${stats.productivityScore}`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-black/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="mb-1 text-sm text-white/60">{card.label}</p>
                <p className="font-bold text-2xl text-white">{card.value}</p>
              </div>
              <div
                className={cn(
                  "rounded-lg p-2 transition-transform duration-300 group-hover:scale-110",
                  card.bgColor,
                )}
              >
                <Icon className={cn("h-5 w-5", card.color)} />
              </div>
            </div>

            {/* Decorative gradient */}
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                card.bgColor,
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
