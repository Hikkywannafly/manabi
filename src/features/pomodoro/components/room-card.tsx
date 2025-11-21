"use client";

import { Share2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
export function RoomCard() {
  const { isRoomSettingsOpen, toggleRoomSettings } = usePomodoroStore();

  if (!isRoomSettingsOpen) return null;

  return (
    <div className="absolute top-20 right-4 z-50 w-[350px] max-w-[calc(100vw-2rem)]">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/90 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-white/10 border-b p-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex items-center gap-2 text-white">
              <Users className="size-4" />
              <h3 className="truncate font-semibold">nyankoisca's room</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 rounded-md bg-white/10 px-2 text-xs hover:bg-white/20 hover:text-white"
            >
              <Share2 className="size-3" />
              Share
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-white/50 hover:text-white"
            onClick={toggleRoomSettings}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          <div className="space-y-1.5">
            <Label className="block font-medium text-white/60 text-xs">
              Name
            </Label>
            <Input
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-blue-500"
              placeholder="Enter room name"
              defaultValue="nyankoisca's room"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="block font-medium text-white/60 text-xs">
              About
            </Label>
            <Input
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-blue-500"
              placeholder="Describe your study room"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="block font-medium text-white/60 text-xs">
              Room handle
            </Label>
            <Input
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-blue-500"
              defaultValue="focus-station-8470-can"
            />
            <p className="text-white/40 text-xs">
              Must be 4-16 characters long and unique.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-white/60">
                Enable chat during Pomodoro
              </Label>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-white/60">
                Lock room (no new members)
              </Label>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="block text-sm text-white/60">
                  Discoverable
                </Label>
                <span className="block text-white/40 text-xs">
                  Make your room discoverable by others.
                </span>
              </div>
              <Switch />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button className="bg-white text-black hover:bg-white/90">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
