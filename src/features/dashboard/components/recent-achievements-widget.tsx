"use client";

import { Trophy } from "lucide-react";
import Link from "next/link";
import type { RecentAchievement } from "../services/dashboard-service";

interface RecentAchievementsWidgetProps {
  achievements: RecentAchievement[];
}

export function RecentAchievementsWidget({
  achievements,
}: RecentAchievementsWidgetProps) {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm dark:from-amber-950/20 dark:to-orange-950/20">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-amber-500" />
          <h2 className="font-semibold text-foreground text-lg">
            Just Unlocked
          </h2>
        </div>
        <Link
          href="/dashboard/achievements"
          className="text-muted-foreground text-xs hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {achievements.map((item) => {
          const ach = item.achievement;

          if (!ach) return null;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-md bg-background/60 p-2 backdrop-blur-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                {/* Simple Icon placeholder if none provided */}
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400">
                  {ach.icon && ach.icon.length < 5 ? (
                    <span className="text-lg">{ach.icon}</span>
                  ) : (
                    <Trophy className="size-4" />
                  )}
                </div>
                <div className="truncate">
                  <p className="truncate font-medium text-sm">{ach.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(item.unlocked_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="shrink-0 font-bold text-amber-600 text-xs dark:text-amber-400">
                +{ach.xp_reward} XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
