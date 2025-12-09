"use client";

import { Moon, Sun } from "lucide-react";
import { SCENES } from "@/features/pomodoro/data/scenes";
import { cn } from "@/lib/utils";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";

interface NightSwitchProps {
  className?: string;
}

export function NightSwitch({ className }: NightSwitchProps) {
  const { isDayMode, toggleDayMode, currentSceneId } = usePomodoroStore();
  const currentScene = SCENES.find((s) => s.id === currentSceneId);

  if (!currentScene?.hasDayNight) return null;

  return (
    <button
      type="button"
      onClick={toggleDayMode}
      className={cn(
        "flex h-[30px] cursor-pointer flex-row items-center justify-center gap-1 rounded-lg border-none bg-black/20 px-2 hover:bg-black/50 sm:h-[40px] sm:rounded-xl sm:px-3",
        className,
      )}
      title={isDayMode ? "Switch to Night Mode" : "Switch to Day Mode"}
    >
      {isDayMode ? (
        <Sun className="pointer-events-none text-[20px] text-white" />
      ) : (
        <Moon className="pointer-events-none text-[20px] text-white" />
      )}
    </button>
  );
}
