import { createClient } from "@/lib/supabase/client";
import type { TimerMode } from "../types";

export interface PomodoroSessionDB {
  id?: string;
  user_id: string;
  mode: TimerMode;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  created_at?: string;
}

/**
 * Save a completed session to the database
 */
export async function saveSession(
  session: Omit<PomodoroSessionDB, "id" | "created_at">,
): Promise<PomodoroSessionDB | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .insert({
        user_id: session.user_id,
        mode: session.mode,
        start_time: session.start_time,
        end_time: session.end_time,
        duration_minutes: session.duration_minutes,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Failed to save session:", error);
    throw error;
  }
}

/**
 * Get sessions for a specific date
 */
export async function getSessionsByDate(
  userId: string,
  date: Date,
): Promise<PomodoroSessionDB[]> {
  try {
    const supabase = createClient();

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .select("*")
      .eq("user_id", userId)
      .gte("start_time", startOfDay.toISOString())
      .lte("start_time", endOfDay.toISOString())
      .order("start_time", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    throw error;
  }
}

/**
 * Get user's current streak
 * Only counts focus sessions (not breaks)
 */
export async function getCurrentStreak(userId: string): Promise<number> {
  try {
    const supabase = createClient();

    // Get all focus sessions
    const { data: sessions, error } = await supabase
      .from("pomodoro_sessions")
      .select("start_time")
      .eq("user_id", userId)
      .eq("mode", "focus")
      .order("start_time", { ascending: false });

    if (error) throw error;
    if (!sessions || sessions.length === 0) return 0;

    // Group sessions by date
    const sessionsByDate = new Map<string, number>();
    sessions.forEach((session) => {
      const date = new Date(session.start_time).toISOString().split("T")[0];
      sessionsByDate.set(date, (sessionsByDate.get(date) || 0) + 1);
    });

    // Calculate consecutive days
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user has sessions today or yesterday (to allow for timezone differences)
    const todayStr = today.toISOString().split("T")[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let currentDate = new Date(today);

    // Start from today or yesterday if no sessions today
    if (!sessionsByDate.has(todayStr)) {
      if (!sessionsByDate.has(yesterdayStr)) {
        return 0; // No recent activity
      }
      currentDate = yesterday;
    }

    // Count consecutive days backwards
    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];
      if (sessionsByDate.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Failed to calculate streak:", error);
    return 0;
  }
}

/**
 * Get user's best streak
 * Only counts focus sessions (not breaks)
 */
export async function getBestStreak(userId: string): Promise<number> {
  try {
    const supabase = createClient();

    const { data: sessions, error } = await supabase
      .from("pomodoro_sessions")
      .select("start_time")
      .eq("user_id", userId)
      .eq("mode", "focus")
      .order("start_time", { ascending: true });

    if (error) throw error;
    if (!sessions || sessions.length === 0) return 0;

    // Group sessions by date
    const sessionsByDate = new Map<string, number>();
    sessions.forEach((session) => {
      const date = new Date(session.start_time).toISOString().split("T")[0];
      sessionsByDate.set(date, (sessionsByDate.get(date) || 0) + 1);
    });

    // Find longest streak
    const dates = Array.from(sessionsByDate.keys()).sort();
    let maxStreak = 0;
    let currentStreak = 0;
    let previousDate: Date | null = null;

    dates.forEach((dateStr) => {
      const currentDate = new Date(dateStr);

      if (previousDate) {
        const dayDiff = Math.floor(
          (currentDate.getTime() - previousDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        if (dayDiff === 1) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      previousDate = currentDate;
    });

    maxStreak = Math.max(maxStreak, currentStreak);
    return maxStreak;
  } catch (error) {
    console.error("Failed to calculate best streak:", error);
    return 0;
  }
}
