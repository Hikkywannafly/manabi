"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SCENES, usePomodoroStore } from "@/stores/use-pomodoro-store";
export function SceneSelector() {
  const { currentSceneId, setScene } = usePomodoroStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white"
          title="Scenes"
        >
          <ImageIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full min-w-[320px] border-white/10 bg-black/90 p-2 backdrop-blur-xl"
        align="center"
        sideOffset={10}
      >
        <div className="space-y-1">
          <h4 className="mb-2 px-2 font-medium text-sm text-white/50">
            Select Scene
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => setScene(scene.id)}
                className={cn(
                  "group relative aspect-video w-full overflow-hidden rounded-lg border transition-all",
                  currentSceneId === scene.id
                    ? "border-white ring-1 ring-white"
                    : "border-transparent hover:border-white/50",
                )}
              >
                <Image
                  src={scene.thumbnailUrl}
                  alt={scene.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 font-medium text-white text-xs">
                  {scene.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
