"use client";

import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { BackgroundScene } from "@/features/pomodoro/components/background-scene";
import { ControlBar } from "@/features/pomodoro/components/control-bar";
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
      {/* Background Scene */}
      <BackgroundScene />

      {/* Top Content (Timer & Task) */}
      <div className="relative z-10 flex flex-1 flex-col items-center pt-12 sm:pt-16">
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
