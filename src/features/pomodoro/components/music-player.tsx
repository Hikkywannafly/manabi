"use client";

import { Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/use-music-store";

export function MusicPlayer() {
  const { isPlaying, toggleMenu, isMenuOpen } = useMusicStore();

  return (
    <button
      type="button"
      onClick={toggleMenu}
      className={cn(
        "music-toolbar-button flex h-[30px] cursor-pointer flex-row items-center justify-center gap-1 rounded-lg px-2 transition-all sm:h-[40px] sm:rounded-xl sm:px-3",
        isMenuOpen || isPlaying
          ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
          : "bg-black/20 hover:bg-black/50",
      )}
    >
      <Music
        className={cn(
          "pointer-events-none text-[20px]",
          isPlaying ? "animate-pulse text-green-500" : "text-white",
        )}
      />
      {isPlaying && (
        <div className="hidden font-medium text-xs sm:block">Playing</div>
      )}
    </button>
  );
}
