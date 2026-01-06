import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/db/profile";

export const ProfileService = {
  async getProfile(
    userId: string,
  ): Promise<Profile & { quizzes_count: number; decks_count: number }> {
    const supabase = createClient();

    // Fetch profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }

    // Fetch counts
    const { count: quizzes_count } = await supabase
      .from("quizzes")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId);

    const { count: decks_count } = await supabase
      .from("decks")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId);

    return {
      ...(profile as Profile),
      quizzes_count: quizzes_count || 0,
      decks_count: decks_count || 0,
    };
  },
};
