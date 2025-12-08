"use client";

import { Globe, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLeaderboardStore } from "@/stores/use-leaderboard-store";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";

// Remove Mock Data

export function LeaderboardModal() {
  const { isLeaderboardOpen, toggleLeaderboard } = usePomodoroStore();
  const {
    daily,
    weekly,
    global,
    fetchDailyLeaderboard,
    fetchWeeklyLeaderboard,
    fetchGlobalLeaderboard,
    isLoading,
  } = useLeaderboardStore();
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "global">(
    "daily",
  );

  useEffect(() => {
    if (isLeaderboardOpen) {
      if (activeTab === "daily") fetchDailyLeaderboard();
      if (activeTab === "weekly") fetchWeeklyLeaderboard();
      if (activeTab === "global") fetchGlobalLeaderboard();
    }
  }, [
    isLeaderboardOpen,
    activeTab,
    fetchDailyLeaderboard,
    fetchWeeklyLeaderboard,
    fetchGlobalLeaderboard,
  ]);

  const currentData =
    activeTab === "daily" ? daily : activeTab === "weekly" ? weekly : global;

  if (!isLeaderboardOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-[800px] max-w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-2xl">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 text-white/60 hover:text-white"
          onClick={toggleLeaderboard}
        >
          <X className="size-6" />
        </Button>

        <div className="flex flex-col p-6 lg:p-8">
          {/* Header Controls */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-auto gap-2 border-white border-b-2 px-3 py-2 font-bold text-lg text-white hover:bg-transparent hover:text-white"
              >
                <Globe className="size-5" />
                Global
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl bg-white/5 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("daily")}
                  className={cn(
                    "h-7 rounded-lg px-3 hover:text-white",
                    activeTab === "daily"
                      ? "bg-white/10 font-bold text-white"
                      : "text-white/60",
                  )}
                >
                  Daily
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("weekly")}
                  className={cn(
                    "h-7 rounded-lg px-3 hover:text-white",
                    activeTab === "weekly"
                      ? "bg-white/10 font-bold text-white"
                      : "text-white/60",
                  )}
                >
                  Weekly
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("global")}
                  className={cn(
                    "h-7 rounded-lg px-3 hover:text-white",
                    activeTab === "global"
                      ? "bg-white/10 font-bold text-white"
                      : "text-white/60",
                  )}
                >
                  All Time
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto pr-2">
            {isLoading ? (
              <div className="text-center text-white/50">Loading...</div>
            ) : (
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-black/90 text-white/40 text-xs uppercase">
                  <tr>
                    <th className="w-8 py-3"></th>
                    <th className="w-12 py-3">#</th>
                    <th className="px-4 py-3">User</th>
                    <th className="py-3 text-right">Time (min)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {currentData.map((item) => (
                    <tr key={item.rank} className="group hover:bg-white/5">
                      <td className="py-3 pl-2">
                        {/* Trend icon placeholder */}
                      </td>
                      <td className="py-3 font-bold text-white">{item.rank}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 font-bold text-white text-xs">
                            {item.user.dataset.avatar_url ? (
                              <Image
                                src={item.user.dataset.avatar_url}
                                alt={item.user.dataset.full_name}
                                width={32}
                                height={32}
                                className="size-full object-cover"
                              />
                            ) : (
                              item.user.dataset.full_name?.[0] || "?"
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1 font-bold text-white">
                              <span className="truncate">
                                {item.user.dataset.full_name || "Anonymous"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-medium text-white">
                        {item.focus_minutes} m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
