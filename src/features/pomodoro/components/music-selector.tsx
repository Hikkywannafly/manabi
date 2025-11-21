"use client";

import { Music } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import type { Playlist } from "../types";

const PLAYLISTS: Playlist[] = [
  {
    id: "chill-lofi",
    name: "Chill Lofi Beats",
    author: "Lofi Girl",
    coverUrl:
      "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=300&auto=format&fit=crop",
    tracks: [],
  },
  {
    id: "sleepy-lofi",
    name: "Sleepy Lofi",
    author: "Dreamy",
    coverUrl:
      "https://images.unsplash.com/photo-1531300185372-b7cbe2eddf0b?q=80&w=300&auto=format&fit=crop",
    tracks: [],
  },
  {
    id: "jazzy-lofi",
    name: "Jazzy Vibes",
    author: "Jazz Cat",
    coverUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=300&auto=format&fit=crop",
    tracks: [],
  },
];

export function MusicSelector() {
  const { currentPlaylistId, isPlaying, setIsPlaying } = usePomodoroStore();

  const currentPlaylist = PLAYLISTS.find((p) => p.id === currentPlaylistId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-14 w-full max-w-[240px] items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 hover:bg-white/10"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Music className="size-5 text-white/70" />
          </div>
          <div className="flex flex-col items-start overflow-hidden">
            <span className="truncate font-medium text-sm text-white">
              {currentPlaylist?.name || "Select Music"}
            </span>
            <span className="truncate text-white/50 text-xs">
              {currentPlaylist?.author || "No playlist selected"}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 border-white/10 bg-black/90 p-2 backdrop-blur-xl"
        align="start"
        sideOffset={10}
      >
        <div className="space-y-1">
          <h4 className="mb-2 px-2 font-medium text-sm text-white/50">
            Select Vibe
          </h4>
          {PLAYLISTS.map((playlist) => (
            <button
              key={playlist.id}
              type="button"
              onClick={() => {
                // setPlaylist(playlist.id);
                if (!isPlaying) setIsPlaying(true);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-2 transition-colors",
                currentPlaylistId === playlist.id
                  ? "bg-white/10"
                  : "hover:bg-white/5",
              )}
            >
              <Image
                src={playlist.coverUrl}
                alt={playlist.name}
                className="size-10 rounded-md object-cover"
              />
              <div className="flex flex-col items-start">
                <span
                  className={cn(
                    "font-medium text-sm",
                    currentPlaylistId === playlist.id
                      ? "text-white"
                      : "text-white/70",
                  )}
                >
                  {playlist.name}
                </span>
                <span className="text-white/40 text-xs">{playlist.author}</span>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
