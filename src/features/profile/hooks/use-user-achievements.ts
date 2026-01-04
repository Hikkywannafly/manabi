"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-provider";
import { achievementService } from "@/services/achievement-service";

export function useUserAchievements() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-achievements", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      return achievementService.getAchievementsWithProgress(user.id);
    },
    enabled: !!user?.id,
  });
}
