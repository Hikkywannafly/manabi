import { useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-provider";
import { achievementService } from "@/services/achievement-service";

export function useAchievementNotifier() {
  const { user } = useAuth();

  const checkAchievements = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { unlocked } = await achievementService.checkAndUnlockAchievements(
        user.id,
      );

      // Notify for unlocked achievements
      unlocked.forEach((ach) => {
        toast.success(`Achievement Unlocked: ${ach.title}!`, {
          description: `You earned ${ach.xp_reward} XP. ${ach.description}`,
          duration: 5000,
          // icon: ach.icon // If sonner supports custom icon or we put it in description
        });
      });

      // Notify for near misses (Optional: limit frequency or only show for Epic/Legendary)
      // For now, let's only notify if they are VERY close (e.g. 1 step away) or just show a consolidated message
      // To avoid spam, maybe we rely on the Dashboard for near misses, or only show if it's a "significant" milestone.
      // Let's comment this out for now to avoid spam, or implement a "smart" notifier later.
      /*
      nearMiss.forEach(ach => {
          if (ach.rarity === 'Legendary' || ach.rarity === 'Epic') {
             toast.info(`So close to ${ach.title}!`, {
                 description: `${ach.progress}/${ach.total_steps} steps complete. Keep going!`,
             });
          }
      })
      */
    } catch (error) {
      console.error("Failed to check achievements", error);
    }
  }, [user?.id]);

  return { checkAchievements };
}
