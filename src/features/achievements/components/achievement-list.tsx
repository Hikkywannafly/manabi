import type { AchievementWithProgress } from "@/services/achievement-service";
import { AchievementCard } from "./achievement-card";

interface AchievementListProps {
  achievements: AchievementWithProgress[];
  isLoading?: boolean;
}

export function AchievementList({
  achievements,
  isLoading,
}: AchievementListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-lg border bg-muted/20"
          />
        ))}
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <p className="mb-2 font-semibold text-xl">No achievements found</p>
        <p className="text-muted-foreground">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
}
