import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { statsService } from "@/services/stats-service";

function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  return userId;
}

export function useDailyStats() {
  const userId = useUserId();
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["stats", "daily", userId, today],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return statsService.getDailyStats(userId, today);
    },
    enabled: !!userId,
  });
}

export function useWeeklyStats() {
  const userId = useUserId();

  return useQuery({
    queryKey: ["stats", "weekly", userId],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return statsService.getWeeklyStats(userId);
    },
    enabled: !!userId,
  });
}

export function useMonthlyStats() {
  const userId = useUserId();

  return useQuery({
    queryKey: ["stats", "monthly", userId],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return statsService.getMonthlyStats(userId);
    },
    enabled: !!userId,
  });
}
