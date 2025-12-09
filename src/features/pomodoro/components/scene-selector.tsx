"use client";

import { CloudUpload, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SCENES } from "@/features/pomodoro/data/scenes";
import { cn } from "@/lib/utils";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";

export function SceneSelector() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex h-[100px] cursor-pointer flex-row items-center justify-center gap-1 rounded-lg bg-black/20 px-2 hover:bg-black/50 sm:h-[40px] sm:rounded-xl sm:px-3">
          <ImageIcon className="pointer-events-none text-[20px] text-white" />
        </div>
      </DialogTrigger>
      {/*
        Changes:
        - Fixed height h-[90vh] ensures the flex-grow scroll area works reliably.
        - max-w-[90vw] makes it large.
      */}
      <DialogContent className="flex h-[90vh] w-[95vw] max-w-[95vw] flex-col overflow-hidden rounded-2xl border-none bg-black/90 p-0 text-white shadow-2xl backdrop-blur-xl sm:max-w-6xl">
        <ScenePicker />
      </DialogContent>
    </Dialog>
  );
}

function ScenePicker() {
  const { currentSceneId, setScene } = usePomodoroStore();
  const [subTab, setSubTab] = useState<"motion" | "stills" | "personalize">(
    "motion",
  );

  return (
    <div className="flex h-full flex-col overflow-hidden p-6 sm:p-8">
      {/* Header */}
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <h2 className="font-bold text-lg sm:text-2xl">Set your focus scene</h2>
        <DialogClose asChild>
          <button
            type="button"
            className="text-white/60 text-xl hover:text-white"
          >
            <X className="size-6" />
          </button>
        </DialogClose>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Sub Tabs */}
        <div className="mb-6 flex shrink-0 border-white/10 border-b">
          <button
            type="button"
            onClick={() => setSubTab("motion")}
            className={cn(
              "flex-1 border-b-[0.5px] py-3 font-medium text-sm transition-colors sm:px-6",
              subTab === "motion"
                ? "border-white font-bold text-white"
                : "border-transparent text-white/50 hover:text-white",
            )}
          >
            Motion
          </button>
          <button
            type="button"
            onClick={() => setSubTab("stills")}
            className={cn(
              "flex-1 border-b-[0.5px] py-3 font-medium text-sm transition-colors sm:px-6",
              subTab === "stills"
                ? "border-white font-bold text-white"
                : "border-transparent text-white/50 hover:text-white",
            )}
          >
            Stills
          </button>
          <button
            type="button"
            onClick={() => setSubTab("personalize")}
            className={cn(
              "flex-1 border-b-[0.5px] py-3 font-medium text-sm transition-colors sm:px-6",
              subTab === "personalize"
                ? "border-white font-bold text-white"
                : "border-transparent text-white/50 hover:text-white",
            )}
          >
            Personalize
          </button>
        </div>

        {/* Content */}
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-2">
          {subTab === "motion" && (
            <div className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3">
              {SCENES.map((scene) => (
                <button
                  type="button"
                  key={scene.id}
                  onClick={() => setScene(scene.id)}
                  className={cn(
                    "group relative aspect-video overflow-hidden rounded-lg transition-all",
                    currentSceneId === scene.id
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={scene.thumbnail}
                    alt={scene.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20" />

                  {/* Selected Indicator (Checkmark) - Optional replacement for ring */}
                  {currentSceneId === scene.id && (
                    <div className="absolute top-2 right-2 rounded-full bg-white p-1 text-black">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 text-left">
                    <span className="font-medium text-white text-xs">
                      {scene.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {subTab === "stills" && (
            <div className="flex h-40 items-center justify-center text-white/50">
              <p>Coming soon...</p>
            </div>
          )}

          {subTab === "personalize" && (
            <div className="space-y-4">
              <div className="cursor-pointer rounded-lg border-2 border-white/50 border-dashed p-8 text-center transition-colors hover:border-white hover:bg-white/10">
                <CloudUpload className="mx-auto mb-2 size-10 text-white/50" />
                <div className="mb-2 flex flex-row items-center justify-center gap-2 text-white">
                  <span>Bring your own photo</span>
                  <div className="rounded-lg bg-white/10 px-2 py-0.5 font-extrabold font-title text-3xl text-sm text-yellow-400">
                    <span className="font-extrabold italic">Plus</span>
                  </div>
                </div>
                <p className="text-sm text-white/50">
                  Maximum 10MB • JPG, PNG, GIF
                </p>
              </div>
              <input accept="image/*" className="hidden" type="file" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
