"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";
import { ActivityCalendar } from "@/features/statistics/components/activity-calendar";
import { StatisticsService } from "@/features/statistics/services/statistics-service";
import { createClient } from "@/lib/supabase/client";
import { useProfile, useUserAchievements } from "../hooks";
import { ProfileHeader } from "./profile-header";
import { ProfileStatsGrid } from "./profile-stats-grid";

export function ProfileView() {
  const { user } = useAuth();
  const { data: achievements } = useUserAchievements();
  const { data: profile } = useProfile();

  // Fetch focus metrics for productivity insights
  const { data: focusMetrics } = useQuery({
    queryKey: ["focus-metrics", user?.id],
    queryFn: () => StatisticsService.getFocusMetrics(user?.id ?? ""),
    enabled: !!user,
  });

  // Fetch quiz attempts count
  const { data: quizAttemptCount } = useQuery({
    queryKey: ["quiz-attempts-count", user?.id],
    queryFn: async () => {
      const supabase = createClient();
      const { count } = await supabase
        .from("quiz_attempts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id ?? "");
      return count || 0;
    },
    enabled: !!user,
  });

  // Calculate avg daily time
  const formatAvgDailyTime = () => {
    const totalMinutes = profile?.total_study_minutes || 0;
    const consistency = focusMetrics?.consistency || 0;
    // Estimate active days based on consistency (last 30 days)
    const activeDays = Math.max(1, Math.round((consistency / 100) * 30));
    const avgMinutes = Math.round(totalMinutes / activeDays);
    const h = Math.floor(avgMinutes / 60);
    const m = avgMinutes % 60;
    return `${h}h ${m}m`;
  };

  // Rarity rank for sorting
  const rarityRank: Record<string, number> = {
    Legendary: 4,
    Epic: 3,
    Rare: 2,
    Common: 1,
  };

  const unlockedAchievements = (achievements || [])
    .filter((a) => a.unlocked)
    .sort((a, b) => (rarityRank[b.rarity] || 0) - (rarityRank[a.rarity] || 0));

  const topAchievements = unlockedAchievements.slice(0, 5);
  const moreCount = unlockedAchievements.length - topAchievements.length;

  return (
    <div className="min-h-screen bg-background pb-12">
      <ProfileHeader />

      <div className="container mx-auto mt-8 max-w-6xl space-y-8 px-4 md:px-6">
        {/* Stats Grid */}
        <ProfileStatsGrid />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left/Middle Column: Calendar & Detailed Stats */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="overflow-hidden border-none bg-secondary/50 shadow-none backdrop-blur-sm">
              <CardContent className="p-6">
                <ActivityCalendar />
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none bg-secondary/50 shadow-none backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="size-5" />
                  Productivity Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                  <div>
                    <div className="font-bold text-2xl">
                      {formatAvgDailyTime()}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Avg daily time
                    </p>
                  </div>
                  <div>
                    <div className="font-bold text-2xl">
                      {focusMetrics?.focusQuality || 0}%
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Focus quality
                    </p>
                  </div>
                  <div>
                    <div className="font-bold text-2xl">
                      {quizAttemptCount || 0}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Quizzes done
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Achievements Summary */}
          <div className="space-y-6">
            <Card className="h-full overflow-hidden border-none bg-secondary/50 shadow-none backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="size-5" />
                  Achievements
                  {unlockedAchievements.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {unlockedAchievements.length} unlocked
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topAchievements.length > 0 ? (
                    <>
                      {topAchievements.map((ach) => (
                        <div
                          key={ach.id}
                          className="flex items-center gap-3 rounded-xl bg-primary/5 p-3 transition-colors hover:bg-primary/10"
                        >
                          <div className="rounded-full bg-primary/10 p-2 text-lg">
                            {ach.icon || "✨"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{ach.title}</p>
                              <Badge
                                variant="outline"
                                className={`h-4 border-none py-0 text-[10px] uppercase ${
                                  ach.rarity === "Epic" ||
                                  ach.rarity === "Legendary"
                                    ? "bg-purple-500/10 text-purple-600"
                                    : ach.rarity === "Rare"
                                      ? "bg-blue-500/10 text-blue-600"
                                      : "bg-gray-500/10 text-gray-600"
                                }`}
                              >
                                {ach.rarity}
                              </Badge>
                            </div>
                            <p className="line-clamp-1 text-[11px] text-muted-foreground">
                              {ach.description}
                            </p>
                          </div>
                        </div>
                      ))}
                      {moreCount > 0 && (
                        <p className="py-2 text-center font-medium text-muted-foreground text-xs">
                          + {moreCount} more achievements
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="mb-3 rounded-full bg-muted p-4">
                        <Award className="size-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        No achievements unlocked yet
                      </p>
                      <p className="mt-1 text-muted-foreground text-xs">
                        Keep studying to earn badges!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
