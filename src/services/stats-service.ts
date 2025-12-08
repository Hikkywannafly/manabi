import { createClient } from "@/lib/supabase/client";

export type DailyStats = {
  date: string;
  focus_minutes: number;
  sessions_count: number;
};

export const statsService = {
  async getStreak(userId: string) {
    const supabase = createClient();

    // Get distinct dates with activity
    const { data, error } = await supabase
      .from("user_stats")
      .select("date")
      .eq("user_id", userId)
      .gt("focus_minutes", 0) // Only count days with focus
      .order("date", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return 0;

    const dates = data.map((d) => new Date(d.date).toISOString().split("T")[0]);
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    // Check if streak is active (today or yesterday)
    // If the latest date is not today and not yesterday, streak is broken -> 0
    if (dates[0] !== today && dates[0] !== yesterday) {
      return 0;
    }

    let streak = 0;
    let currentDate = new Date(dates[0]);

    for (let i = 0; i < dates.length; i++) {
      const dateStr = dates[i];
      const date = new Date(dateStr);

      // If it's the first date (which we confirmed is close to today)
      if (i === 0) {
        streak++;
        currentDate = date;
        continue;
      }

      // Check if previous date is exactly one day before current checked date
      const diffStats = Math.floor(
        (currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffStats === 1) {
        streak++;
        currentDate = date;
      } else {
        break;
      }
    }

    return streak;
  },

  async getDailyStats(userId: string, date: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .eq("date", date)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"
    return data || { focus_minutes: 0, sessions_count: 0 };
  },

  async getWeeklyStats(userId: string) {
    const supabase = createClient();
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .gte("date", sevenDaysAgo.toISOString().split("T")[0])
      .lte("date", today.toISOString().split("T")[0])
      .order("date", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getMonthlyStats(userId: string) {
    const supabase = createClient();
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
      .lte("date", today.toISOString().split("T")[0])
      .order("date", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async incrementDailyStats(userId: string, minutes: number) {
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];

    // Try to get existing stats
    const { data: existingStats, error: fetchError } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    if (existingStats) {
      const { error } = await supabase
        .from("user_stats")
        .update({
          focus_minutes: existingStats.focus_minutes + minutes,
          sessions_count: existingStats.sessions_count + 1,
        })
        .eq("id", existingStats.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("user_stats").insert({
        user_id: userId,
        date: today,
        focus_minutes: minutes,
        sessions_count: 1,
      });

      if (error) throw error;
    }
  },
};
