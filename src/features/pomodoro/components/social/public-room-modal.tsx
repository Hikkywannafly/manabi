"use client";

import { ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

  if (!isOpen) return null;

  return (
    <div className="fade-in fixed inset-0 z-[100] flex animate-in items-center justify-center bg-black/70 p-4 backdrop-blur-sm duration-200">
      <div className="relative flex max-h-[85vh] w-[900px] max-w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="shrink-0 px-8 pt-8 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪟</span>
            <h2 className="font-bold text-2xl text-white tracking-tight">
              Focus Together Rooms
            </h2>
          </div>
          <p className="mt-1 text-sm text-white/50">
            Jump into a public room and focus together.
          </p>
        </div>

        {/* Table Header */}
        <div className="grid shrink-0 grid-cols-[1.5fr,1.5fr,1fr,1fr,100px] items-center border-white/5 border-b px-8 py-3 text-white/40 text-xs uppercase tracking-wider">
          <div>Name</div>
          <div>About</div>
          <div>Members</div>
          <div>Host</div>
          <div />
        </div>

        {/* Room List */}
        <div className="scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-40 items-center justify-center text-white/30">
              Loading rooms...
            </div>
          ) : rooms.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-white/30">
              <span className="mb-2 text-3xl">🌐</span>
              <p>No public rooms available</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {rooms.map((room, index) => {
                const isCurrentRoom = currentRoom?.id === room.id;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={room.id}
                    className={cn(
                      "grid grid-cols-[1.5fr,1.5fr,1fr,1fr,100px] items-center px-8 py-4 transition-colors",
                      isEven ? "bg-white/[0.02]" : "bg-transparent",
                      isCurrentRoom && "bg-green-500/5",
                    )}
                  >
                    {/* Name */}
                    <div className="pr-4">
                      <span className="font-semibold text-white">
                        {room.name}
                      </span>
                    </div>

                    {/* About */}
                    <div className="truncate pr-4 text-sm text-white/50">
                      {room.about || "—"}
                    </div>

                    {/* Members */}
                    <div className="-space-x-2 flex">
                      {room.room_users?.slice(0, 3).map((u, i) => (
                        <div
                          key={u.user_id || i}
                          className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#141414] bg-neutral-700 font-medium text-white text-xs"
                        >
                          {u.profile?.avatar_url ? (
                            <Image
                              src={u.profile.avatar_url}
                              alt=""
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="uppercase">
                              {u.profile?.nickname?.[0] || "?"}
                            </span>
                          )}
                        </div>
                      ))}
                      {(room.room_users?.length || 0) > 3 && (
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#141414] bg-neutral-600 font-medium text-white/70 text-xs">
                          +{(room.room_users?.length || 0) - 3}
                        </div>
                      )}
                      {(!room.room_users || room.room_users.length === 0) && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-700 font-medium text-white/50 text-xs">
                          0
                        </div>
                      )}
                    </div>

                    {/* Host */}
                    <div className="truncate pr-4 text-sm text-white/70">
                      {room.owner?.nickname || "Unknown"}
                    </div>

                    {/* Join Button */}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        disabled={isCurrentRoom}
                        onClick={() => handleJoin(room.id)}
                        className={cn(
                          "h-9 gap-1.5 rounded-lg px-4 font-semibold shadow-none transition-all",
                          isCurrentRoom
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                            : "bg-white/10 text-white hover:bg-white/20",
                        )}
                      >
                        {isCurrentRoom ? "Joined" : "Join"}
                        {!isCurrentRoom && <ArrowRight className="h-4 w-4" />}
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
