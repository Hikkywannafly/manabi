import { createClient } from "@/lib/supabase/client";

export type DailyStats = {
  date: string;
  focus_minutes: number;
  sessions_count: number;
};

export const statsService = {
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
};
