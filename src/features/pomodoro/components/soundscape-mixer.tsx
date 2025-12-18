"use client";

import { CloudRain } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/stores/use-audio-store";

export function WhiteNoiseMixer() {
  const { soundscapes, toggleSoundscape, setSoundscapeVolume } =
    useAudioStore();

  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="whitenoise-toolbar-button flex h-[30px] cursor-pointer flex-row items-center justify-center gap-1 rounded-lg bg-black/20 px-2 hover:bg-black/50 sm:h-[40px] sm:rounded-xl sm:px-3">
          <CloudRain className="pointer-events-none text-[20px] text-white" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border-none bg-transparent p-0 shadow-none"
        align="start"
        sideOffset={10}
      >
        <div className="w-[300px] rounded-xl bg-black/70 px-5 py-4 text-white shadow-xs backdrop-blur-xl sm:w-auto sm:max-w-[500px]">
          <div className="mx-auto max-w-[500px] rounded-xl px-2 py-2">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold font-heading text-white text-xl">
                  White Noise Mixer
                </span>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
                className="scale-110 data-[state=checked]:bg-blue-500"
              />
            </div>

            <div
              className={cn(
                "grid grid-cols-4 gap-2 sm:grid-cols-3 md:grid-cols-5",
                !isEnabled && "pointer-events-none opacity-50",
              )}
            >
              {soundscapes.map((sound) => (
                <button
                  key={sound.id}
                  type="button"
                  title={sound.name}
                  className="relative flex w-full cursor-pointer flex-col items-center rounded-lg border-none bg-transparent p-2 transition"
                  onClick={() => {
                    if (!sound.isActive) toggleSoundscape(sound.id);
                  }}
                >
                  <div
                    className={cn(
                      "mb-0 text-xl opacity-60 hover:opacity-100 sm:text-3xl",
                      sound.isActive && "opacity-100",
                    )}
                  >
                    {/* Map icons to emojis for this specific UI design if needed, or use Lucide icons */}
                    {/* For now using the icon from store but styled differently */}
                    <sound.icon className="size-8" />
                  </div>
                  <div className="relative w-full">
                    <Slider
                      value={[sound.volume]}
                      onValueChange={([val]) => {
                        if (!sound.isActive) toggleSoundscape(sound.id);
                        setSoundscapeVolume(sound.id, val);
                      }}
                      max={100}
                      step={1}
                      className={cn(
                        "mt-2 w-full transition-opacity duration-150",
                        sound.isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
