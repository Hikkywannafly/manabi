"use client";

import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { useRoomStore } from "@/stores/use-room-store";

export function RoomSettingsSidebar() {
  const { isRoomSettingsOpen, toggleRoomSettings } = usePomodoroStore();
  const { currentRoom, updateRoomProfile, isLoading } = useRoomStore();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [about, setAbout] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [discoverable, setDiscoverable] = useState(true);
  const [lockRoom, setLockRoom] = useState(false);
  const [enableChat, setEnableChat] = useState(true);

  // Sync logic: update local state when room data changes
  useEffect(() => {
    if (currentRoom) {
      setName(currentRoom.name || "");
      setSlug(currentRoom.slug || "");
      setAbout(currentRoom.about || "");
      setIsPublic(currentRoom.is_public ?? true);
      setDiscoverable(currentRoom.discoverable ?? true);
      setLockRoom(currentRoom.lock_room ?? false);
      setEnableChat(currentRoom.enable_chat ?? true);
    }
  }, [currentRoom]);

  const handleSave = async () => {
    try {
      await updateRoomProfile({
        name,
        slug,
        about,
        is_public: isPublic,
        discoverable,
        lock_room: lockRoom,
        enable_chat: enableChat,
      });
      toast.success("Room settings updated successfully");
      toggleRoomSettings();
    } catch (error: any) {
      console.error("Failed to update room settings:", error);
      toast.error(error.message || "Failed to update room settings");
    }
  };

  if (!isRoomSettingsOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[60] w-[400px] max-w-full transform overflow-y-auto border-white/10 border-l bg-black/95 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-bold font-heading text-2xl text-white">
          Room Settings
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRoomSettings}
          className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="room-name" className="text-white/80">
            Room Name
          </Label>
          <Input
            id="room-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-white/10 bg-white/5 text-white focus:border-yellow-500/50 focus:ring-yellow-500/50"
            placeholder="e.g. Nyanko's Study Space"
          />
        </div>

        {/* Slug (Handle) */}
        <div className="space-y-2">
          <Label htmlFor="room-slug" className="text-white/80">
            Room Handle (Slug)
          </Label>
          <div className="relative">
            <span className="-translate-y-1/2 absolute top-1/2 left-3 text-sm text-white/30">
              manabi.io/room/
            </span>
            <Input
              id="room-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border-white/10 bg-white/5 pl-32 text-white focus:border-yellow-500/50 focus:ring-yellow-500/50"
              placeholder="my-room"
            />
          </div>
          <p className="text-white/40 text-xs">Unique URL for your room.</p>
        </div>

        {/* About */}
        <div className="space-y-2">
          <Label htmlFor="room-about" className="text-white/80">
            About
          </Label>
          <Textarea
            id="room-about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="min-h-[100px] border-white/10 bg-white/5 text-white focus:border-yellow-500/50 focus:ring-yellow-500/50"
            placeholder="What are you studying today?"
          />
        </div>

        <div className="my-6 h-px bg-white/10" />

        {/* Toggles */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-white">Discoverable</Label>
              <p className="text-sm text-white/50">Show in public room list</p>
            </div>
            <Switch
              checked={discoverable}
              onCheckedChange={setDiscoverable}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-white">Lock Room</Label>
              <p className="text-sm text-white/50">
                Prevent new members from joining
              </p>
            </div>
            <Switch
              checked={lockRoom}
              onCheckedChange={setLockRoom}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-white">Enable Chat</Label>
              <p className="text-sm text-white/50">
                Allow messaging in this room
              </p>
            </div>
            <Switch
              checked={enableChat}
              onCheckedChange={setEnableChat}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </div>

        <div className="pt-8">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 font-bold text-black text-md shadow-lg shadow-orange-500/20 hover:from-yellow-400 hover:to-orange-400"
          >
            {isLoading ? "Saving..." : "Save Settings"}
            {!isLoading && <Save className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
