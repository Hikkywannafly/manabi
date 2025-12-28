import { createClient } from "@/lib/supabase/client";
import { achievementService } from "./achievement-service";
import { statsService } from "./stats-service";

export type PomodoroSession = {
  id: string;
  user_id: string;
  mode: "focus" | "shortBreak" | "longBreak";
  start_time: string;
  end_time: string;
  duration_minutes: number;
  task_id?: string | null;
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
        mode:
          session.mode === "shortBreak"
            ? "short_break"
            : session.mode === "longBreak"
              ? "long_break"
              : session.mode,
      })
      .select()
      .single();

    if (error) throw error;

    // Update user_stats
    try {
      await statsService.incrementDailyStats(user.id, session.duration_minutes);
    } catch (err) {
      console.error("Failed to update user stats:", err);
    }

    // Check for achievements
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
