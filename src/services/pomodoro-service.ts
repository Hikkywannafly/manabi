import { createClient } from "@/lib/supabase/client";
import { achievementService } from "./achievement-service";

export type PomodoroSession = {
  id: string;
  user_id: string;
  mode: "focus" | "shortBreak" | "longBreak";
  start_time: string;
  end_time: string;
  duration_minutes: number;
  created_at: string;
};

export const pomodoroService = {
  async createSession(
    session: Omit<PomodoroSession, "id" | "created_at" | "user_id">,
  ) {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .insert({
        user_id: user.id,
        ...session,
      })
      .select()
      .single();

    if (error) throw error;

    // Update user_stats
    const today = new Date().toISOString().split("T")[0];

    // First get current stats for today to increment safely (or use upsert with RPC if possible, but simple upsert works if we read first or rely on unique constraint)
    // Supabase upsert:
    void (await supabase.rpc("increment_user_stats", {
      row_user_id: user.id,
      row_date: today,
      minutes: session.duration_minutes,
    }));

    // If RPC doesn't exist (we didn't create it), we do read-modify-write or simple upsert if we can.
    // Since we didn't create RPC, let's do read-modify-write for now, or just insert/update.
    // Actually, let's add the RPC to schema.sql and assume user runs it, OR do it in code.
    // Doing it in code:
    const { data: existingStats } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    if (existingStats) {
      await supabase
        .from("user_stats")
        .update({
          focus_minutes: existingStats.focus_minutes + session.duration_minutes,
          sessions_count: existingStats.sessions_count + 1,
        })
        .eq("id", existingStats.id);
    } else {
      await supabase.from("user_stats").insert({
        user_id: user.id,
        date: today,
        focus_minutes: session.duration_minutes,
        sessions_count: 1,
      });
    }

    // Check for achievements
    // We don't await this to avoid blocking the UI response, or we can catch errors silently
    achievementService.checkAndUnlockAchievements(user.id).catch((err) => {
      console.error("Failed to check achievements:", err);
    });

    return data;
  },

  async getSessions(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};
