"use client";

import { Settings, SkipForward } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimerMode, TimerState } from "../types";

interface PomodoroTimerProps {
  className?: string;
}

export function PomodoroTimer({ className }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [state, setState] = useState<TimerState>("idle");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionCount] = useState(1);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getModeConfig = (m: TimerMode) => {
    switch (m) {
      case "focus":
        return {
          label: "Focus",
          duration: 25 * 60,
          gradient: "from-violet-500 via-purple-500 to-indigo-600",
        };
      case "shortBreak":
        return {
          label: "Short Break",
          duration: 5 * 60,
          gradient: "from-emerald-400 via-teal-500 to-cyan-600",
        };
      case "longBreak":
        return {
          label: "Long Break",
          duration: 15 * 60,
          gradient: "from-pink-400 via-rose-500 to-red-500",
        };
    }
  };

  const handleStart = () => {
    setState("running");
    // Timer logic will be added via hook later
  };

  const handlePause = () => {
    setState("paused");
  };

  // const handleReset = () => {
  //   setState("idle");
  //   setTimeLeft(getModeConfig(mode).duration);
  // };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setState("idle");
    setTimeLeft(getModeConfig(newMode).duration);
  };

  // const currentConfig = getModeConfig(mode);

  return (
    <div
      className={cn("flex flex-col items-center gap-8 sm:gap-12", className)}
    >
      {/* Mode Indicators */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => handleModeChange("focus")}
          className="group relative flex items-center justify-center transition-all duration-200"
          title="Focus"
        >
          <div
            className={cn(
              "size-6 rounded-full transition-all duration-200",
              mode === "focus"
                ? "scale-125 bg-white shadow-lg shadow-white/50"
                : "bg-white/30 hover:bg-white/50 group-hover:scale-110",
            )}
          />
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("shortBreak")}
          className="group relative flex items-center justify-center transition-all duration-200"
          title="Short Break"
        >
          <div
            className={cn(
              "size-6 rounded-full transition-all duration-200",
              mode === "shortBreak"
                ? "scale-125 bg-white shadow-lg shadow-white/50"
                : "bg-white/30 hover:bg-white/50 group-hover:scale-110",
            )}
          />
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("longBreak")}
          className="group relative flex items-center justify-center transition-all duration-200"
          title="Long Break"
        >
          <div
            className={cn(
              "size-6 rounded-full transition-all duration-200",
              mode === "longBreak"
                ? "scale-125 bg-white shadow-lg shadow-white/50"
                : "bg-white/30 hover:bg-white/50 group-hover:scale-110",
            )}
          />
        </button>
      </div>

      {/* Timer Display */}
      <div className="mb-0 py-0">
        <div
          className={cn(
            "font-bold text-white tracking-wider transition-all duration-300 ease-in-out",
            "text-7xl leading-none sm:text-8xl md:text-9xl",
            "drop-shadow-[0_2px_30px_rgba(255,255,255,0.3)]",
            state === "running" && "animate-pulse",
          )}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      {/* Controls */}
      <div className="relative flex items-center gap-3">
        {/* Settings Button (Left) */}
        <div className="-translate-x-[110%] sm:-translate-x-[130%] absolute left-0">
          <Button
            variant="ghost"
            size="icon"
            className="size-12 rounded-full text-white transition-all hover:scale-110 hover:bg-white/10"
            title="Settings"
          >
            <Settings className="size-6" />
          </Button>
        </div>

        {/* Main Start/Pause Button */}
        <Button
          onClick={state === "running" ? handlePause : handleStart}
          className={cn(
            "h-14 w-36 rounded-full font-semibold text-lg transition-all duration-300 ease-out sm:h-16 sm:w-56 sm:text-xl",
            "bg-white text-black shadow-lg hover:scale-105 hover:bg-white/95 hover:shadow-xl",
            "active:scale-95 active:shadow-md",
          )}
        >
          <span className="relative z-10">
            {state === "running"
              ? "Pause"
              : state === "paused"
                ? "Resume"
                : "Start"}
          </span>
        </Button>

        {/* Skip Button (Right) */}
        <div className="absolute right-0 translate-x-[115%]">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-12 rounded-full text-white transition-all duration-300",
              state === "running"
                ? "opacity-100 hover:scale-110 hover:bg-white/10"
                : "pointer-events-none opacity-0",
            )}
            title="Skip"
          >
            <SkipForward className="size-6" />
          </Button>
        </div>
      </div>

      {/* Session Counter */}
      <div className="font-medium text-sm text-white/70 sm:text-base">
        Session {sessionCount}/4
      </div>
    </div>
  );
}
