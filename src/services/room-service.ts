import { createClient } from "@/lib/supabase/client";

export type StudyRoom = {
  id: string;
  name: string;
  owner_id: string;
  is_public: boolean;
  enable_chat: boolean;
  lock_room: boolean;
  discoverable: boolean;
  created_at: string;
};

export type RoomUser = {
  id: string;
  room_id: string;
  user_id: string;
  status: "studying" | "break" | "idle";
  joined_at: string;
};

export const roomService = {
  async createRoom(name: string, settings: Partial<StudyRoom> = {}) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("study_rooms")
      .insert({
        name,
        owner_id: user.id,
        ...settings,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async joinRoom(roomId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Check if already in room? Or just insert (unique constraint handles it?)
    // We have unique(room_id, user_id)

    const { data, error } = await supabase
      .from("room_users")
      .insert({
        room_id: roomId,
        user_id: user.id,
        status: "studying",
      })
      .select()
      .single();

    if (error) {
      // If error is duplicate, maybe just return existing?
      if (error.code === "23505") {
        // unique_violation
        // Fetch existing
        const { data: existing } = await supabase
          .from("room_users")
          .select()
          .eq("room_id", roomId)
          .eq("user_id", user.id)
          .single();
        return existing;
      }
      throw error;
    }
    return data;
  },

  async leaveRoom(roomId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("room_users")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", user.id);

    if (error) throw error;
  },

  async updateRoomSettings(roomId: string, settings: Partial<StudyRoom>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("study_rooms")
      .update(settings)
      .eq("id", roomId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRooms() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("study_rooms")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};
