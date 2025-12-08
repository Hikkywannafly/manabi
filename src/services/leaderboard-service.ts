import { createClient } from "@/lib/supabase/client";

export type LeaderboardEntry = {
  rank: number;
  user_id: string;
  user: {
    dataset: {
      full_name: string;
      avatar_url: string;
    };
  };
  focus_minutes: number;
  trend?: "up" | "down" | "same";
};

export const leaderboardService = {
  async getDailyLeaderboard() {
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];

    // Query 'profiles' via the relationship. Assuming Supabase detects it automatically.
    // If automatic detection fails, we might need explicit foreign key syntax:
    // .select('*, user:profiles!user_stats_user_id_fkey(*)')
    const { data, error } = await supabase
      .from("user_stats")
      .select(`
        focus_minutes,
        user_id,
        user:profiles (
            full_name,
            avatar_url
        )
      `)
      .eq("date", today)
      .order("focus_minutes", { ascending: false })
      .limit(10);

    if (error) throw error;
    return mapToLeaderboardEntry(data);
  },

  async getWeeklyLeaderboard() {
    const supabase = createClient();
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Client side aggregation for MVP
    const { data, error } = await supabase
      .from("user_stats")
      .select(`
        focus_minutes,
        user_id,
        user:profiles (
            full_name,
            avatar_url
        )
      `)
      .gte("date", sevenDaysAgo.toISOString().split("T")[0]);

    if (error) throw error;
    return aggregateLeaderboard(data);
  },

  async getGlobalLeaderboard() {
    const supabase = createClient();
    // All time stats
    const { data, error } = await supabase.from("user_stats").select(`
        focus_minutes,
        user_id,
        user:profiles (
            full_name,
            avatar_url
        )
      `);

    if (error) throw error;
    return aggregateLeaderboard(data);
  },
};

function mapToLeaderboardEntry(data: any[]): LeaderboardEntry[] {
  return data.map((item, index) => ({
    rank: index + 1,
    user_id: item.user_id,
    user: {
      dataset: {
        full_name: item.user?.full_name || "Unknown",
        avatar_url: item.user?.avatar_url || "",
      },
    },
    focus_minutes: item.focus_minutes,
    trend: "same", // Mock trend for now
  }));
}

function aggregateLeaderboard(data: any[]): LeaderboardEntry[] {
  const map = new Map<string, any>();

  data.forEach((item) => {
    if (!map.has(item.user_id)) {
      map.set(item.user_id, {
        user_id: item.user_id,
        user: item.user,
        focus_minutes: 0,
      });
    }
    const entry = map.get(item.user_id);
    entry.focus_minutes += item.focus_minutes;
  });

  const sorted = Array.from(map.values()).sort(
    (a, b) => b.focus_minutes - a.focus_minutes,
  );
  return mapToLeaderboardEntry(sorted.slice(0, 10));
}
