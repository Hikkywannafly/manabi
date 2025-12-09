import { createClient } from "@/lib/supabase/client";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement: Achievement;
};

export const achievementService = {
  async getAchievements() {
    const supabase = createClient();
    const { data, error } = await supabase.from("achievements").select("*");
    if (error) throw error;
    return data as Achievement[];
  },

  async getUserAchievements(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_achievements")
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq("user_id", userId);

    if (error) throw error;
    return data as UserAchievement[];
  },

  async checkAndUnlockAchievements(userId: string) {
    const supabase = createClient();

    // Fetch all stats for user (careful with performance)
    const { data: allStats } = await supabase
      .from("user_stats")
      .select("focus_minutes, sessions_count")
      .eq("user_id", userId);

    if (!allStats) return;

    const totalMinutes = allStats.reduce(
      (acc, curr) => acc + curr.focus_minutes,
      0,
    );
    const totalSessions = allStats.reduce(
      (acc, curr) => acc + curr.sessions_count,
      0,
    );

    // 2. Define milestones
    const milestones = [
      {
        id: "first-session",
        title: "First Step",
        description: "Complete your first session",
        icon: "🌱",
        condition: () => totalSessions >= 1,
      },
      {
        id: "10-sessions",
        title: "Dedicated",
        description: "Complete 10 sessions",
        icon: "🔥",
        condition: () => totalSessions >= 10,
      },
      {
        id: "100-minutes",
        title: "Focused",
        description: "Reach 100 minutes of focus",
        icon: "🧠",
        condition: () => totalMinutes >= 100,
      },
    ];

    // 3. Check and unlock
    // First get existing unlocks
    const { data: existingUnlocks } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId);

    const unlockedIds = new Set(existingUnlocks?.map((u) => u.achievement_id));

    // We need achievement IDs from DB.
    // Assuming 'achievements' table is populated with these titles or we map them.
    // For this implementation, I'll try to find achievement by title in DB, if not exists, I might skip or create (but creation is admin).
    // Let's assume achievements table has these.
    // I'll fetch all achievements first.
    const { data: dbAchievements } = await supabase
      .from("achievements")
      .select("*");
    if (!dbAchievements) return;

    for (const m of milestones) {
      if (m.condition()) {
        const dbAchievement = dbAchievements.find((a) => a.title === m.title);
        if (dbAchievement && !unlockedIds.has(dbAchievement.id)) {
          // Unlock!
          await supabase.from("user_achievements").insert({
            user_id: userId,
            achievement_id: dbAchievement.id,
            unlocked_at: new Date().toISOString(),
          });
        }
      }
    }
  },
};
