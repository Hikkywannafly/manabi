"use client";

import { Clock, Music } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type MusicProvider = "spotify" | "youtube";

export function MusicPlayer() {
  const [provider, setProvider] = useState<MusicProvider>("spotify");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="music-toolbar-button flex h-[30px] cursor-pointer flex-row items-center justify-center gap-1 rounded-lg bg-black/20 px-2 hover:bg-black/50 sm:h-[40px] sm:rounded-xl sm:px-3">
          <Music className="pointer-events-none text-[20px] text-white" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[350px] border-none bg-transparent p-0 shadow-none sm:w-[450px]"
        align="center"
        sideOffset={10}
      >
        <div className="rounded-xl bg-black/70 px-5 py-4 text-white shadow-xs backdrop-blur-xl">
          <div>
            <div className="mb-2 flex flex-row items-center justify-between gap-5">
              <div className="font-bold font-heading capitalize">
                {provider}
              </div>
              <div className="flex flex-row items-center gap-4">
                <div className="flex cursor-pointer flex-row items-center gap-1 rounded-lg py-2 text-white/50 hover:text-white">
                  <Clock className="size-4" />
                  <div className="text-xs">Recent</div>
                </div>
                <button
                  type="button"
                  className="flex cursor-pointer flex-row items-center gap-1 rounded-lg border-none bg-transparent py-2 text-white/50 hover:text-white"
                  onClick={() =>
                    setProvider(provider === "spotify" ? "youtube" : "spotify")
                  }
                >
                  <Music className="size-4" />
                  <div className="text-xs">Change</div>
                </button>
              </div>
            </div>

            {provider === "spotify" ? (
              <iframe
                width="100%"
                height="354"
                src="https://open.spotify.com/embed/track/3SKiLglljLbKr5j0IhXqYd?theme=1"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="mt-2 rounded-lg"
                title="Spotify Player"
              />
            ) : (
              <iframe
                width="100%"
                height="173"
                src="https://www.youtube.com/embed/Y-JQ-RCyPpQ"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="mt-2 rounded-lg"
                title="YouTube Player"
              />
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
