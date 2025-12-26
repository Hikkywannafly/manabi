"use client";

import {
  Clock,
  Gift,
  MessageCircle,
  StickyNote,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { MusicPlayer } from "./music-player";
import { NightSwitch } from "./night-switch";
import { SceneSelector } from "./scene-selector";
import { RoomWidgets } from "./social";
import { SoundManager } from "./sound-manager";
import { WhiteNoiseMixer } from "./soundscape-mixer";

interface ControlBarProps {
  className?: string;
}

export function ControlBar({ className }: ControlBarProps) {
  const { activeView, setActiveView } = usePomodoroStore();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div
      className={cn(
        "absolute right-0 bottom-0 left-0 z-10 flex flex-row items-center justify-center gap-2 px-4 py-4 transition-all duration-300 ease-in-out sm:justify-between sm:px-6 md:py-6",
        className,
      )}
    >
      {/* Left Toolbar */}
      <div className="relative flex-1 opacity-100 transition duration-500">
        <div className="flex flex-row gap-2 sm:gap-4">
          {/* White Noise Mixer */}
          <WhiteNoiseMixer />

          {/* Music Player */}
          <MusicPlayer />

          {/* Scene Selector */}
          <SceneSelector />

          {/* Night Switch */}
          <NightSwitch />

          {/* Notes */}
          <div className="notes-toolbar-button flex h-[30px] cursor-pointer flex-row items-center justify-center gap-1 rounded-lg bg-black/20 px-2 hover:bg-black/50 sm:h-[40px] sm:rounded-xl sm:px-3">
            <StickyNote className="pointer-events-none text-[20px] text-white" />
          </div>
        </div>
      </div>

      {/* Right Toolbar */}
      <div className="relative flex flex-end items-center gap-2 sm:gap-4">
        {/* Gift */}
        <div className="flex h-[30px] cursor-pointer flex-row items-center justify-center gap-1 rounded-lg bg-black/20 px-2 text-white hover:bg-black/50 sm:h-[40px] sm:rounded-xl sm:px-3">
          <Gift className="text-[20px]" />
        </div>

        {/* Friends */}
        <div className="relative flex h-[30px] cursor-pointer flex-row items-center justify-center gap-1 rounded-lg bg-black/20 px-2 hover:bg-black/50 sm:h-[40px] sm:rounded-xl sm:px-3">
          <Users className="friend-toolbar-button text-[20px] text-white" />
        </div>

        {/* Chat */}
        <button
          type="button"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="chat-toolbar-button relative flex h-[30px] cursor-pointer flex-row items-center justify-center gap-1 rounded-lg bg-black/20 px-2 hover:bg-black/50 sm:h-[40px] sm:rounded-xl sm:px-3"
          aria-label={isChatOpen ? "Close chat" : "Open chat"}
        >
          {isChatOpen ? (
            <X className="text-[20px] text-red-500" />
          ) : (
            <MessageCircle className="text-[20px] text-white" />
          )}
        </button>

        {/* Room Widgets - Controlled by chat button */}
        <RoomWidgets
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
        />
      </div>

      {/* Floating Status Pill (Timer/Mode) */}
      <div className="-translate-x-1/2 absolute bottom-20 left-1/2 transform sm:bottom-24">
        <div className="relative flex h-7 items-end gap-1 rounded-md border border-white/10 bg-black/30 p-0 shadow-lg backdrop-blur-xl sm:h-[35px]">
          {/* Active tab indicator - dynamically positioned */}
          <div
            className={cn(
              "absolute top-0 left-0 z-0 h-full rounded-md bg-gradient-to-tr from-white/70 via-pink-100 to-pink-300 transition-all duration-300 ease-out",
              activeView === "focus"
                ? "translate-x-0"
                : "translate-x-[calc(100%+0.25rem)]",
            )}
            style={{ width: "50px" }}
          />
          <button
            type="button"
            onClick={() => setActiveView("focus")}
            className="group relative z-10 flex cursor-pointer justify-center rounded-md px-2 py-1 font-semibold text-sm transition-all duration-300 hover:scale-110 sm:px-3"
          >
            <Zap
              className={cn(
                "pb-px pl-1 text-[14px] transition-all duration-300 sm:text-[22px]",
                activeView === "focus"
                  ? "text-black drop-shadow-sm"
                  : "text-white group-hover:text-white/80",
              )}
            />
          </button>
          <button
            type="button"
            onClick={() => setActiveView("timer")}
            className="group relative z-10 flex cursor-pointer justify-center rounded-md px-2 py-1 font-semibold text-sm transition-all duration-300 hover:scale-110 sm:px-3"
          >
            <Clock
              className={cn(
                "pb-px pl-1 text-[14px] transition-all duration-300 sm:text-[22px]",
                activeView === "timer"
                  ? "text-black drop-shadow-sm"
                  : "text-white group-hover:text-white/80",
              )}
            />
          </button>
        </div>
      </div>

      {/* Sound Manager (Headless) */}
      <SoundManager />
    </div>
  );
}
