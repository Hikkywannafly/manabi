"use client";

import { Award } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserAchievements } from "@/features/profile/hooks";
import type { AchievementCategory } from "@/services/achievement-service";
import { AchievementCard } from "./achievement-card";

const categories: { value: AchievementCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "Study", label: "Study" },
  { value: "Creation", label: "Creation" },
  { value: "Performance", label: "Performance" },
  { value: "Streak", label: "Streak" },
  { value: "Social", label: "Social" },
];

export function ProfileAwards() {
  const { data: achievements, isLoading, error } = useUserAchievements();

  if (isLoading) {
    return <ProfileAwardsSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load achievements. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Only show unlocked achievements
  const unlockedAchievements = achievements?.filter((a) => a.unlocked) || [];

  return (
    <div className="fade-in animate-in space-y-8 duration-500">
      {/* Category Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="scrollbar-none h-auto w-full justify-start gap-2 overflow-x-auto bg-transparent p-0">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              className="rounded-full border px-4 py-1.5 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => {
          const filtered =
            cat.value === "all"
              ? unlockedAchievements
              : unlockedAchievements.filter((a) => a.category === cat.value);

          return (
            <TabsContent
              key={cat.value}
              value={cat.value}
              className="mt-8 outline-none"
            >
              {filtered.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {filtered.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-4 py-12 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Award className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <h4 className="font-semibold text-lg">No awards yet</h4>
                  <p className="mx-auto mt-2 max-w-[280px] text-muted-foreground text-sm">
                    You haven't unlocked any achievements in this category yet.
                    Keep learning to earn your first badge!
                  </p>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function ProfileAwardsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
