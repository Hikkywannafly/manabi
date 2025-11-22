"use client";

import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SCENES } from "@/features/pomodoro/data/scenes";
import { cn } from "@/lib/utils";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";

export function SceneSelector() {
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
        className="w-auto rounded-3xl border-none bg-black/90 p-3 backdrop-blur-xl"
        align="center"
        sideOffset={20}
      >
        <ScenePicker />
      </PopoverContent>
    </Popover>
  );
}

function ScenePicker() {
  const { currentSceneId, setScene } = usePomodoroStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Scroll to active scene on mount and when changed
  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.querySelector(
        `[data-scene-id="${currentSceneId}"]`,
      );
      if (selectedElement) {
        if (isFirstRender.current) {
          // Immediate scroll without animation for "jump" effect on open
          selectedElement.scrollIntoView({
            behavior: "auto",
            block: "nearest",
            inline: "center",
          });
          isFirstRender.current = false;
        } else {
          // Smooth scroll to center when selection changes
          selectedElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }
  }, [currentSceneId]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Approx one item width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => scroll("left")}
        className="absolute left-1 z-20 flex h-8 w-8 shrink-0 items-center justify-center bg-black/50 text-[#e2b769] transition-all hover:border-[#e2b769] hover:bg-black/80 hover:text-[#e2b769]"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex w-[580px] gap-4 overflow-x-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {SCENES.map((scene) => (
          <button
            key={scene.id}
            data-scene-id={scene.id}
            type="button"
            onClick={() => setScene(scene.id)}
            className={cn(
              "group relative h-[160px] w-[280px] shrink-0 overflow-hidden rounded-xl transition-all duration-500 ease-out",
              "snap-center",
              currentSceneId === scene.id
                ? "z-10 scale-105 shadow-[0_0_20px_rgba(226,183,105,0.3)] ring-2 ring-[#e2b769]"
                : "opacity-50 hover:scale-105 hover:opacity-100",
            )}
          >
            {/* Thumbnail */}
            <Image
              src={scene.thumbnail}
              alt={scene.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300",
                currentSceneId === scene.id
                  ? "opacity-80"
                  : "opacity-60 group-hover:opacity-40",
              )}
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-4 text-center">
              <p
                className={cn(
                  "font-bold text-sm uppercase tracking-widest transition-all duration-300",
                  currentSceneId === scene.id
                    ? "translate-y-0 text-[#e2b769]"
                    : "translate-y-2 text-white/70 group-hover:translate-y-0 group-hover:text-white",
                )}
              >
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
        className="absolute right-1 z-20 flex h-8 w-8 shrink-0 items-center justify-center bg-black/50 text-[#e2b769] transition-all hover:bg-black/80 hover:text-[#e2b769]"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
