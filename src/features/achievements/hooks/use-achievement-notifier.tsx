import { useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-provider";
import { achievementService } from "@/services/achievement-service";
import { AchievementNotification } from "../components/achievement-notification";

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
        toast.custom(
          (t) => <AchievementNotification achievement={ach} t={t} />,
          {
            duration: 5000,
            // Force the toast container itself to be full screen transparency to allow centering
            // Note: Sonner renders toasts in a list, so this might be tricky.
            // A better way is to move the Position logic to the Toaster for this specific ID, but that's hard.
            // Instead, we rely on the Component using `fixed inset-0` which we ALREADY did.
            // The issue is likely Sonner's container constricting it or `position: fixed` being relative to a transform.

            // Let's try to unstyle the toast wrapper completely
            unstyled: true,
            className:
              "w-full h-full flex items-center justify-center pointer-events-none",
          },
        );
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
