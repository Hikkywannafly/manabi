"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useWhiteNoise } from "../hooks";

interface WhiteNoiseMixerProps {
  className?: string;
}

export function WhiteNoiseMixer({ className }: WhiteNoiseMixerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isMasterOn,
    sounds,
    activeSoundsCount,
    handleVolumeChange,
    setIsMasterOn,
  } = useWhiteNoise();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative size-10 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/40 sm:size-12",
            className,
          )}
          title="White Noise Mixer"
        >
          <SlidersHorizontal className="size-5 text-white" />
          {activeSoundsCount > 0 && (
            <span className="-top-1 -right-1 absolute flex size-5 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground">
              {activeSoundsCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[350px] border-white/10 bg-black/70 text-white backdrop-blur-xl sm:w-[500px]"
        align="start"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">White Noise Mixer</span>
            </div>
            <Switch checked={isMasterOn} onCheckedChange={setIsMasterOn} />
          </div>

          {/* Sound Grid */}
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {sounds.map((sound) => (
              <div
                key={sound.id}
                className={cn(
                  "relative flex flex-col items-center rounded-lg p-2 transition-colors",
                  "cursor-pointer hover:bg-white/5",
                  sound.isActive && "bg-white/10",
                )}
              >
                {sound.isPremium && (
                  <span className="absolute top-0 left-0 text-xs">🔒</span>
                )}
                <div
                  className={cn(
                    "mb-1 text-2xl transition-opacity sm:text-3xl",
                    sound.isActive
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-100",
                  )}
                >
                  {sound.emoji}
                </div>
                <Slider
                  value={[sound.volume]}
                  onValueChange={([value]) =>
                    handleVolumeChange(sound.id, value)
                  }
                  max={100}
                  step={1}
                  className={cn(
                    "mt-2 w-full transition-opacity",
                    sound.volume === 0 && "opacity-0",
                  )}
                  disabled={!isMasterOn}
                />
                <span className="mt-1 text-center text-[10px] text-white/50">
                  {sound.name}
                </span>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="text-center text-white/50 text-xs">
            🔒 Premium sounds require subscription
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
