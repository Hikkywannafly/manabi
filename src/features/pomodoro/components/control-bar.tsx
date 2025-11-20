"use client";

import {
  Image as ImageIcon,
  Maximize,
  MoreVertical,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ControlBarProps {
  className?: string;
}

export function ControlBar({ className }: ControlBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);

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
        <div className="flex size-12 items-center justify-center rounded-lg bg-white/10">
          <Music className="size-6 text-white/70" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate font-medium text-sm text-white">
            misty morning through a lonely window
          </span>
          <span className="truncate text-white/50 text-xs">By Kainbeats</span>
        </div>
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
        {/* Volume */}
        <div className="group flex items-center gap-2">
          <Volume2 className="size-5 text-white/70" />
          <div className="w-0 overflow-hidden transition-all duration-300 group-hover:w-24">
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>

        <div className="h-6 w-px bg-white/10" />

        {/* Scene Switcher */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white"
          title="Scenes"
        >
          <ImageIcon className="size-5" />
        </Button>

        {/* Fullscreen */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white"
          title="Fullscreen"
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
