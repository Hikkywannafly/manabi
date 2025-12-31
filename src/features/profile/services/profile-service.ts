import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/db/profile";

export const ProfileService = {
  async getProfile(userId: string): Promise<Profile> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }

    return data as Profile;
  },
};
