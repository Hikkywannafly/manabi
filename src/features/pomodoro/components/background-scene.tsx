"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface BackgroundSceneProps {
  className?: string;
}

export function BackgroundScene({ className }: BackgroundSceneProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <div
      className={cn("absolute inset-0 z-0 overflow-hidden bg-black", className)}
    >
      {/* Placeholder/Fallback Image */}
      <div
        className={cn(
          "absolute inset-0 bg-center bg-cover transition-opacity duration-1000",
          isVideoLoaded ? "opacity-0" : "opacity-100",
        )}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2572&auto=format&fit=crop')",
        }}
      />

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
          isVideoLoaded ? "opacity-100" : "opacity-0",
        )}
        src="https://1230610135274225734.discordsays.com/.proxy/static-assets/scenes/chill-vibes/bedroom/videos/day-rain.mp4"
      />

      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
