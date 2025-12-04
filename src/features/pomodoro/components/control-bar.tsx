"use client";

import {
  Clock,
  Gift,
  MessageCircle,
  StickyNote,
  Users,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { MusicPlayer } from "./music-player";
import { NightSwitch } from "./night-switch";
import { SceneSelector } from "./scene-selector";
import { WhiteNoiseMixer } from "./soundscape-mixer";

interface ControlBarProps {
  className?: string;
}

export function ControlBar({ className }: ControlBarProps) {
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
        <div className="chat-toolbar-button relative flex h-[30px] cursor-pointer flex-row items-center justify-center gap-1 rounded-lg bg-black/20 px-2 hover:bg-black/50 sm:h-[40px] sm:rounded-xl sm:px-3">
          <MessageCircle className="text-[20px] text-white" />
        </div>
      </div>

      {/* Floating Status Pill (Timer/Mode) */}
      <div className="-translate-x-1/2 absolute bottom-20 left-1/2 transform sm:bottom-24">
        <div className="relative flex h-[28px] items-end gap-1 rounded-md border border-white/10 bg-black/30 p-0 shadow-lg backdrop-blur-xl sm:h-[35px]">
          <div
            className="absolute top-0 left-0 z-0 h-full rounded-md bg-gradient-to-tr from-white/70 via-pink-100 to-pink-300"
            style={{ left: "1px", width: "50px" }} // Dynamic width based on active tab?
          />
          <button
            type="button"
            className="relative z-10 flex cursor-pointer justify-center rounded-md px-2 py-1 font-semibold text-sm transition-all duration-200 sm:px-3"
          >
            <Zap className="pb-[1px] pl-1 text-[14px] text-black transition-all duration-200 sm:text-[22px]" />
          </button>
          <button
            type="button"
            className="relative z-10 flex cursor-pointer justify-center rounded-md px-2 py-1 font-semibold text-sm transition-all duration-200 sm:px-3"
          >
            <Clock className="pb-[1px] pl-1 text-[14px] text-white transition-all duration-200 sm:text-[22px]" />
            {/* Maybe show time here? */}
          </button>
        </div>
      </div>
    </div>
  );
}
