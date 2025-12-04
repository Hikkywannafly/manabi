import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RoomUser } from "@/services/room-service";
import { usePresenceStore } from "@/stores/use-presence-store";

export function usePresenceRealtime(roomId: string | null) {
  const {
    setOnlineUsers,
    addUser,
    removeUser,
    updateUserStatus,
    setIsConnected,
  } = usePresenceStore();

  useEffect(() => {
    if (!roomId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_users",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          // console.log("Realtime update:", payload);
          if (payload.eventType === "INSERT") {
            addUser(payload.new as RoomUser);
          } else if (payload.eventType === "DELETE") {
            removeUser(payload.old.user_id); // Assuming old contains user_id, might need to check payload structure
            // DELETE payload usually contains primary key. room_users PK is id.
            // But we need user_id to remove from our list if we track by user_id.
            // If we track by room_users.id, we can use payload.old.id.
            // Let's assume we might need to fetch fresh list or use ID.
            // For now, let's fetch fresh list on any change to be safe, or improve this logic.
            // Actually, fetching fresh list is safer for consistency.
          } else if (payload.eventType === "UPDATE") {
            updateUserStatus(
              payload.new.user_id,
              (payload.new as RoomUser).status,
            );
          }
        },
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    // Initial fetch
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("room_users")
        .select("*")
        .eq("room_id", roomId);

      if (data) {
        setOnlineUsers(data as RoomUser[]);
      }
    };

    fetchUsers();

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [
    roomId,
    setOnlineUsers,
    addUser,
    removeUser,
    updateUserStatus,
    setIsConnected,
  ]);
}
