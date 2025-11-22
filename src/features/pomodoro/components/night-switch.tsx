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
    <div className={cn("night-switch", className)}>
      <button
        role="switch"
        aria-checked={!isDayMode}
        onClick={toggleDayMode}
        className={cn(
          "relative block overflow-hidden rounded-full border-none transition-colors duration-150 ease-in-out",
          "h-[30px] w-[60px]",
          isDayMode ? "bg-primary" : "bg-input",
        )}
        type="button"
      >
        {/* Icons Container */}
        <div className="relative h-full w-full">
          {/* Sun Icon (Left) */}
          <div
            className={cn(
              "absolute top-0 left-0 flex h-full w-1/2 items-center justify-center transition-all duration-300 ease-in-out",
              isDayMode
                ? "translate-x-0 opacity-100"
                : "-translate-x-2 opacity-0",
            )}
          >
            <Sun className="h-4 w-4 text-primary-foreground" />
          </div>

          {/* Moon Icon (Right) */}
          <div
            className={cn(
              "absolute top-0 right-0 flex h-full w-1/2 items-center justify-center transition-all duration-300 ease-in-out",
              !isDayMode
                ? "translate-x-0 opacity-100"
                : "translate-x-2 opacity-0",
            )}
          >
            <Moon className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>

        {/* Handle */}
        <div
          className={cn(
            "cubic-bezier(0.4, 0.0, 0.2, 1) absolute top-[3px] h-[24px] w-[24px] rounded-full bg-background shadow-sm transition-transform duration-300",
            isDayMode ? "translate-x-[33px]" : "translate-x-[3px]",
          )}
        />
      </button>
    </div>
  );
}
