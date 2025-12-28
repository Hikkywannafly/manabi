"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-provider";
import { DashboardService } from "../services/dashboard-service";

export function useDashboardStats() {
  const { user } = useAuth();

  const statsQuery = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: () => DashboardService.getStats(user?.id ?? ""),
    enabled: !!user,
  });

  const missionsQuery = useQuery({
    queryKey: ["dashboard-missions", user?.id],
    queryFn: () => DashboardService.getMissions(user?.id ?? ""),
    enabled: !!user,
  });

  const notesQuery = useQuery({
    queryKey: ["dashboard-notes", user?.id],
    queryFn: () => DashboardService.getRecentNotes(user?.id ?? ""),
    enabled: !!user,
  });

  const leaderboardQuery = useQuery({
    queryKey: ["dashboard-leaderboard"],
    queryFn: () => DashboardService.getLeaderboard(),
  });

  const achievementsQuery = useQuery({
    queryKey: ["dashboard-achievements-recent", user?.id],
    queryFn: () => DashboardService.getRecentAchievements(user?.id ?? ""),
    enabled: !!user,
  });

  return {
    stats: statsQuery,
    missions: missionsQuery,
    notes: notesQuery,
    leaderboard: leaderboardQuery,
    recentAchievements: achievementsQuery,
    isLoading:
      statsQuery.isLoading ||
      missionsQuery.isLoading ||
      notesQuery.isLoading ||
      leaderboardQuery.isLoading ||
      achievementsQuery.isLoading,
  };
}
