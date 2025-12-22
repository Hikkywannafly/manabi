"use client";

import { BarChart2, Clock, Globe, Settings2, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { useRoomStore } from "@/stores/use-room-store";
import { usePomodoroTimer } from "../hooks";
import { getCurrentStreak } from "../services/timer-service";
import { PublicRoomModal } from "./social/public-room-modal";
import { RoomSettingsSidebar } from "./social/room-settings-sidebar";
import { RoomWidgets } from "./social/room-widgets";
import { StreakCard } from "./streak-card";

export function PomodoroHeader() {
  const { toggleStreak, toggleLeaderboard, toggleRoomSettings } =
    usePomodoroStore();
  const { currentRoom } = useRoomStore();
  const { minutes, seconds } = usePomodoroTimer();
  const [currentStreakCount, setCurrentStreakCount] = useState(0);
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);

  // Fetch streak on mount
  useEffect(() => {
    const fetchStreak = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const streak = await getCurrentStreak(user.id);
        setCurrentStreakCount(streak);
      }
    };

    fetchStreak();
  }, []);

  return (
    <>
      <header className="absolute top-0 right-0 left-0 z-40 flex items-center justify-end px-4 pt-3 transition-opacity duration-500 sm:px-6 md:px-8 md:pt-3">
        {/* Right Side Controls */}
        <div className="relative flex items-center justify-end gap-2 transition duration-500">
          {/* Streak Widget */}
          <div className="relative">
            <StreakCard />
            <Button
              type="button"
              className="flex cursor-pointer items-center justify-between gap-2 rounded-xl bg-black/70 px-5 py-4 text-white shadow-xs backdrop-blur-xl transition-transform duration-400 hover:bg-black/80"
              onClick={toggleStreak}
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col text-left">
                  <span className="font-bold text-white/90 text-xs uppercase">
                    Streak
                  </span>
                  <div className="font-black font-title text-white text-xl">
                    {currentStreakCount}
                  </div>
                </div>
              </div>
            </Button>
          </div>

          {/* Timer Widget */}
          <Button
            className="flex h-10 cursor-pointer items-center gap-1 rounded-xl bg-black/20 px-3 hover:bg-black/50"
            aria-label="Timer widget"
          >
            <Clock className="size-4 text-white" />
            <div className="font-bold text-sm text-white">
              {minutes}:{String(seconds).padStart(2, "0")}
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

          {/* Cam Widget */}
          <Button
            className="flex h-10 cursor-pointer items-center justify-center gap-1 rounded-xl bg-black/20 px-3 hover:bg-black/50"
            aria-label="Camera widget"
          >
            <Video className="size-5 text-white" />
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
          <Button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/50 bg-gradient-to-br from-black to-gray-600 font-bold text-sm text-white hover:from-black hover:to-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            N
          </Button>
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
