"use client";

import { LogOut, Save, Settings, Users, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { usePomodoroStore } from "@/stores/use-pomodoro-store";
import { useRoomStore } from "@/stores/use-room-store";

export function RoomSettingsSidebar() {
  const { isRoomSettingsOpen, toggleRoomSettings } = usePomodoroStore();
  const { currentRoom, updateRoomProfile, leaveRoom, isLoading } =
    useRoomStore();

  const [activeTab, setActiveTab] = useState<"members" | "settings">("members");
  const [members, setMembers] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Settings state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [about, setAbout] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [discoverable, setDiscoverable] = useState(true);
  const [lockRoom, setLockRoom] = useState(false);
  const [enableChat, setEnableChat] = useState(true);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // Fetch members
  useEffect(() => {
    if (!currentRoom) return;

    const fetchMembers = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("room_users")
        .select(
          `
          user_id,
          status,
          joined_at,
          profile:profiles(nickname, avatar_url)
        `,
        )
        .eq("room_id", currentRoom.id)
        .order("joined_at", { ascending: true });

      if (data) {
        setMembers(data);
      }
    };

    fetchMembers();

    // Subscribe to realtime changes
    const supabase = createClient();
    const channel = supabase
      .channel(`room_users_sidebar:${currentRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_users",
          filter: `room_id=eq.${currentRoom.id}`,
        },
        () => {
          fetchMembers();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRoom?.id, currentRoom]);

  // Sync settings when room changes
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

  const isOwner = currentRoom?.owner_id === currentUserId;

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
    } catch (error: any) {
      toast.error(error.message || "Failed to update room settings");
    }
  };

  const handleLeaveRoom = async () => {
    if (!confirm("Are you sure you want to leave this room?")) return;

    try {
      await leaveRoom();
      toggleRoomSettings();
      toast.success("Left room successfully");
    } catch (_error: any) {
      toast.error("Failed to leave room");
    }
  };

  if (!(isRoomSettingsOpen && currentRoom)) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[60] w-[400px] max-w-full transform overflow-y-auto border-white/10 border-l bg-black/95 shadow-2xl backdrop-blur-xl transition-transform duration-300">
      {/* Header */}
      <div className="border-white/10 border-b bg-white/5 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold font-heading text-2xl text-white">
            {currentRoom.name}
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

        {/* Tabs - Only show if owner */}
        {isOwner && (
          <div className="flex gap-1 rounded-lg bg-black/40 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("members")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 font-bold text-xs transition-all",
                activeTab === "members"
                  ? "bg-white/20 text-white"
                  : "text-white/50 hover:text-white",
              )}
            >
              <Users className="h-4 w-4" />
              Members ({members.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 font-bold text-xs transition-all",
                activeTab === "settings"
                  ? "bg-white/20 text-white"
                  : "text-white/50 hover:text-white",
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "members" || !isOwner ? (
          /* Members List */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">
                Room Members ({members.length})
              </h3>
            </div>

            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-800 text-sm text-white">
                    {member.profile?.avatar_url ? (
                      <Image
                        src={member.profile.avatar_url}
                        alt=""
                        fill
                        sizes="40px"
                        className="rounded-full object-cover"
                      />
                    ) : (
                      member.profile?.nickname?.[0] || "U"
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        {member.profile?.nickname || "Unknown"}
                      </span>
                      {member.user_id === currentRoom.owner_id && (
                        <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 font-semibold text-xs text-yellow-500">
                          Owner
                        </span>
                      )}
                      {member.user_id === currentUserId && (
                        <span className="rounded-full bg-blue-500/20 px-2 py-0.5 font-semibold text-blue-500 text-xs">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-white/40 text-xs capitalize">
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Leave Room Button - Only for non-owners */}
            {!isOwner && (
              <div className="pt-4">
                <Button
                  onClick={handleLeaveRoom}
                  variant="outline"
                  className="h-12 w-full border-red-500/50 bg-red-500/10 font-bold text-red-500 hover:bg-red-500/20"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Leave Room
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Settings - Owner Only */
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
                  <p className="text-sm text-white/50">
                    Show in public room list
                  </p>
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
        )}
      </div>
    </div>
  );
}
