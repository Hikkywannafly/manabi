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
    progress: number; // percentage
    current_value?: number; // actual count
    status?: "IN_PROGRESS" | "COMPLETED" | "CLAIMED";
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
        .maybeSingle(),
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

  async getMissions(userId: string): Promise<DashboardMission[]> {
    const { MissionService } = await import("@/services/mission-service");

    // Get missions with real progress from MissionService
    const missions = await MissionService.getUserMissions(userId);

    // Map to DashboardMission format
    return missions.map((um) => ({
      ...um.mission,
      progress: um.progress_percentage,
      current_value: um.current_value,
      status: um.status,
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

  async getLeaderboard(
    timeframe: "daily" | "weekly" | "alltime" = "weekly",
  ): Promise<LeaderboardUser[]> {
    const supabase = createClient();

    // Map timeframe to RPC function
    const rpcFunctionMap = {
      daily: "get_daily_xp_leaderboard",
      weekly: "get_weekly_xp_leaderboard",
      alltime: "get_alltime_xp_leaderboard",
    };

    const { data, error } = await supabase.rpc(
      rpcFunctionMap[timeframe] as any,
    );

    if (error) {
      console.error(`Failed to fetch ${timeframe} leaderboard:`, error);
      return [];
    }

    // Map RPC result to LeaderboardUser type
    return (
      data?.map((item: any) => ({
        id: item.user_id,
        full_name: item.full_name,
        avatar_url: item.avatar_url,
        level: item.level,
        xp: item.total_xp_earned,
      })) || []
    );
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
