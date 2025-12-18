"use client";

import { Link as LinkIcon, Square, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/use-music-store";

export function BackgroundMusicPlayer() {
  const {
    provider,
    url,
    isPlaying,
    isMenuOpen,
    setProvider,
    setUrl,
    setIsPlaying,
    setMenuOpen,
  } = useMusicStore();
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inputUrl.trim()) return;

    // Basic detection logic
    if (inputUrl.includes("spotify.com")) {
      let embedUrl = inputUrl;
      // Convert to embed if needed
      if (
        inputUrl.includes("open.spotify.com/track") &&
        !inputUrl.includes("/embed/")
      ) {
        embedUrl = inputUrl.replace(
          "open.spotify.com/track",
          "open.spotify.com/embed/track",
        );
      } else if (
        inputUrl.includes("open.spotify.com/playlist") &&
        !inputUrl.includes("/embed/")
      ) {
        embedUrl = inputUrl.replace(
          "open.spotify.com/playlist",
          "open.spotify.com/embed/playlist",
        );
      }

      setProvider("spotify");
      setUrl(embedUrl);
      setIsPlaying(true);
      setInputUrl("");
    } else if (
      inputUrl.includes("youtube.com") ||
      inputUrl.includes("youtu.be")
    ) {
      let embedUrl = inputUrl;
      let videoId = "";

      if (inputUrl.includes("youtu.be/")) {
        videoId = inputUrl.split("youtu.be/")[1]?.split("?")[0];
      } else if (inputUrl.includes("v=")) {
        videoId = inputUrl.split("v=")[1]?.split("&")[0];
      }

      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        setProvider("youtube");
        setUrl(embedUrl);
        setIsPlaying(true);
        setInputUrl("");
      } else {
        setError("Invalid YouTube URL");
      }
    } else {
      setError("Please use a valid Spotify or YouTube link");
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!mounted) return null;

  // The overlay is ALWAYS rendered but toggles visibility
  return (
    <div
      className={cn(
        "-translate-x-1/2 fixed bottom-24 left-1/2 z-50 transition-all duration-300 ease-in-out",
        isMenuOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <div className="w-[350px] rounded-xl border border-white/10 bg-black/70 px-5 py-4 text-white shadow-2xl backdrop-blur-xl sm:w-[450px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2 font-bold font-heading capitalize">
              <span className="text-white">Music Player</span>
              <span className="font-normal text-white/30 text-xs">
                ({provider})
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-md p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Player Iframe - Always rendered if url exists */}
          <div
            className={cn(
              "relative overflow-hidden rounded-lg bg-white/5",
              provider === "spotify" ? "h-[352px]" : "h-[200px]",
            )}
          >
            {url ? (
              provider === "spotify" ? (
                <iframe
                  width="100%"
                  height="352"
                  src={url}
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title="Spotify Player"
                  className={cn(
                    "transition-opacity duration-500",
                    isPlaying ? "opacity-100" : "opacity-50",
                  )}
                />
              ) : (
                <iframe
                  width="100%"
                  height="200"
                  src={url}
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title="YouTube Player"
                  className={cn(
                    "transition-opacity duration-500",
                    isPlaying ? "opacity-100" : "opacity-50",
                  )}
                />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-white/30">
                No music loaded
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 font-medium text-sm transition-colors",
                isPlaying
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  : "bg-green-500/20 text-green-500 hover:bg-green-500/30",
              )}
            >
              {isPlaying ? (
                <>
                  <Square className="size-4 fill-current" /> Stop Interaction
                </>
              ) : (
                <>
                  <Play className="size-4 fill-current" /> Enable Interaction
                </>
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-white/30">
            Note: For YouTube/Spotify embeds, you must use the player controls
            inside the frame. "Stop Interaction" just dims the player.
          </p>

          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-white/50" />
              <Input
                placeholder="Paste Spotify or YouTube link..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="border-white/10 bg-white/10 pl-9 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-0"
              />
            </div>
            <Button type="submit" variant="secondary" disabled={!inputUrl}>
              Load
            </Button>
          </form>
          {error && <div className="px-1 text-red-400 text-xs">{error}</div>}
        </div>
      </div>
    </div>
  );
}
