"use client";

import {
  Maximize,
  MoreVertical,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { MusicSelector } from "./music-selector";
import { SceneSelector } from "./scene-selector";
import { SoundscapeMixer } from "./soundscape-mixer";

interface ControlBarProps {
  className?: string;
}

export function ControlBar({ className }: ControlBarProps) {
  const { isPlaying, setIsPlaying } = usePomodoroStore();

  return (
    <div
      className={cn(
        "flex h-20 w-full items-center justify-between bg-black/60 px-6 backdrop-blur-md",
        "border-white/10 border-t",
        className,
      )}
    >
      {/* Left: Music Info */}
      <div className="flex w-1/3 items-center gap-4">
        <MusicSelector />
      </div>

      {/* Center: Playback Controls */}
      <div className="flex w-1/3 justify-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white"
          >
            <SkipBack className="size-5" />
          </Button>

          <Button
            size="icon"
            className="size-10 rounded-full bg-white text-black hover:bg-white/90"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="ml-0.5 size-5 fill-current" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white"
          >
            <SkipForward className="size-5" />
          </Button>
        </div>
      </div>

      {/* Right: System Controls */}
      <div className="flex w-1/3 items-center justify-end gap-4">
        {/* Soundscapes & Volume */}
        <SoundscapeMixer />

        <div className="h-6 w-px bg-white/10" />

        {/* Scene Switcher */}
        <SceneSelector />

        {/* Fullscreen */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white"
          title="Fullscreen"
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
        >
          <Maximize className="size-5" />
        </Button>

        {/* More */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white"
        >
          <MoreVertical className="size-5" />
        </Button>
      </div>
    </div>
  );
}
