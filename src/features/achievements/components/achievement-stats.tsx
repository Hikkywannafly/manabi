import { Star, Target, Trophy, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AchievementWithProgress } from "@/services/achievement-service";

interface AchievementStatsProps {
  achievements: AchievementWithProgress[];
  isLoading?: boolean;
}

export function AchievementStats({
  achievements,
  isLoading,
}: AchievementStatsProps) {
  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-secondary/50">
            <CardContent className="flex h-32 animate-pulse items-center justify-between p-6">
              <div className="space-y-3">
                <div className="h-4 w-24 rounded bg-muted-foreground/20" />
                <div className="h-8 w-16 rounded bg-muted-foreground/20" />
                <div className="h-3 w-32 rounded bg-muted-foreground/20" />
              </div>
              <div className="size-8 rounded-full bg-muted-foreground/20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const unlocked = achievements.filter((a) => a.unlocked);
  const total = achievements.length;
  const percentage =
    total > 0 ? Math.round((unlocked.length / total) * 100) : 0;

  const xpEarned = unlocked.reduce((acc, curr) => acc + curr.xp_reward, 0);

  // Find rarest unlocked
  const rarityWeight = { Legendary: 4, Epic: 3, Rare: 2, Common: 1 };
  const rarest = [...unlocked].sort(
    (a, b) => rarityWeight[b.rarity] - rarityWeight[a.rarity],
  )[0];

  // Calculate recent progress (arbitrary metric for now, e.g. highest progress not unlocked)
  const inProgress = achievements.filter((a) => !a.unlocked && a.progress > 0);
  const closest = inProgress.sort(
    (a, b) => b.progress_percentage - a.progress_percentage,
  )[0];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
      {/* Total Unlocked */}
      <Card className="bg-secondary/50">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-muted-foreground text-sm">Total Unlocked</p>
            <p className="font-bold text-2xl">
              {unlocked.length}/{total}
            </p>
            <p className="text-muted-foreground text-sm">
              {percentage}% Complete
            </p>
          </div>
          <Trophy className="h-8 w-8 text-yellow-500" />
        </CardContent>
      </Card>

      {/* XP Earned */}
      <Card className="bg-secondary/50">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-muted-foreground text-sm">XP Earned</p>
            <p className="font-bold text-2xl">{xpEarned}</p>
            <p className="text-muted-foreground text-sm">From achievements</p>
          </div>
          <Zap className="h-8 w-8 text-blue-500" />
        </CardContent>
      </Card>

      {/* Rarest Unlocked */}
      <Card className="bg-secondary/50">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-muted-foreground text-sm">Rarest Unlocked</p>
            {rarest ? (
              <div className="mt-1">
                <p
                  className={`font-semibold text-lg ${
                    rarest.rarity === "Legendary"
                      ? "text-orange-500"
                      : rarest.rarity === "Epic"
                        ? "text-purple-500"
                        : rarest.rarity === "Rare"
                          ? "text-blue-500"
                          : "text-gray-500"
                  }`}
                >
                  {rarest.rarity}
                </p>
              </div>
            ) : (
              <p className="font-semibold text-lg text-muted-foreground">-</p>
            )}
          </div>
          <Star className="h-8 w-8 text-purple-500" />
        </CardContent>
      </Card>

      {/* Recent Progress */}
      <Card className="bg-secondary/50">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-muted-foreground text-sm">Working On</p>
            <div className="mt-1">
              {closest ? (
                <div>
                  <p className="w-32 truncate font-medium text-sm">
                    {closest.title}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {closest.progress_percentage}% complete
                  </p>
                </div>
              ) : (
                <p className="font-medium text-sm">No active goals</p>
              )}
            </div>
          </div>
          <Target className="h-8 w-8 text-green-500" />
        </CardContent>
      </Card>
    </div>
  );
}
