"use client";

import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { BackgroundMusicPlayer } from "@/features/pomodoro/components/background-music-player";
import { BackgroundScene } from "@/features/pomodoro/components/background-scene";
import { ControlBar } from "@/features/pomodoro/components/control-bar";
import { LeaderboardModal } from "@/features/pomodoro/components/leaderboard-modal";
import { PomodoroHeader } from "@/features/pomodoro/components/pomodoro-header";
import { PomodoroTimer } from "@/features/pomodoro/components/pomodoro-timer";
import { TaskInput } from "@/features/pomodoro/components/task-input";

export default function PomodoroPage() {
  const { setOpen } = useSidebar();

  // Hide sidebar when entering Pomodoro page for fullscreen experience
  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black">
      {/* Persistent Music Player */}
      <BackgroundMusicPlayer />

      {/* Background Scene */}
      <BackgroundScene />

      {/* Header & Social Overlays */}
      <PomodoroHeader />
      <LeaderboardModal />

      {/* Main Content Area */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-20 pb-32">
        <PomodoroTimer />

        <div className="mt-8">
          <TaskInput className="w-[300px] sm:w-[400px]" />
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="relative z-20">
        <ControlBar />
      </div>
    </div>
  );
}
