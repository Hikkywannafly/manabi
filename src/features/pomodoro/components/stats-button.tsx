"use client";

import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useStatsStore } from "@/stores/use-stats-store";
import { useTimerStore } from "@/stores/use-timer-store";

interface StatsButtonProps {
  className?: string;
}

export function StatsButton({ className }: StatsButtonProps) {
  const { streak } = useStatsStore();
  const { sessionCount, duration } = useTimerStore();

  // Calculate focus time based on completed sessions * duration
  // This is a rough estimate for the "session" view. Real stats come from DB via useStatsStore if we fetch them.
  // For "Today's Stats" in the button, we ideally want the DB stats.
  // Let's rely on useStatsStore for streak and maybe assume we fetch daily stats there too?
  // Actually, useStatsStore currently only has 'streak'.
  // Let's check if we can add daily stats to useStatsStore or just use sessionCount from local store for now as "current session" context.
  // For better accuracy, let's use the local session count for "Today" if we reset it daily, but sessionCount in PomodoroStore might be just for the current "run".

  // Pivot: Let's fetch real daily stats here or in the store.
  // I will use a simple implementation accessing the store's streak, and for now just show sessionCount as "Sessions".
  // Ideal: Update useStatsStore to hold 'dailyStats'.

  // For this step, I'll stick to what we have:
  // Focus Time: sessionCount * duration (approx)
  // Streak: from store

  const focusTimeMinutes = Math.round((sessionCount * duration) / 60);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-10 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/40 sm:size-12",
            className,
          )}
          title="Statistics"
        >
          <BarChart3 className="size-5 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[350px] border-white/10 bg-black/70 text-white backdrop-blur-xl"
        align="end"
      >
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Current Session Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Focus Time (Est.)</span>
              <span className="font-bold">{focusTimeMinutes} mins</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Completed Sessions</span>
              <span className="font-bold">{sessionCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Current Streak</span>
              <div className="flex items-center gap-1">
                <span className="text-lg">🔥</span>
                <span className="font-bold">{streak} days</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
