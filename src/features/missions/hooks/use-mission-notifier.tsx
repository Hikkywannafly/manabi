import { Sparkles } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-provider";
import { MissionService } from "@/services/mission-service";

export function useMissionNotifier() {
  const { user } = useAuth();

  const checkMissions = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { completed } = await MissionService.checkAndCompleteMissions(
        user.id,
      );

      // Show inline toast for each completed mission
      for (const mission of completed) {
        toast.success(mission.mission.title, {
          description: (
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-amber-500" />
              <span className="font-medium text-amber-500">
                +{mission.mission.xp_reward || 0} XP earned
              </span>
            </div>
          ),
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Failed to check missions", error);
    }
  }, [user?.id]);

  return { checkMissions };
}
