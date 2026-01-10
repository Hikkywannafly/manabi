"use client";

import { BarChart2, Clock, Globe, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UserDropdown } from "@/components/layouts/user-dropdown";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/auth-provider";
import { statsService } from "@/services/stats-service";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { useRoomStore } from "@/stores/use-room-store";
import { useTimerStore } from "@/stores/use-timer-store";
import { getCurrentStreak } from "../services/timer-service";
import { PublicRoomModal } from "./social/public-room-modal";
import { RoomSettingsSidebar } from "./social/room-settings-sidebar";
import { RoomWidgets } from "./social/room-widgets";
import { StreakCard } from "./streak-card";

export function PomodoroHeader() {
  const { toggleLeaderboard, toggleRoomSettings } = usePomodoroStore();
  const { currentRoom } = useRoomStore();
  const { status } = useTimerStore();
  const [, setCurrentStreakCount] = useState(0);
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);
  const [todayFocusMinutes, setTodayFocusMinutes] = useState(0);

  const { user } = useUser();

  // Fetch streak and today's focus time on mount
  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        const streak = await getCurrentStreak(user.id);
        setCurrentStreakCount(streak);

        // Fetch today's focus time
        const today = new Date().toISOString().split("T")[0];
        const stats = await statsService.getDailyStats(user.id, today);
        setTodayFocusMinutes(stats.focus_minutes || 0);
      }
    };

    fetchStats();
  }, [user]);

  // Refetch when timer stops (session completed)
  useEffect(() => {
    if (status === "idle" && user) {
      const today = new Date().toISOString().split("T")[0];
      statsService.getDailyStats(user.id, today).then((stats) => {
        setTodayFocusMinutes(stats.focus_minutes || 0);
      });
    }
  }, [status, user]);

  // Format focus time as Xh Xm
  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <>
      <header className="absolute top-0 right-0 left-0 z-40 flex items-center justify-end px-4 pt-3 transition-opacity duration-500 sm:px-6 md:px-8 md:pt-3">
        {/* Right Side Controls */}
        <div className="relative flex items-center justify-end gap-2 transition duration-500">
          {/* Streak Widget */}
          <div className="relative">
            <StreakCard />
          </div>

          {/* Today's Focus Time Widget */}
          <Button
            className="flex h-10 cursor-pointer items-center gap-1.5 rounded-xl bg-black/20 px-3 hover:bg-black/50"
            aria-label="Today's focus time"
          >
            <Clock className="size-4 text-white" />
            <div className="font-bold text-sm text-white">
              {formatFocusTime(todayFocusMinutes)}
            </div>
          </Button>

          {/* Public Rooms (Globe) */}
          <Button
            className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-black/20 px-3 hover:bg-black/50"
            aria-label="Discover rooms"
            onClick={() => setIsPublicModalOpen(true)}
          >
            <Globe className="size-5 text-white" />
          </Button>

          {/* Leaderboard Widget */}
          <Button
            className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-black/20 px-3 hover:bg-black/50"
            aria-label="Leaderboard widget"
            onClick={toggleLeaderboard}
          >
            <BarChart2 className="size-5 text-white" />
          </Button>

          {/* Room Settings (Current Room) */}
          <Button
            className="flex h-10 max-w-40 cursor-pointer select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl bg-black/20 px-3 hover:bg-black/50 sm:max-w-[250px]"
            onClick={toggleRoomSettings}
            aria-label="Room settings"
          >
            <div className="size-2 animate-pulse rounded-full bg-green-500" />
            <span className="truncate font-bold text-sm text-white">
              {currentRoom?.name || "My Room"}
            </span>
            <Settings2 className="ml-1 size-4 text-white/50" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="relative ml-2">
          <UserDropdown
            variant="header"
            className="size-10 border border-white/50 bg-gradient-to-br from-black to-gray-600 hover:from-black hover:to-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          />
        </div>
      </header>

      {/* Modals & Overlays */}
      <PublicRoomModal
        isOpen={isPublicModalOpen}
        onClose={() => setIsPublicModalOpen(false)}
      />
      <RoomSettingsSidebar />
      <RoomWidgets />
    </>
  );
}
