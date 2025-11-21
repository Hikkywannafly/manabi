"use client";

import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";

export function SoundscapeMixer() {
  const {
    soundscapes,
    masterVolume,
    setMasterVolume,
    toggleSoundscape,
    setSoundscapeVolume,
  } = usePomodoroStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white"
          title="Soundscapes & Volume"
        >
          <Volume2 className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 border-white/10 bg-black/90 p-4 backdrop-blur-xl"
        align="center"
        sideOffset={10}
      >
        <div className="space-y-6">
          {/* Master Volume */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-white">
                Master Volume
              </span>
              <span className="text-white/50 text-xs">{masterVolume}%</span>
            </div>
            <Slider
              value={[masterVolume]}
              onValueChange={([val]) => setMasterVolume(val)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="h-px bg-white/10" />

          {/* Soundscapes */}
          <div className="space-y-4">
            <span className="font-medium text-sm text-white/50">
              Soundscapes
            </span>
            <div className="grid gap-4">
              {soundscapes.map((sound) => (
                <div key={sound.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleSoundscape(sound.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1 transition-colors",
                        sound.isActive
                          ? "bg-white/10 text-white"
                          : "text-white/50 hover:bg-white/5 hover:text-white/70",
                      )}
                    >
                      <sound.icon className="size-4" />
                      <span className="text-sm">{sound.name}</span>
                    </button>
                    {sound.isActive && (
                      <span className="text-white/50 text-xs">
                        {sound.volume}%
                      </span>
                    )}
                  </div>

                  {sound.isActive && (
                    <Slider
                      value={[sound.volume]}
                      onValueChange={([val]) =>
                        setSoundscapeVolume(sound.id, val)
                      }
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
