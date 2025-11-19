"use client";

import { Clock, Image, Maximize, Music } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PomodoroTimer } from "@/features/pomodoro/components/pomodoro-timer";
import { StatsButton } from "@/features/pomodoro/components/stats-button";
import { TaskInput } from "@/features/pomodoro/components/task-input";
import { WhiteNoiseMixer } from "@/features/pomodoro/components/white-noise-mixer";
import type { TimerMode } from "@/features/pomodoro/types";
import { cn } from "@/lib/utils";

export default function PomodoroPage() {
  const [mode] = useState<TimerMode>("focus");
  const { setOpen } = useSidebar();

  // Hide sidebar when entering Pomodoro page for fullscreen experience
  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  const getModeGradient = (m: TimerMode) => {
    switch (m) {
      case "focus":
        return "from-violet-500 via-purple-500 to-indigo-600";
      case "shortBreak":
        return "from-emerald-400 via-teal-500 to-cyan-600";
      case "longBreak":
        return "from-pink-400 via-rose-500 to-red-500";
    }
  };

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col overflow-hidden",
        "bg-linear-to-br transition-all duration-700",
        getModeGradient(mode),
      )}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Floating Logo Toggle
			<FloatingLogoToggle /> */}

      {/* Top Toolbar */}
      <div className="relative z-10 flex items-center justify-end px-4 pt-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/40 sm:size-12"
            title="Focus Time"
          >
            <Clock className="size-5 text-white" />
            <span className="ml-2 hidden font-bold text-sm text-white sm:inline">
              0m
            </span>
          </Button>
          <StatsButton />
        </div>
      </div>

      {/* Main Content - Centered Timer */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="flex w-full max-w-2xl flex-col items-center gap-8">
          <TaskInput />
          <PomodoroTimer />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="relative z-10 flex items-center justify-center gap-2 px-4 pb-4 sm:justify-between sm:px-6 md:px-8">
        <div className="flex items-center gap-2">
          <WhiteNoiseMixer />
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/40 sm:size-12"
            title="Music"
          >
            <Music className="size-5 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/40 sm:size-12"
            title="Background"
          >
            <Image className="size-5 text-white" />
          </Button>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/40 sm:size-12"
            title="Fullscreen"
          >
            <Maximize className="size-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
