import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AchievementWithProgress } from "@/services/achievement-service";

interface AchievementCardProps {
  achievement: AchievementWithProgress;
}

const rarityColors = {
  Common:
    "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800",
  Rare: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  Epic: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Legendary:
    "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
};

const rarityBorders = {
  Common: "border-border",
  Rare: "border-blue-200 dark:border-blue-800",
  Epic: "border-purple-200 dark:border-purple-800",
  Legendary: "border-orange-200 dark:border-orange-800",
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  const isUnlocked = achievement.unlocked;
  const progress = achievement.progress_percentage;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border p-6 transition-all duration-300",
        isUnlocked
          ? "bg-card text-card-foreground shadow-sm hover:shadow-md"
          : "bg-muted/50 text-muted-foreground opacity-80",
        isUnlocked && achievement.rarity === "Epic" && "shadow-purple-500/10",
        isUnlocked &&
          achievement.rarity === "Legendary" &&
          "shadow-orange-500/10",
        // Apply specific border colors if desired, or keep uniform
        isUnlocked ? rarityBorders[achievement.rarity] : "border-muted",
      )}
    >
      {/* Background Glow for high rarity */}
      {isUnlocked &&
        (achievement.rarity === "Epic" ||
          achievement.rarity === "Legendary") && (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 opacity-5",
              achievement.rarity === "Epic" ? "bg-purple-500" : "bg-orange-500",
            )}
          />
        )}

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg text-3xl",
                  isUnlocked ? "bg-background/80" : "bg-muted grayscale",
                )}
              >
                {achievement.icon}
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-lg leading-none">
                  {achievement.title}
                </h3>
                <p className="font-medium text-muted-foreground text-xs">
                  {achievement.category} • {achievement.xp_reward} XP
                </p>
              </div>
            </div>
            {isUnlocked ? (
              <div className="rounded-full bg-green-100 p-1 dark:bg-green-900/30">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="rounded-full bg-muted p-1">
                <Lock className="h-4 w-4 opacity-50" />
              </div>
            )}
          </div>

          <p className="mb-4 text-muted-foreground text-sm">
            {achievement.description}
          </p>
        </div>

        <div className="mt-2">
          {!isUnlocked ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Progress</span>
                <span>
                  {achievement.progress} / {achievement.total_steps}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 font-semibold text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  rarityColors[achievement.rarity],
                )}
              >
                {achievement.rarity.toUpperCase()}
              </span>
              <span className="text-muted-foreground text-xs">
                Unlocked{" "}
                {achievement.unlocked_at
                  ? new Date(achievement.unlocked_at).toLocaleDateString()
                  : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
