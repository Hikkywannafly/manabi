"use client";

import { Flame, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { getBestStreak, getCurrentStreak } from "../services/timer-service";

export function StreakCard() {
  const { isStreakOpen } = usePomodoroStore();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStreakData = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const [current, best] = await Promise.all([
            getCurrentStreak(user.id),
            getBestStreak(user.id),
          ]);
          setCurrentStreak(current);
          setBestStreak(best);
        }
      } catch (error) {
        console.error("Failed to fetch streak data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isStreakOpen) {
      fetchStreakData();
    }
  }, [isStreakOpen]);

  if (!isStreakOpen) return null;

  return (
    <div className="absolute bottom-0 left-0 z-50 translate-y-[calc(-100%-1rem)] px-4 transition-all duration-300">
      <div className="w-[350px] max-w-full rounded-xl border border-white/10 bg-black/70 p-6 shadow-2xl backdrop-blur-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1 text-left">
              <h2 className="font-bold text-white/90 text-xl">You are on</h2>
              <div className="font-black font-title text-4xl text-white">
                {isLoading ? "..." : currentStreak}
              </div>
              <span className="text-lg text-white/50">streak days</span>
            </div>
            <div className="flex flex-1 justify-end">
              <div className="flex size-16 items-center justify-center rounded-full bg-orange-500/20">
                <Flame className="size-10 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
            <span className="text-white/80">Best Streak</span>
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-yellow-500" />
              <span className="font-bold text-white">
                {isLoading ? "..." : bestStreak} days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
