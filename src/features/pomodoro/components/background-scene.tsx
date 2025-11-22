"use client";

import { useEffect, useState } from "react";
import { SCENES } from "@/features/pomodoro/data/scenes";
import { cn } from "@/lib/utils";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";

interface BackgroundSceneProps {
  className?: string;
}

function SceneLayer({
  sceneId,
  zIndex,
  onLoaded,
  isfadingOut,
}: {
  sceneId: string;
  zIndex: number;
  onLoaded: () => void;
  isfadingOut?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isDayMode } = usePomodoroStore();
  const scene = SCENES.find((s) => s.id === sceneId);

  if (!scene) return null;

  const handleLoad = () => {
    if (!isLoaded) {
      setIsLoaded(true);
      onLoaded();
    }
  };

  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
        isLoaded && !isfadingOut ? "opacity-100" : "opacity-0",
      )}
      style={{ zIndex }}
    >
      {/* Day Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={handleLoad}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
          isDayMode ? "opacity-100" : "opacity-0",
        )}
        src={scene.variants.day.videoUrl}
      />
      {/* Night Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={handleLoad}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
          !isDayMode ? "opacity-100" : "opacity-0",
        )}
        src={scene.variants.night.videoUrl}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}

export function BackgroundScene({ className }: BackgroundSceneProps) {
  const { currentSceneId } = usePomodoroStore();
  const [scenes, setScenes] = useState<{ id: string; timestamp: number }[]>([
    { id: currentSceneId, timestamp: Date.now() },
  ]);

  // When currentSceneId changes, add it to the stack
  if (scenes[scenes.length - 1].id !== currentSceneId) {
    setScenes((prev) => {
      // Keep only the last one and the new one to avoid stack buildup
      const lastScene = prev[prev.length - 1];
      return [lastScene, { id: currentSceneId, timestamp: Date.now() }];
    });
  }

  const handleSceneLoaded = (loadedSceneId: string) => {
    // Once the new scene is loaded, we can schedule removal of the old ones
    // But we need to wait for the fade-in transition (1000ms)
    setTimeout(() => {
      setScenes((prev) => {
        const index = prev.findIndex((s) => s.id === loadedSceneId);
        // If the scene is found, keep it and everything after it (newer scenes)
        // This removes everything *before* the loaded scene (which are now covered)
        if (index !== -1) {
          return prev.slice(index);
        }
        return prev;
      });
    }, 1000);
  };

  // Safety check to prevent crash if scenes is empty
  const activeScenes =
    scenes.length > 0
      ? scenes
      : [{ id: currentSceneId, timestamp: Date.now() }];

  // When currentSceneId changes, add it to the stack
  useEffect(() => {
    setScenes((prev) => {
      const lastScene = prev[prev.length - 1];
      if (lastScene && lastScene.id === currentSceneId) {
        return prev;
      }
      return [...prev, { id: currentSceneId, timestamp: Date.now() }];
    });
  }, [currentSceneId]);

  return (
    <div
      className={cn("absolute inset-0 z-0 overflow-hidden bg-black", className)}
    >
      {activeScenes.map((scene, index) => (
        <SceneLayer
          key={`${scene.id}-${scene.timestamp}`}
          sceneId={scene.id}
          zIndex={index}
          onLoaded={() => handleSceneLoaded(scene.id)}
        />
      ))}
    </div>
  );
}
