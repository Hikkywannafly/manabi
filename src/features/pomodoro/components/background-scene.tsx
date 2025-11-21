"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SCENES, usePomodoroStore } from "@/stores/use-pomodoro-store";

interface BackgroundSceneProps {
  className?: string;
}

export function BackgroundScene({ className }: BackgroundSceneProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { currentSceneId } = usePomodoroStore();

  const currentScene = SCENES.find((s) => s.id === currentSceneId) || SCENES[0];

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
          backgroundImage: `url('${currentScene.thumbnailUrl}')`,
        }}
      />

      {/* Video Background */}
      <video
        key={currentScene.videoUrl} // Force re-render on video change
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
          isVideoLoaded ? "opacity-100" : "opacity-0",
        )}
        src={currentScene.videoUrl}
      />

      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
