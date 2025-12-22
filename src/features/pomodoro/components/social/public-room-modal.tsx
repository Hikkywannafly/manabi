"use client";

import { Globe, Search, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { roomService, type StudyRoom } from "@/services/room-service";
import { useRoomStore } from "@/stores/use-room-store";

interface PublicRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublicRoomModal({ isOpen, onClose }: PublicRoomModalProps) {
  const { joinRoom, currentRoom } = useRoomStore();
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roomService.getPublicRooms();
      setRooms(data);
    } catch (error) {
      console.error("Failed to load public rooms:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadRooms();
    }
  }, [isOpen, loadRooms]);

  const handleJoin = async (roomId: string) => {
    try {
      await joinRoom(roomId);
      onClose();
    } catch (error) {
      console.error("Failed to join room:", error);
      alert("Failed to join room. Please try again.");
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.about?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.owner?.nickname.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <div className="fade-in fixed inset-0 z-[100] flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-md duration-200">
      <div
        className="flex h-[600px] max-h-[90vh] w-[800px] max-w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-2xl"
        style={{
          boxShadow: "0 0 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-white/5 border-b p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-2 text-white">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-white text-xl tracking-tight">
                Focus Together Rooms
              </h2>
              <p className="text-sm text-white/50">
                Jump into a public room and focus together.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-white/50 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex shrink-0 gap-3 border-white/5 border-b bg-white/[0.02] p-4">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-white/30" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by room name, host, or description..."
              className="rounded-xl border-white/10 bg-[#0a0a0a] pl-9 text-white focus:border-white/20"
            />
          </div>
        </div>

        {/* Room List */}
        <div className="scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex h-40 items-center justify-center text-white/30">
              Loading rooms...
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-white/30">
              <Globe className="mb-2 h-8 w-8 opacity-50" />
              <p>No rooms found matching your search</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {/* Header Row */}
              <div className="grid grid-cols-[2fr,2fr,1fr,100px] px-6 py-2 font-semibold text-white/30 text-xs uppercase tracking-wider">
                <div>Name</div>
                <div>About</div>
                <div className="text-center">Members</div>
                <div className="text-right">Host</div>
              </div>

              {/* Rows */}
              {filteredRooms.map((room) => {
                const isCurrentRoom = currentRoom?.id === room.id;

                return (
                  <div
                    key={room.id}
                    className={cn(
                      "group grid grid-cols-[2fr,2fr,1fr,100px] items-center rounded-xl border border-transparent px-6 py-4 transition-all duration-200",
                      isCurrentRoom
                        ? "border-white/10 bg-white/5"
                        : "hover:border-white/5 hover:bg-white/5",
                    )}
                  >
                    {/* Name */}
                    <div className="flex flex-col">
                      <span className="font-bold text-white transition-colors group-hover:text-blue-200">
                        {room.name}
                      </span>
                      {room.slug && (
                        <span className="truncate text-white/30 text-xs">
                          /{room.slug}
                        </span>
                      )}
                    </div>

                    {/* About */}
                    <div className="truncate pr-4 text-sm text-white/50">
                      {room.about || "—"}
                    </div>

                    {/* Members */}
                    <div className="-space-x-2 flex justify-center">
                      {room.room_users?.slice(0, 3).map((u, i) => (
                        <div
                          key={i}
                          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-[#0f0f0f] bg-neutral-800 text-white text-xs"
                        >
                          {u.profile?.avatar_url ? (
                            <Image
                              src={u.profile.avatar_url}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            u.profile?.nickname?.[0] || "?"
                          )}
                        </div>
                      ))}
                      {(room.room_users?.length || 0) > 3 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0f0f0f] bg-neutral-800 text-white/50 text-xs">
                          +{(room.room_users?.length || 0) - 3}
                        </div>
                      )}
                    </div>

                    {/* Host & Action */}
                    <div className="flex items-center justify-end gap-3">
                      <span className="hidden max-w-[80px] truncate text-right text-white/50 text-xs sm:inline-block">
                        {room.owner?.nickname || "Unknown"}
                      </span>

                      <Button
                        size="sm"
                        disabled={isCurrentRoom}
                        onClick={() => handleJoin(room.id)}
                        className={cn(
                          "h-8 rounded-lg px-4 font-semibold shadow-none transition-all",
                          isCurrentRoom
                            ? "bg-green-500/20 text-green-500 hover:bg-green-500/20"
                            : "bg-white/10 text-white hover:bg-white hover:text-black",
                        )}
                      >
                        {isCurrentRoom ? "Joined" : "Join"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
