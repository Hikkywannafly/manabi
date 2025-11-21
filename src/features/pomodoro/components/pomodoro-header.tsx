"use client";

import { BarChart2, Clock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { RoomCard } from "./room-card";
import { StreakCard } from "./streak-card";
export function PomodoroHeader() {
  const { toggleStreak, toggleLeaderboard, toggleRoomSettings } =
    usePomodoroStore();

  return (
    <header className="absolute top-0 right-0 left-0 z-40 flex items-center justify-end px-4 pt-3 transition-opacity duration-500 sm:px-6 md:px-8 md:pt-3">
      {/* Logo Area */}
      {/* <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 opacity-50">
          <a className="font-bold font-heading text-[1.2em] text-white tracking-tight transition-colors sm:text-[2em]" href="/">
            Manabi<span className="text-yellow-500">.</span>io
          </a>
        </div>
      </div> */}

      {/* Right Side Controls */}
      <div className="relative flex items-center justify-end gap-2 transition duration-500">
        {/* Streak Widget */}
        <div className="relative">
          <StreakCard />
          <Button
            type="button"
            className="flex cursor-pointer items-center justify-between gap-2 rounded-xl bg-black/70 px-5 py-4 text-white shadow-xs backdrop-blur-xl transition-transform duration-400 hover:bg-black/80"
            onClick={toggleStreak}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleStreak();
              }
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-left">
                <span className="font-bold text-white/90 text-xs uppercase">
                  Streak
                </span>
                <div className="font-black font-title text-white text-xl">
                  0
                </div>
              </div>
              {/* <Image src="/fire.png" className="w-[30px]" alt="" /> */}
            </div>
          </Button>
        </div>

        {/* Timer Widget (Placeholder) */}
        <Button
          className="flex h-[40px] cursor-pointer items-center gap-1 rounded-xl bg-black/20 px-3 hover:bg-black/50"
          aria-label="Timer widget"
        >
          <Clock className="size-4 text-white" />
          <div className="font-bold text-sm text-white">0m</div>
        </Button>

        {/* Leaderboard Widget */}
        <Button
          className="flex h-[40px] cursor-pointer items-center justify-center rounded-xl bg-black/20 px-3 hover:bg-black/50"
          aria-label="Leaderboard widget"
          onClick={toggleLeaderboard}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleLeaderboard();
            }
          }}
        >
          <BarChart2 className="size-5 text-white" />
        </Button>

        {/* Cam Widget */}
        <Button
          className="flex h-[40px] cursor-pointer items-center justify-center gap-1 rounded-xl bg-black/20 px-3 hover:bg-black/50"
          aria-label="Camera widget"
        >
          <Video className="size-5 text-white" />
        </Button>

        {/* Room Widget */}
        <Button
          className="flex h-[40px] max-w-[160px] cursor-pointer select-none items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-xl bg-black/20 px-3 hover:bg-black/50 sm:max-w-[250px]"
          onClick={toggleRoomSettings}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleRoomSettings();
            }
          }}
          aria-label="Room settings"
        >
          <span className="truncate text-sm text-white">nyankoisca's room</span>
        </Button>
        <RoomCard />
      </div>

      {/* User Profile */}
      <div className="relative ml-2">
        <Button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/50 bg-gradient-to-br from-black to-gray-600 font-bold text-sm text-white hover:from-black hover:to-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          N
        </Button>
      </div>
    </header>
  );
}
