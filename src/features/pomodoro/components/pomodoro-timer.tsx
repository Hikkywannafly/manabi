"use client";

import { Settings, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/stores/use-task-store";
import { usePomodoroTimer } from "../hooks";

interface PomodoroTimerProps {
  className?: string;
}

export function PomodoroTimer({ className }: PomodoroTimerProps) {
  const {
    mode,
    state,
    minutes,
    seconds,
    sessionCount,
    start,
    pause,
    resume,
    changeMode,
  } = usePomodoroTimer();
  const { tasks, activeTaskId } = useTaskStore();
  const activeTask = tasks.find((t) => t.id === activeTaskId);

  const handlePlayPause = () => {
    if (state === "running") {
      pause();
    } else if (state === "paused") {
      resume();
    } else {
      start();
    }
  };

  const getButtonLabel = () => {
    if (state === "running") return "Pause";
    if (state === "paused") return "Resume";
    return "Start";
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-8",
        className,
      )}
    >
      {/* Task Display */}
      <div className="flex flex-col items-center gap-2">
        {activeTask ? (
          <div className="flex items-center gap-2 rounded-full bg-black/20 px-4 py-1.5 backdrop-blur-sm">
            <div className="size-2 rounded-full bg-orange-500" />
            <span className="font-medium text-sm text-white/90">
              {activeTask.title}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-black/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="font-medium text-sm text-white/50">
              No active task
            </span>
          </div>
        )}
      </div>

      {/* Mode Indicators */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => changeMode("focus")}
          className={cn(
            "size-3 rounded-full transition-all duration-300",
            mode === "focus"
              ? "scale-125 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              : "bg-white/30 hover:bg-white/50",
          )}
          title="Focus"
        />
        <button
          type="button"
          onClick={() => changeMode("shortBreak")}
          className={cn(
            "size-3 rounded-full transition-all duration-300",
            mode === "shortBreak"
              ? "scale-125 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              : "bg-white/30 hover:bg-white/50",
          )}
          title="Short Break"
        />
        <button
          type="button"
          onClick={() => changeMode("longBreak")}
          className={cn(
            "size-3 rounded-full transition-all duration-300",
            mode === "longBreak"
              ? "scale-125 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              : "bg-white/30 hover:bg-white/50",
          )}
          title="Long Break"
        />
      </div>

      {/* Timer Display */}
      <div className="relative">
        <div
          className={cn(
            "select-none font-bold text-white tracking-tighter transition-all duration-300",
            "text-[8rem] leading-none sm:text-[10rem] md:text-[12rem]",
            "drop-shadow-2xl",
          )}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>

        {/* Session Counter (Absolute) */}
        <div className="-bottom-6 -translate-x-1/2 absolute left-1/2 whitespace-nowrap">
          <span className="font-medium text-sm text-white/60 uppercase tracking-widest">
            {mode === "focus"
              ? "Focus"
              : mode === "shortBreak"
                ? "Short Break"
                : "Long Break"}{" "}
            • {sessionCount}/4
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          className="size-10 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          title="Settings"
        >
          <Settings className="size-5" />
        </Button>

        <Button
          onClick={handlePlayPause}
          className={cn(
            "h-14 min-w-[140px] rounded-full font-bold text-lg transition-all duration-300",
            "bg-white text-black hover:scale-105 hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
            "active:scale-95",
          )}
        >
          {getButtonLabel()}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-10 rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-white",
            state !== "running" && "pointer-events-none opacity-50",
          )}
          title="Skip"
        >
          <SkipForward className="size-5" />
        </Button>
      </div>
    </div>
  );
}
