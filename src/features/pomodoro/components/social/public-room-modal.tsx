"use client";

import { ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
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
    <div className="fade-in fixed inset-0 z-[999999] flex animate-in items-center justify-center bg-black/70 p-4 backdrop-blur-sm duration-200">
      <div className="relative flex max-h-[80%] w-[900px] max-w-5xl flex-col overflow-hidden rounded-2xl bg-black/90 p-4 text-white shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex w-full items-center justify-between">
            <h2 className="font-bold text-lg sm:text-2xl">
              📚 Focus Together Rooms
            </h2>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 cursor-pointer text-white/60 text-xl hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="hide-scrollbar flex flex-1 flex-col overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/80">
                Jump into a public room and focus together.
              </p>
            </div>

            {/* Table Container */}
            <div className="hide-scrollbar max-h-[500px] overflow-x-auto">
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
                <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                  <thead>
                    <tr className="border-white/10 border-b text-white/70">
                      <th className="px-4 py-2">Name</th>
                      <th className="hidden px-4 py-2 sm:table-cell">About</th>
                      <th className="px-4 py-2">Members</th>
                      <th className="hidden px-4 py-2 sm:table-cell">Host</th>
                      <th className="px-4 py-2 text-center" />
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => {
                      const isCurrentRoom = currentRoom?.id === room.id;

                      return (
                        <tr
                          key={room.id}
                          className={cn(
                            "rounded-xl bg-white/5 transition-colors hover:bg-white/10",
                            isCurrentRoom &&
                              "bg-green-500/10 hover:bg-green-500/15",
                          )}
                        >
                          {/* Name */}
                          <td className="px-4 py-3 font-semibold text-white">
                            {room.name || "Unnamed Room"}
                          </td>

                          {/* About */}
                          <td className="hidden max-w-[250px] truncate px-4 py-3 text-white/60 sm:table-cell">
                            {room.about || "—"}
                          </td>

                          {/* Members */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="-space-x-2 flex">
                                {room.room_users?.slice(0, 3).map((u, i) => (
                                  <div
                                    key={u.user_id || i}
                                    className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-black font-bold text-sm text-white sm:text-base"
                                  >
                                    {u.profile?.avatar_url ? (
                                      <Image
                                        src={u.profile.avatar_url}
                                        alt=""
                                        fill
                                        sizes="40px"
                                        className="rounded-full object-cover"
                                      />
                                    ) : (
                                      <span className="uppercase">
                                        {u.profile?.nickname?.slice(0, 2) ||
                                          u.profile?.nickname?.[0] ||
                                          "?"}
                                      </span>
                                    )}
                                  </div>
                                ))}
                                {(!room.room_users ||
                                  room.room_users.length === 0) && (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black font-bold text-sm text-white/50">
                                    0
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Host */}
                          <td className="hidden px-4 py-3 text-white/70 sm:table-cell">
                            {room.owner?.nickname || "Unknown"}
                          </td>

                          {/* Join Button */}
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              disabled={isCurrentRoom}
                              onClick={() => handleJoin(room.id)}
                              className={cn(
                                "mx-auto flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-1.5 font-medium text-sm text-white transition-colors",
                                isCurrentRoom
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-white/10 hover:bg-white/20",
                              )}
                            >
                              {isCurrentRoom ? "Joined" : "Join"}
                              {!isCurrentRoom && (
                                <ArrowRight className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
