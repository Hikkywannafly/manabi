"use client";

import { motion } from "framer-motion";
import { Maximize2, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { useTimerStore } from "@/stores/use-timer-store";
import { SCENES } from "../data/scenes";
import { usePomodoroTimer } from "../hooks";

export function PomodoroMiniTimer() {
  const router = useRouter();
  const { mode, status, timeLeft, sessionCount } = useTimerStore();
  const { currentSceneId } = usePomodoroStore();
  const { pause, resume, start } = usePomodoroTimer();
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Get current scene thumbnail
  const currentScene = useMemo(
    () => SCENES.find((s) => s.id === currentSceneId) ?? SCENES[0],
    [currentSceneId],
  );

  // Format time display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Get status label
  const statusLabel = useMemo(() => {
    const modeText =
      mode === "focus"
        ? "Focus"
        : mode === "shortBreak"
          ? "Break"
          : "Long Break";
    return `${modeText} • ${sessionCount}/4`;
  }, [mode, sessionCount]);

  // Get button label
  const buttonLabel = useMemo(() => {
    if (status === "running") return "Pause";
    if (status === "paused") return "Resume";
    return "Start";
  }, [status]);

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    if (status === "running") {
      pause();
    } else if (status === "paused") {
      resume();
    } else {
      start();
    }
  }, [status, pause, resume, start]);

  // Navigate to pomodoro page
  const handleExpand = useCallback(() => {
    router.push("/dashboard/pomodoro");
  }, [router]);

  return (
    <div className="contents">
      {/* Drag constraints container - covers entire viewport */}
      <div
        ref={constraintsRef}
        className="pointer-events-none fixed inset-4 z-40"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        className={cn(
          "fixed right-6 bottom-6 z-50 cursor-grab overflow-hidden rounded-2xl shadow-2xl",
          "h-[192px] w-[320px]",
          "border border-white/10 backdrop-blur-sm",
          "active:cursor-grabbing",
        )}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={currentScene.thumbnail}
            alt={currentScene.name}
            fill
            className="object-cover"
            sizes="320px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        {/* Expand Button - Top Left */}
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleExpand();
          }}
          className={cn(
            "absolute top-3 left-3 z-20 size-8 rounded-full",
            "bg-black/30 text-white/80 hover:bg-black/50 hover:text-white",
            "transition-all duration-200",
          )}
        >
          <Maximize2 className="size-4" />
        </Button>

        {/* Content - Centered */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 px-4">
          {/* Timer Display */}
          <span className="font-bold text-5xl text-white tracking-tight drop-shadow-lg">
            {timeDisplay}
          </span>

          {/* Status */}
          <span className="font-medium text-sm text-white/70 uppercase tracking-wider">
            {statusLabel}
          </span>

          {/* Play/Pause Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            className={cn(
              "mt-2 h-10 min-w-[100px] rounded-full",
              "bg-white/20 text-white hover:bg-white/30",
              "transition-all duration-200",
            )}
          >
            <span className="relative mr-2 size-4">
              <Pause
                className={cn(
                  "absolute inset-0 size-4 transition-opacity",
                  status === "running" ? "opacity-100" : "opacity-0",
                )}
              />
              <Play
                className={cn(
                  "absolute inset-0 size-4 transition-opacity",
                  status !== "running" ? "opacity-100" : "opacity-0",
                )}
              />
            </span>
            {buttonLabel}
          </Button>
        </div>

        {/* Running Indicator */}
        {status === "running" && (
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/30" />
        )}
      </motion.div>
    </div>
  );
}
