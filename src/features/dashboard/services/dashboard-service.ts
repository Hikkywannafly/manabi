import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

export type DashboardStats = {
  quizzesCount: number;
  flashcardsCount: number; // mapping to 'decks' or 'flashcards' count? The UI says "Flashcard sets", so decks.
  collectionsCount: number;
  streak: number;
  xp: number;
  level: number;
};

export type DashboardMission =
  Database["public"]["Tables"]["missions"]["Row"] & {
    progress: number; // mocked for now or calculated
  };

export type LeaderboardUser = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "full_name" | "avatar_url" | "xp" | "level"
>;

export type RecentAchievement = {
  id: string;
  unlocked_at: string;
  achievement: {
    title: string;
    description: string;
    icon: string;
    rarity: string;
    xp_reward: number;
  } | null; // Supabase join can be null if not found (though inner join usually implies existence, but let's be safe)
};

export const DashboardService = {
  async getStats(userId: string): Promise<DashboardStats> {
    const supabase = createClient();

    // Parallel requests for efficiency
    const [
      { count: quizzesCount },
      { count: decksCount },
      { count: collectionsCount },
      { data: profile },
    ] = await Promise.all([
      supabase
        .from("quizzes")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", userId),
      supabase
        .from("decks")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", userId),
      supabase
        .from("collections")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", userId),
      supabase
        .from("profiles")
        .select("current_streak, xp, level")
        .eq("id", userId)
        .single(),
    ]);

    return {
      quizzesCount: quizzesCount || 0,
      flashcardsCount: decksCount || 0,
      collectionsCount: collectionsCount || 0,
      streak: profile?.current_streak || 0,
      xp: profile?.xp || 0,
      level: profile?.level || 1,
    };
  },

  async getMissions(_userId: string): Promise<DashboardMission[]> {
    const supabase = createClient();
    // Assuming we have a way to track user mission progress, but for now fetching active missions
    // In a real app, we'd join with a `user_missions` table.
    // For now, fetching all active missions and mocking progress.
    const { data } = await supabase
      .from("missions")
      .select("*")
      .eq("is_active", true)
      .limit(3);

    if (!data) return [];

    return data.map((mission) => ({
      ...mission,
      progress: 0, // Mock progress for now as requested
    }));
  },

  async getRecentNotes(userId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(3);

    return data || [];
  },

  async getLeaderboard() {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, xp, level")
      .order("xp", { ascending: false })
      .limit(5);

    return (data as LeaderboardUser[]) || [];
  },

  async getRecentAchievements(userId: string): Promise<RecentAchievement[]> {
    const supabase = createClient();
    const { data } = await supabase
      .from("user_achievements")
      .select(`
        id,
        unlocked_at,
        achievement:achievements (
          title,
          description,
          icon,
          rarity,
          xp_reward
        )
      `)
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false })
      .limit(3);

    return (
      (data?.map((item) => ({
        ...item,
        // Handle Supabase returning an array for the relation
        achievement: Array.isArray(item.achievement)
          ? item.achievement[0]
          : item.achievement,
      })) as RecentAchievement[]) || []
    );
  },
};
