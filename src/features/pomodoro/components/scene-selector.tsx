"use client";

import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
        className="w-auto rounded-3xl border-none bg-black/90 p-4 backdrop-blur-xl"
        align="center"
        sideOffset={20}
      >
        <div className="relative flex items-center gap-2">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="scrollbar-hide flex w-[600px] gap-4 overflow-x-auto px-2 py-1"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => setScene(scene.id)}
                className={cn(
                  "group relative h-[140px] w-[240px] shrink-0 overflow-hidden rounded-xl transition-all duration-300",
                  "snap-center",
                  currentSceneId === scene.id
                    ? "z-10 scale-105"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                {/* Thumbnail */}
                <Image
                  src={scene.thumbnail}
                  alt={scene.name}
                  fill
                  className="object-cover transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-4 text-center">
                  <p className="font-bold text-lg text-white uppercase tracking-wider shadow-black drop-shadow-md">
                    {scene.name}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
