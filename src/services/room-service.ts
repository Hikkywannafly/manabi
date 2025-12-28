import { createClient } from "@/lib/supabase/client";

export type StudyRoom = {
  id: string;
  name: string;
  slug?: string | null;
  about?: string | null;
  owner_id: string | null;
  is_public: boolean | null;
  enable_chat: boolean | null;
  lock_room: boolean | null;
  discoverable: boolean | null;
  created_at: string;
  owner?: {
    nickname: string;
    avatar_url?: string | null;
  } | null;
  room_users?: {
    user_id: string;
    status: string | null;
    profile?: {
      nickname: string;
      avatar_url?: string | null;
    } | null;
  }[];
};

export type RoomUser = {
  id: string;
  room_id: string;
  user_id: string;
  status: "studying" | "break" | "idle";
  joined_at: string;
  profile?: {
    nickname: string;
    avatar_url?: string | null;
  } | null;
};

export const roomService = {
  async createRoom(name: string, settings: Partial<StudyRoom> = {}) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Check if user already has a personal room (rooms they own)
    const { data: existingRoom } = await supabase
      .from("study_rooms")
      .select("*")
      .eq("owner_id", user.id)
      .single();

    if (existingRoom) {
      return existingRoom;
    }

    const { data, error } = await supabase
      .from("study_rooms")
      .insert({
        name,
        owner_id: user.id,
        is_public: true, // Default to true
        discoverable: true, // Default to true
        ...settings,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRoomSettings(roomId: string, settings: Partial<StudyRoom>) {
    const supabase = createClient();

    // Build update object only with valid columns
    const updateData: any = {};
    if (settings.name !== undefined) updateData.name = settings.name;
    if (settings.slug !== undefined) updateData.slug = settings.slug;
    if (settings.about !== undefined) updateData.about = settings.about;
    if (settings.is_public !== undefined) {
      updateData.is_public = settings.is_public;
    }
    if (settings.enable_chat !== undefined) {
      updateData.enable_chat = settings.enable_chat;
    }
    if (settings.lock_room !== undefined) {
      updateData.lock_room = settings.lock_room;
    }
    if (settings.discoverable !== undefined) {
      updateData.discoverable = settings.discoverable;
    }

    const { data, error } = await supabase
      .from("study_rooms")
      .update(updateData)
      .eq("id", roomId)
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

    // First leave any current room to ensure we are only in one room
    await this.leaveAllRooms(user.id);

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
      if (error.code === "23505") {
        // Already in this room, fetch and return
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

  async leaveAllRooms(userId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("room_users")
      .delete()
      .eq("user_id", userId);

    if (error) console.error("Error leaving all rooms:", error);
  },

  async getCurrentUserRoom() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("room_users")
      .select("room_id")
      .eq("user_id", user.id)
      .single();

    if (error) {
      // User not in any room
      return null;
    }
    return data;
  },

  async getRoom(roomId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("study_rooms")
      .select(`
        *,
        owner:profiles(nickname, avatar_url),
        room_users(
          user_id,
          status,
          profile:profiles(nickname, avatar_url)
        )
      `)
      .eq("id", roomId)
      .single();

    if (error) throw error;
    return data;
  },

  /*
   * Get list of public rooms with their active members
   */
  async getPublicRooms() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("study_rooms")
      .select(`
        *,
        owner:profiles(nickname, avatar_url),
        room_users(
          user_id,
          status,
          profile:profiles(nickname, avatar_url)
        )
      `)
      .eq("discoverable", true)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  },
};
